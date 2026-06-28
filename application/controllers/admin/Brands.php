<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Brands extends Sk_Base {

    public function index() {
        $data['title']  = 'Brands';
        $data['brands'] = $this->db->order_by('name')->get('brands')->result_array();
        $this->render('brands/list', $data);
    }

    public function store() {
        $name = $this->input->post('name', TRUE);
        if (!$name) return $this->json(['success' => false, 'message' => 'Name required']);

        $slug = $this->_unique_slug($name);
        $this->db->insert('brands', [
            'name'       => $name,
            'slug'       => $slug,
            'logo'       => $this->upload_file('logo', 'brands'),
            'status'     => 1,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        $this->json(['success' => true, 'id' => $this->db->insert_id(), 'name' => $name]);
    }

    public function edit($id) {
        $brand = $this->db->where('id', $id)->get('brands')->row_array();
        if (!$brand) return $this->json(['success' => false]);
        $this->json(['success' => true, 'data' => $brand]);
    }

    public function update($id) {
        $name = $this->input->post('name', TRUE);
        $data = [
            'name'   => $name,
            'slug'   => $this->_unique_slug($name, $id),
            'status' => (int)$this->input->post('status'),
        ];
        $logo = $this->upload_file('logo', 'brands');
        if ($logo) $data['logo'] = $logo;
        $this->db->where('id', $id)->update('brands', $data);
        $this->json(['success' => true]);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete('brands');
        $this->json(['success' => true]);
    }

    private function _unique_slug($name, $exclude_id = null) {
        $slug = url_title(strtolower($name), '-', TRUE);
        $base = $slug; $i = 1;
        while (TRUE) {
            $this->db->where('slug', $slug);
            if ($exclude_id) $this->db->where('id !=', $exclude_id);
            if ($this->db->count_all_results('brands') === 0) break;
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
}
