<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Reviews extends Sk_Base {

    public function index() {
        $status = $this->input->get('status') ?: 'pending';
        $data['title']   = 'Product Reviews';
        $data['status']  = $status;
        $data['reviews'] = $this->db
            ->select('r.*, p.name AS product_name, u.name AS user_name, u.email AS user_email')
            ->from('reviews r')
            ->join('products p', 'p.id = r.product_id', 'left')
            ->join('users u',    'u.id = r.user_id',    'left')
            ->where('r.status', $status)
            ->order_by('r.created_at', 'DESC')
            ->get()->result_array();
        $data['counts'] = [];
        foreach (['pending','approved','rejected'] as $s) {
            $data['counts'][$s] = $this->db->where('status', $s)->count_all_results('reviews');
        }
        $this->render('reviews/list', $data);
    }

    public function approve($id) {
        $this->_set_status($id, 'approved');
    }

    public function reject($id) {
        $this->_set_status($id, 'rejected');
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete('reviews');
        $this->_recalc_rating($id);
        $this->json(['success' => true]);
    }

    private function _set_status($id, $status) {
        $review = $this->db->where('id', $id)->get('reviews')->row_array();
        if (!$review) return $this->json(['success' => false], 404);
        $this->db->where('id', $id)->update('reviews', ['status' => $status]);
        $this->_recalc_rating_by_product($review['product_id']);
        $this->json(['success' => true, 'status' => $status]);
    }

    private function _recalc_rating_by_product($product_id) {
        $row = $this->db
            ->select('AVG(rating) AS avg_r, COUNT(*) AS cnt')
            ->where('product_id', $product_id)
            ->where('status', 'approved')
            ->get('reviews')->row_array();
        $this->db->where('id', $product_id)->update('products', [
            'avg_rating'   => round($row['avg_r'] ?? 0, 2),
            'review_count' => (int)($row['cnt'] ?? 0),
        ]);
    }

    private function _recalc_rating($review_id) {
        $r = $this->db->where('id', $review_id)->get('reviews')->row_array();
        if ($r) $this->_recalc_rating_by_product($r['product_id']);
    }
}
