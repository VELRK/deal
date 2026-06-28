<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Categories extends Sk_Base {

    public function index() {
        $data['title']            = 'Categories';
        $data['categories']       = $this->Sk_Admin_model->get_categories();
        $data['subcategories']    = $this->Sk_Admin_model->get_subcategories();
        $data['mega_menu_titles'] = $this->Sk_Admin_model->get_mega_menu_titles();
        // Products list for nav product picker (id + name only)
        $data['all_products']     = $this->db
            ->select('id, name')
            ->where('status', 'active')
            ->order_by('name')
            ->get('products')->result_array();
        $this->render('categories/list', $data);
    }

    // ── Category CRUD ─────────────────────────────────────────
    public function store() {
        $d = [
            'name'        => $this->input->post('name', TRUE),
            'description' => $this->input->post('description', TRUE),
            'sort_order'  => (int)$this->input->post('sort_order'),
            'status'      => (int)$this->input->post('status'),
        ];
        $img = $this->upload_file('image', 'categories');
        if ($img) $d['image'] = $img;
        $category_id = $this->Sk_Admin_model->save_category($d);
        $this->_save_nav_products($category_id);
        $this->json(['success' => true]);
    }

    public function edit($id) {
        $cat          = $this->Sk_Admin_model->get_category($id);
        $nav_products = $this->Sk_Admin_model->get_category_nav_products($id);
        $selected_ids = array_column($nav_products, 'product_id');
        $this->json(['success' => true, 'data' => $cat, 'selected_product_ids' => $selected_ids]);
    }

    public function update($id) {
        $d = [
            'id'          => $id,
            'name'        => $this->input->post('name', TRUE),
            'description' => $this->input->post('description', TRUE),
            'sort_order'  => (int)$this->input->post('sort_order'),
            'status'      => (int)$this->input->post('status'),
        ];
        $img = $this->upload_file('image', 'categories');
        if ($img) $d['image'] = $img;
        $this->Sk_Admin_model->save_category($d);
        $this->_save_nav_products($id);
        $this->json(['success' => true]);
    }

    private function _save_nav_products($category_id) {
        $ids = $this->input->post('nav_product_ids');
        if ($ids === null) return; // field not submitted — don't wipe existing
        $ids = is_array($ids) ? $ids : [];
        $this->Sk_Admin_model->save_category_nav_products($category_id, $ids);
    }

    public function delete($id) {
        $this->Sk_Admin_model->delete_category($id);
        $this->json(['success' => true]);
    }

    // ── Subcategory CRUD ──────────────────────────────────────
    public function sub_store() {
        $d = [
            'category_id'        => (int)$this->input->post('category_id'),
            'name'               => $this->input->post('name', TRUE),
            'mega_menu_title_id' => $this->input->post('mega_menu_title_id') ?: null,
            'description'        => $this->input->post('description', TRUE),
            'sort_order'         => (int)$this->input->post('sort_order'),
            'status'             => (int)$this->input->post('status'),
        ];
        if (!$d['name'] || !$d['category_id']) return $this->json(['success' => false, 'message' => 'Required fields missing']);
        $img = $this->upload_file('image', 'subcategories');
        if ($img) $d['image'] = $img;
        $this->Sk_Admin_model->save_subcategory($d);
        $this->json(['success' => true]);
    }

    public function sub_edit($id) {
        $this->json(['success' => true, 'data' => $this->Sk_Admin_model->get_subcategory($id)]);
    }

    public function sub_update($id) {
        $d = [
            'id'                 => $id,
            'category_id'        => (int)$this->input->post('category_id'),
            'name'               => $this->input->post('name', TRUE),
            'mega_menu_title_id' => $this->input->post('mega_menu_title_id') ?: null,
            'description'        => $this->input->post('description', TRUE),
            'sort_order'         => (int)$this->input->post('sort_order'),
            'status'             => (int)$this->input->post('status'),
        ];
        $img = $this->upload_file('image', 'subcategories');
        if ($img) $d['image'] = $img;
        $this->Sk_Admin_model->save_subcategory($d);
        $this->json(['success' => true]);
    }

    public function sub_delete($id) {
        $this->Sk_Admin_model->delete_subcategory($id);
        $this->json(['success' => true]);
    }

    // ── Mega Menu Titles CRUD ────────────────────────────────
    public function title_store() {
        $d = [
            'title'      => $this->input->post('title', TRUE),
            'sort_order' => (int)$this->input->post('sort_order'),
        ];
        if (!$d['title']) return $this->json(['success' => false, 'message' => 'Title is required']);
        $this->Sk_Admin_model->save_mega_menu_title($d);
        $this->json(['success' => true]);
    }

    public function title_update($id) {
        $d = [
            'id'         => $id,
            'title'      => $this->input->post('title', TRUE),
            'sort_order' => (int)$this->input->post('sort_order'),
        ];
        $this->Sk_Admin_model->save_mega_menu_title($d);
        $this->json(['success' => true]);
    }

    public function title_delete($id) {
        $this->Sk_Admin_model->delete_mega_menu_title($id);
        $this->json(['success' => true]);
    }
}
