<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Wishlists extends Sk_Base {

    public function index() {
        $search = $this->input->get('search', TRUE);
        $page   = max(1, (int)($this->input->get('page') ?? 1));
        $limit  = 20;
        $offset = ($page - 1) * $limit;

        $this->db->select('w.id, w.created_at, u.name AS user_name, u.email AS user_email, p.name AS product_name, p.thumbnail, p.price, p.sale_price, p.id AS product_id')
                 ->from('wishlist w')
                 ->join('users u', 'u.id = w.user_id', 'left')
                 ->join('products p', 'p.id = w.product_id', 'left');

        if ($search) {
            $this->db->group_start()
                     ->like('u.name', $search)
                     ->or_like('u.email', $search)
                     ->or_like('p.name', $search)
                     ->group_end();
        }

        $total = $this->db->count_all_results('', FALSE);

        $wishlists = $this->db->order_by('w.created_at', 'DESC')
                               ->limit($limit, $offset)
                               ->get()->result_array();

        $data['title']     = 'Wishlists';
        $data['wishlists'] = $wishlists;
        $data['total']     = $total;
        $data['page']      = $page;
        $data['limit']     = $limit;
        $data['search']    = $search;
        $this->render('wishlists/list', $data);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete('wishlist');
        $this->json(['success' => true]);
    }

    public function delete_user($user_id) {
        $this->db->where('user_id', $user_id)->delete('wishlist');
        $this->json(['success' => true]);
    }
}
