<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Testimonials extends Sk_Base {

    public function index() {
        $data['title']        = 'Testimonials';
        $data['testimonials'] = $this->db
            ->order_by('sort_order', 'ASC')
            ->order_by('created_at', 'DESC')
            ->get('sk_testimonials')
            ->result_array();

        // Attach product names
        $product_ids = array_filter(array_column($data['testimonials'], 'product_id'));
        $products_map = [];
        if ($product_ids) {
            $rows = $this->db->select('id, name')->where_in('id', $product_ids)->get('products')->result_array();
            foreach ($rows as $r) $products_map[$r['id']] = $r['name'];
        }
        $data['products_map'] = $products_map;

        // Product list for the modal dropdown
        $data['products'] = $this->db->select('id, name')->where('status', 'active')->order_by('name', 'ASC')->get('products')->result_array();

        $this->render('testimonials/list', $data);
    }

    public function store() {
        $data = [
            'author_name'  => $this->input->post('author_name', TRUE),
            'author_title' => $this->input->post('author_title', TRUE),
            'quote'        => $this->input->post('quote', TRUE),
            'rating'       => max(1, min(5, (int) $this->input->post('rating'))),
            'product_id'   => (int) $this->input->post('product_id') ?: NULL,
            'sort_order'   => (int) $this->input->post('sort_order'),
            'status'       => 1,
            'created_at'   => date('Y-m-d H:i:s'),
        ];
        if (!$data['author_name'] || !$data['quote']) {
            return $this->json(['success' => false, 'message' => 'Author name and quote are required.']);
        }
        $this->db->insert('sk_testimonials', $data);
        $this->json(['success' => true, 'id' => $this->db->insert_id()]);
    }

    public function edit($id) {
        $row = $this->db->where('id', $id)->get('sk_testimonials')->row_array();
        if (!$row) return $this->json(['success' => false, 'message' => 'Not found'], 404);
        $this->json(['success' => true, 'data' => $row]);
    }

    public function update($id) {
        $row = $this->db->where('id', $id)->get('sk_testimonials')->row_array();
        if (!$row) return $this->json(['success' => false, 'message' => 'Not found'], 404);

        $update = [
            'author_name'  => $this->input->post('author_name', TRUE),
            'author_title' => $this->input->post('author_title', TRUE),
            'quote'        => $this->input->post('quote', TRUE),
            'rating'       => max(1, min(5, (int) $this->input->post('rating'))),
            'product_id'   => (int) $this->input->post('product_id') ?: NULL,
            'sort_order'   => (int) $this->input->post('sort_order'),
        ];
        if (!$update['author_name'] || !$update['quote']) {
            return $this->json(['success' => false, 'message' => 'Author name and quote are required.']);
        }
        $this->db->where('id', $id)->update('sk_testimonials', $update);
        $this->json(['success' => true]);
    }

    public function toggle($id) {
        $row = $this->db->where('id', $id)->get('sk_testimonials')->row_array();
        if (!$row) return $this->json(['success' => false], 404);
        $new = $row['status'] ? 0 : 1;
        $this->db->where('id', $id)->update('sk_testimonials', ['status' => $new]);
        $this->json(['success' => true, 'status' => $new]);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete('sk_testimonials');
        $this->json(['success' => true]);
    }
}
