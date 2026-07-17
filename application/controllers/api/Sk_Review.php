<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Review extends Sk_Base_Api {

    public function get_by_product($product_id) {
        $key    = 'reviews_' . (int)$product_id;
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
            'message'    => 'You can write a review for this product.',
        ]);
    }

    public function store() {
        $this->auth_required();

        $product_id = (int)($this->body()['product_id'] ?? 0);
        $rating     = max(1, min(5, (int)($this->body()['rating'] ?? 5)));
        $title      = trim($this->body()['title'] ?? '');
        $body       = trim($this->body()['body'] ?? '');

        if (!$product_id)   return $this->error('Product ID required.');
        if (empty($body))   return $this->error('Review text required.');

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
            'title'      => $title ?: null,
            'body'       => $body,
            'status'     => 'pending',
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        $this->success(['id' => $this->db->insert_id()], 'Review submitted. It will appear after approval.');
    }

    private function _user_has_review($user_id, $product_id) {
        return (bool)$this->db
            ->where('product_id', (int)$product_id)
            ->where('user_id', (int)$user_id)
            ->count_all_results('reviews');
    }
}
