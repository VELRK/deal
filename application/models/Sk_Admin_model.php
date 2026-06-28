<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Admin_model extends CI_Model {

    public function get_by_email($email) {
        return $this->db->where('email', $email)->where('status', 1)->get('admins')->row_array();
    }

    public function get_by_id($id) {
        return $this->db->where('id', $id)->get('admins')->row_array();
    }

    public function verify_password($plain, $hash) {
        return password_verify($plain, $hash);
    }

    public function update_last_login($id) {
        $this->db->where('id', $id)->update('admins', ['last_login' => date('Y-m-d H:i:s')]);
    }

    public function update($id, $data) {
        if (!empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        $this->db->where('id', $id)->update('admins', $data);
    }

    // Settings
    public function get_settings($group = null) {
        if ($group) $this->db->where('group', $group);
        $rows = $this->db->get('settings')->result_array();
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['key']] = $row['value'];
        }
        return $settings;
    }

    public function get_setting($key) {
        $row = $this->db->where('key', $key)->get('settings')->row_array();
        return $row['value'] ?? null;
    }

    public function save_settings($data) {
        foreach ($data as $key => $value) {
            $exists = $this->db->where('key', $key)->count_all_results('settings');
            if ($exists) {
                $this->db->where('key', $key)->update('settings', ['value' => $value]);
            } else {
                $this->db->insert('settings', ['key' => $key, 'value' => $value, 'group' => 'general']);
            }
        }
    }

    // ── Categories ────────────────────────────────────────────
    public function get_categories($status = null) {
        if ($status !== null) $this->db->where('status', $status);
        return $this->db->order_by('sort_order,name')->get('categories')->result_array();
    }

    public function get_category($id) {
        return $this->db->where('id', $id)->get('categories')->row_array();
    }

    public function save_category($data) {
        $data['slug'] = $this->make_unique_slug($data['name'], 'categories', $data['id'] ?? null);
        if (!empty($data['id'])) {
            $id = $data['id']; unset($data['id']);
            $this->db->where('id', $id)->update('categories', $data);
            return $id;
        }
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert('categories', $data);
        return $this->db->insert_id();
    }

    public function delete_category($id) {
        $this->db->where('id', $id)->delete('categories');
    }

    // ── Category Nav Products (navbar product cards) ─────────
    public function get_category_nav_products($category_id) {
        return $this->db
            ->select('cnp.product_id, cnp.sort_order, p.name, p.slug, p.thumbnail, p.price, p.sale_price')
            ->from('category_nav_products cnp')
            ->join('products p', 'p.id = cnp.product_id', 'left')
            ->where('cnp.category_id', $category_id)
            ->where('p.status', 'active')
            ->order_by('cnp.sort_order, cnp.id')
            ->get()->result_array();
    }

    public function save_category_nav_products($category_id, array $product_ids) {
        $this->db->where('category_id', $category_id)->delete('category_nav_products');
        foreach (array_values($product_ids) as $i => $pid) {
            $pid = (int)$pid;
            if (!$pid) continue;
            $this->db->insert('category_nav_products', [
                'category_id' => $category_id,
                'product_id'  => $pid,
                'sort_order'  => $i,
            ]);
        }
    }

    // ── Subcategories ─────────────────────────────────────────
    public function get_subcategories($category_id = null, $status = null) {
        if ($category_id !== null) $this->db->where('category_id', $category_id);
        if ($status !== null)      $this->db->where('status', $status);
        return $this->db->order_by('sort_order,name')->get('subcategories')->result_array();
    }

    public function get_subcategory($id) {
        return $this->db->where('id', $id)->get('subcategories')->row_array();
    }

    public function save_subcategory($data) {
        $data['slug'] = $this->make_unique_slug($data['name'], 'subcategories', $data['id'] ?? null);
        if (!empty($data['id'])) {
            $id = $data['id']; unset($data['id']);
            $this->db->where('id', $id)->update('subcategories', $data);
            return $id;
        }
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert('subcategories', $data);
        return $this->db->insert_id();
    }

    public function delete_subcategory($id) {
        $this->db->where('id', $id)->delete('subcategories');
    }

    // ── Mega Menu Titles ──────────────────────────────────────
    public function get_mega_menu_titles() {
        return $this->db->order_by('sort_order, title')->get('mega_menu_titles')->result_array();
    }

    public function save_mega_menu_title($data) {
        if (!empty($data['id'])) {
            $id = $data['id']; unset($data['id']);
            $this->db->where('id', $id)->update('mega_menu_titles', $data);
            return $id;
        }
        $this->db->insert('mega_menu_titles', $data);
        return $this->db->insert_id();
    }

    public function delete_mega_menu_title($id) {
        $this->db->where('id', $id)->delete('mega_menu_titles');
    }

    private function make_unique_slug($name, $table, $exclude_id = null) {
        $slug = url_title(strtolower($name), '-', TRUE);
        $base = $slug;
        $i = 1;
        while (TRUE) {
            $this->db->where('slug', $slug);
            if ($exclude_id) $this->db->where('id !=', $exclude_id);
            if ($this->db->count_all_results($table) === 0) break;
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }

    // Saree-specific lookups
    public function get_saree_styles() {
        return $this->db->where('status', 1)->order_by('name')->get('saree_styles')->result_array();
    }

    public static function fabric_options() {
        return ['Silk','Cotton','Chiffon','Georgette','Linen','Crepe','Net','Organza',
                'Satin','Velvet','Tussar Silk','Art Silk','Banarasi Silk','Kanjivaram Silk',
                'Raw Silk','Handloom Cotton','Khadi','Chanderi Silk','Modal','Poly Silk'];
    }

    public static function occasion_options() {
        return ['Wedding','Bridal','Festival','Party','Casual','Office / Formal',
                'Puja / Religious','Anniversary','Reception','Mehendi','Sangeet'];
    }

    public static function work_type_options() {
        return ['Zari Work','Embroidery','Printed','Plain','Woven','Sequence / Sequin',
                'Block Print','Kalamkari','Batik','Bandhani / Tie-Dye','Digital Print',
                'Handpainted','Mirror Work','Cutwork','Thread Work','Stone Work'];
    }

    public static function wash_care_options() {
        return ['Dry Clean Only','Hand Wash Cold','Machine Wash Gentle','Dry in Shade',
                'Do Not Bleach','Iron on Low Heat'];
    }

    public static function origin_states() {
        return ['Uttar Pradesh (Varanasi)','Tamil Nadu','Gujarat','Maharashtra','Karnataka',
                'West Bengal','Odisha','Rajasthan','Andhra Pradesh','Telangana',
                'Madhya Pradesh','Kerala','Punjab','Assam','Bihar'];
    }
}
