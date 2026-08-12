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
                    : rtrim(base_url(), '/') . '/' . ltrim((string)$path, '/'),
            ];
            $map[$rid][] = $item;
        }
        return $map;
    }

    public function get_by_product($product_id) {
        $this->_ensure_media_schema();
        $key    = 'reviews_v3_' . (int)$product_id;
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
            $row['created_at_iso'] = sk_api_datetime($row['created_at'] ?? null);
            $row['created_at_formatted'] = sk_format_datetime($row['created_at'] ?? null);
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

        $mediaResult = $this->_save_review_media($reviewId);
        $uploaded = $mediaResult['saved'];
        $mediaErrors = $mediaResult['errors'];
        $attempted = (int)$mediaResult['attempted'];

        // If the customer attached media but none saved, roll back so they can retry
        if ($attempted > 0 && empty($uploaded)) {
            $this->db->where('id', $reviewId)->delete('reviews');
            $msg = !empty($mediaErrors)
                ? implode(' ', $mediaErrors)
                : 'Photo/video upload failed. Use JPG, PNG, WebP or GIF under 5 MB, or MP4/WebM under 25 MB.';
            return $this->error($msg, 400);
        }

        // Bust list cache so media appears once approved (and pending admin sees fresh data)
        $this->delete_cache('reviews_v3_' . $product_id);
        $this->delete_cache('reviews_v2_' . $product_id);

        $message = 'Review submitted. It will appear after approval.';
        if ($attempted > 0 && count($uploaded) < $attempted && !empty($mediaErrors)) {
            $message .= ' Some media failed: ' . implode(' ', $mediaErrors);
        }

        $this->success([
            'id'            => $reviewId,
            'media'         => $uploaded,
            'media_errors'  => $mediaErrors,
            'media_attempted' => $attempted,
        ], $message);
    }

    /**
     * @return array{saved: array, errors: string[], attempted: int}
     */
    private function _save_review_media(int $reviewId): array {
        $empty = ['saved' => [], 'errors' => [], 'attempted' => 0];
        if (!$this->db->table_exists('review_media') || $reviewId < 1) {
            return $empty;
        }

        $dir = FCPATH . 'assets/uploads/reviews/';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        if (!is_dir($dir) || !is_writable($dir)) {
            return [
                'saved' => [],
                'errors' => ['Server cannot save review media. Please try again later.'],
                'attempted' => 1,
            ];
        }

        $saved = [];
        $errors = [];
        $attempted = 0;
        $sort  = 0;

        // Normalize images[] / images into a list of file slots
        $imageSlots = $this->_normalize_file_list('images');
        if (empty($imageSlots)) {
            $imageSlots = $this->_normalize_file_list('images[]');
        }
        $maxImages = min(5, count($imageSlots));
        for ($i = 0; $i < $maxImages; $i++) {
            $attempted++;
            $store = $this->_store_uploaded_file($imageSlots[$i], $dir, ['jpg', 'jpeg', 'png', 'gif', 'webp'], 5 * 1024 * 1024, 'image');
            if (empty($store['path'])) {
                $errors[] = $store['error'] ?? 'Photo upload failed.';
                continue;
            }
            $path = $store['path'];
            $this->db->insert('review_media', [
                'review_id'  => $reviewId,
                'media_type' => 'image',
                'file_path'  => $path,
                'sort_order' => $sort++,
            ]);
            $saved[] = ['media_type' => 'image', 'file_path' => $path, 'url' => rtrim(base_url(), '/') . '/' . ltrim($path, '/')];
        }

        if (!empty($_FILES['video']['name']) && (int)($_FILES['video']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $attempted++;
            if ((int)($_FILES['video']['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
                $errors[] = $this->_upload_err_message((int)$_FILES['video']['error'], 'Video');
            } else {
                $store = $this->_store_uploaded_file($_FILES['video'], $dir, ['mp4', 'webm', 'mov', 'm4v'], 25 * 1024 * 1024, 'video');
                if (empty($store['path'])) {
                    $errors[] = $store['error'] ?? 'Video upload failed.';
                } else {
                    $path = $store['path'];
                    $this->db->insert('review_media', [
                        'review_id'  => $reviewId,
                        'media_type' => 'video',
                        'file_path'  => $path,
                        'sort_order' => $sort++,
                    ]);
                    $saved[] = ['media_type' => 'video', 'file_path' => $path, 'url' => rtrim(base_url(), '/') . '/' . ltrim($path, '/')];
                }
            }
        }

        return ['saved' => $saved, 'errors' => $errors, 'attempted' => $attempted];
    }

    /** Build a list of single-file $_FILES-shaped arrays from images / images[]. */
    private function _normalize_file_list(string $field): array {
        if (empty($_FILES[$field])) {
            return [];
        }
        $f = $_FILES[$field];
        // Single file
        if (!is_array($f['name'])) {
            if (empty($f['name'])) return [];
            if ((int)$f['error'] !== UPLOAD_ERR_OK) return [];
            return [$f];
        }
        $out = [];
        $n = count($f['name']);
        for ($i = 0; $i < $n; $i++) {
            if (empty($f['name'][$i])) continue;
            if ((int)$f['error'][$i] !== UPLOAD_ERR_OK) continue;
            $out[] = [
                'name'     => $f['name'][$i],
                'type'     => $f['type'][$i],
                'tmp_name' => $f['tmp_name'][$i],
                'error'    => $f['error'][$i],
                'size'     => $f['size'][$i],
            ];
        }
        return $out;
    }

    private function _upload_err_message(int $code, string $label = 'File'): string {
        switch ($code) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                return $label . ' is too large for the server limit.';
            case UPLOAD_ERR_PARTIAL:
                return $label . ' upload was incomplete. Please try again.';
            case UPLOAD_ERR_NO_FILE:
                return $label . ' was not received.';
            case UPLOAD_ERR_NO_TMP_DIR:
            case UPLOAD_ERR_CANT_WRITE:
                return $label . ' could not be saved on the server.';
            default:
                return $label . ' upload failed.';
        }
    }

    /**
     * Save one uploaded file with extension allow-list (avoids CI mime quirks for video).
     * @return array{path:?string,error:?string}
     */
    private function _store_uploaded_file(array $file, string $dir, array $allowedExt, int $maxBytes, string $label = 'File'): array {
        if ((int)($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
            return ['path' => null, 'error' => $this->_upload_err_message((int)$file['error'], $label)];
        }
        if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return ['path' => null, 'error' => $label . ' was not received. Please try again.'];
        }
        $size = (int)($file['size'] ?? 0);
        if ($size < 1) {
            return ['path' => null, 'error' => $label . ' is empty.'];
        }
        if ($size > $maxBytes) {
            $mb = max(1, (int)round($maxBytes / (1024 * 1024)));
            return ['path' => null, 'error' => $label . ' must be under ' . $mb . ' MB.'];
        }
        $ext = strtolower(pathinfo((string)($file['name'] ?? ''), PATHINFO_EXTENSION));
        if ($ext === '' || !in_array($ext, $allowedExt, true)) {
            return ['path' => null, 'error' => $label . ' type not allowed. Use: ' . implode(', ', $allowedExt) . '.'];
        }
        $name = 'rev_' . str_replace('.', '', uniqid('', true)) . '.' . $ext;
        $dest = rtrim($dir, '/\\') . DIRECTORY_SEPARATOR . $name;
        if (!@move_uploaded_file($file['tmp_name'], $dest)) {
            log_message('error', 'Review media move failed: ' . ($file['name'] ?? ''));
            return ['path' => null, 'error' => $label . ' could not be saved. Please try again.'];
        }
        @chmod($dest, 0644);
        return ['path' => 'assets/uploads/reviews/' . $name, 'error' => null];
    }

    private function _user_has_review($user_id, $product_id) {
        return (bool)$this->db
            ->where('product_id', (int)$product_id)
            ->where('user_id', (int)$user_id)
            ->count_all_results('reviews');
    }
}
