<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Review extends Sk_Base_Api {

    private function _ensure_media_schema(): void {
        static $done = false;
        if ($done) return;
        $done = true;
        if ($this->db->table_exists('review_media')) {
            return;
        }
        $this->db->query("CREATE TABLE IF NOT EXISTS `review_media` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `review_id` INT UNSIGNED NOT NULL,
            `media_type` ENUM('image','video') NOT NULL DEFAULT 'image',
            `file_path` VARCHAR(255) NOT NULL,
            `sort_order` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_review_media_review` (`review_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    }

    private function _media_for_reviews(array $reviewIds): array {
        $this->_ensure_media_schema();
        if (empty($reviewIds) || !$this->db->table_exists('review_media')) {
            return [];
        }
        $rows = $this->db
            ->where_in('review_id', $reviewIds)
            ->order_by('sort_order', 'ASC')
            ->order_by('id', 'ASC')
            ->get('review_media')
            ->result_array();
        $map = [];
        foreach ($rows as $row) {
            $rid = (int)$row['review_id'];
            $path = $row['file_path'];
            $item = [
                'id'         => (int)$row['id'],
                'media_type' => $row['media_type'],
                'file_path'  => $path,
                'url'        => (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0)
                    ? $path
                    : base_url($path),
            ];
            $map[$rid][] = $item;
        }
        return $map;
    }

    public function get_by_product($product_id) {
        $this->_ensure_media_schema();
        $key    = 'reviews_v2_' . (int)$product_id;
        $cached = $this->get_cache($key, 60);
        if ($cached !== null) return $this->success($cached);

        $rows = $this->db
            ->select('r.id, r.rating, r.title, r.body, r.created_at, u.name AS user_name')
            ->from('reviews r')
            ->join('users u', 'u.id = r.user_id', 'left')
            ->where('r.product_id', (int)$product_id)
            ->where('r.status', 'approved')
            ->order_by('r.created_at', 'DESC')
            ->get()->result_array();

        $ids = array_column($rows, 'id');
        $mediaMap = $this->_media_for_reviews($ids);
        foreach ($rows as &$row) {
            $media = $mediaMap[(int)$row['id']] ?? [];
            $row['images'] = array_values(array_filter($media, function ($m) {
                return ($m['media_type'] ?? '') === 'image';
            }));
            $row['videos'] = array_values(array_filter($media, function ($m) {
                return ($m['media_type'] ?? '') === 'video';
            }));
            $row['media'] = $media;
        }
        unset($row);

        $this->set_cache($key, $rows);
        $this->success($rows);
    }

    /** Check whether the current user may submit a review for this product. */
    public function eligibility($product_id) {
        $product_id = (int)$product_id;
        if (!$product_id) {
            return $this->error('Product ID required.');
        }

        $user = $this->sk_jwt->get_user_from_request();
        if (!$user) {
            return $this->success([
                'can_review' => false,
                'reason'     => 'login_required',
                'message'    => 'Please log in to write a review.',
            ]);
        }

        $user_id = (int)($user['user_id'] ?? $user['id']);

        if ($this->_user_has_review($user_id, $product_id)) {
            return $this->success([
                'can_review' => false,
                'reason'     => 'already_reviewed',
                'message'    => 'You have already reviewed this product.',
            ]);
        }

        $purchase = $this->Sk_Order_model->user_purchased_product($user_id, $product_id);
        if (!$purchase) {
            return $this->success([
                'can_review' => false,
                'reason'     => 'purchase_required',
                'message'    => 'Only customers who purchased this product can write a review.',
            ]);
        }

        return $this->success([
            'can_review' => true,
            'order_id'   => $purchase['order_id'],
            'message'    => 'You can write a review for this product. Photos and one video are optional.',
        ]);
    }

    public function store() {
        $this->auth_required();
        $this->_ensure_media_schema();

        // JSON body or multipart form fields
        $data = $this->body();
        if (empty($data)) {
            $data = [
                'product_id' => $this->input->post('product_id'),
                'rating'     => $this->input->post('rating'),
                'title'      => $this->input->post('title'),
                'body'       => $this->input->post('body'),
            ];
        }

        $product_id = (int)($data['product_id'] ?? 0);
        $rating     = max(1, min(5, (int)($data['rating'] ?? 5)));
        $title      = trim((string)($data['title'] ?? ''));
        $body       = trim((string)($data['body'] ?? ''));

        if (!$product_id)   return $this->error('Product ID required.');
        if ($body === '')   return $this->error('Review text required.');

        $user_id = (int)($this->user['user_id'] ?? $this->user['id']);

        if ($this->_user_has_review($user_id, $product_id)) {
            return $this->error('You have already reviewed this product.');
        }

        $purchase = $this->Sk_Order_model->user_purchased_product($user_id, $product_id);
        if (!$purchase) {
            return $this->error('Only customers who purchased this product can submit a review.', 403);
        }

        $this->db->insert('reviews', [
            'product_id' => $product_id,
            'user_id'    => $user_id,
            'order_id'   => $purchase['order_id'],
            'rating'     => $rating,
            'title'      => $title !== '' ? $title : null,
            'body'       => $body,
            'status'     => 'pending',
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        $reviewId = (int)$this->db->insert_id();

        $uploaded = $this->_save_review_media($reviewId);

        $this->success([
            'id'    => $reviewId,
            'media' => $uploaded,
        ], 'Review submitted. It will appear after approval.');
    }

    private function _save_review_media(int $reviewId): array {
        if (!$this->db->table_exists('review_media') || $reviewId < 1) {
            return [];
        }

        $dir = FCPATH . 'assets/uploads/reviews/';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }

        $saved = [];
        $sort  = 0;

        // images[] multiple
        if (!empty($_FILES['images']) && is_array($_FILES['images']['name'])) {
            $count = count($_FILES['images']['name']);
            $maxImages = min(5, $count);
            for ($i = 0; $i < $maxImages; $i++) {
                if (empty($_FILES['images']['name'][$i]) || (int)$_FILES['images']['error'][$i] !== UPLOAD_ERR_OK) {
                    continue;
                }
                $path = $this->_move_upload_file([
                    'name'     => $_FILES['images']['name'][$i],
                    'type'     => $_FILES['images']['type'][$i],
                    'tmp_name' => $_FILES['images']['tmp_name'][$i],
                    'error'    => $_FILES['images']['error'][$i],
                    'size'     => $_FILES['images']['size'][$i],
                ], $dir, 'jpg|jpeg|png|gif|webp', 5120);
                if (!$path) continue;
                $this->db->insert('review_media', [
                    'review_id'  => $reviewId,
                    'media_type' => 'image',
                    'file_path'  => $path,
                    'sort_order' => $sort++,
                ]);
                $saved[] = ['media_type' => 'image', 'file_path' => $path, 'url' => base_url($path)];
            }
        }

        // single video
        if (!empty($_FILES['video']['name']) && (int)$_FILES['video']['error'] === UPLOAD_ERR_OK) {
            $path = $this->_move_upload_file($_FILES['video'], $dir, 'mp4|webm|mov|m4v', 25600);
            if ($path) {
                $this->db->insert('review_media', [
                    'review_id'  => $reviewId,
                    'media_type' => 'video',
                    'file_path'  => $path,
                    'sort_order' => $sort++,
                ]);
                $saved[] = ['media_type' => 'video', 'file_path' => $path, 'url' => base_url($path)];
            }
        }

        return $saved;
    }

    /**
     * Upload one file via CI Upload library using a temporary $_FILES slot.
     */
    private function _move_upload_file(array $file, string $dir, string $allowed, int $maxKb): ?string {
        if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return null;
        }
        $_FILES['__review_media'] = $file;
        $config = [
            'upload_path'   => $dir,
            'allowed_types' => $allowed,
            'max_size'      => $maxKb,
            'file_name'     => uniqid('rev_', true),
            'encrypt_name'  => false,
        ];
        $this->load->library('upload');
        $this->upload->initialize($config, true);
        if (!$this->upload->do_upload('__review_media')) {
            log_message('error', 'Review media upload: ' . $this->upload->display_errors('', ''));
            unset($_FILES['__review_media']);
            return null;
        }
        $name = $this->upload->data('file_name');
        unset($_FILES['__review_media']);
        return 'assets/uploads/reviews/' . $name;
    }

    private function _user_has_review($user_id, $product_id) {
        return (bool)$this->db
            ->where('product_id', (int)$product_id)
            ->where('user_id', (int)$user_id)
            ->count_all_results('reviews');
    }
}
