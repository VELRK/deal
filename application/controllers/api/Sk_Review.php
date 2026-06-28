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

    public function store() {
        $this->auth_required();

        $product_id = (int)($this->body()['product_id'] ?? 0);
        $rating     = max(1, min(5, (int)($this->body()['rating'] ?? 5)));
        $title      = trim($this->body()['title'] ?? '');
        $body       = trim($this->body()['body'] ?? '');

        if (!$product_id)   return $this->error('Product ID required.');
        if (empty($body))   return $this->error('Review text required.');

        $user_id = $this->user['user_id'] ?? $this->user['id'];
        $has_purchased = $this->db
            ->select('oi.id')->from('order_items oi')
            ->join('orders o', 'o.id = oi.order_id')
            ->where('oi.product_id', $product_id)->where('o.user_id', $user_id)
            ->where('o.status !=', 'cancelled')->count_all_results();
        if (!$has_purchased) {
            return $this->error('Only customers who purchased this product can submit a review.');
        }

        $exists = $this->db->where('product_id', $product_id)
                           ->where('user_id', $user_id)->count_all_results('reviews');
        if ($exists) return $this->error('You have already reviewed this product.');

        $this->db->insert('reviews', [
            'product_id' => $product_id, 'user_id' => $user_id,
            'rating' => $rating, 'title' => $title ?: null,
            'body' => $body, 'status' => 'pending',
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        $this->success(['id' => $this->db->insert_id()], 'Review submitted. It will appear after approval.');
    }
}
