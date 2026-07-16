<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Variant_unit_model extends CI_Model {

    public function get_all_active() {
        return $this->db->where('status', 1)
                        ->order_by('sort_order', 'ASC')
                        ->order_by('name', 'ASC')
                        ->get('variant_units')
                        ->result_array();
    }

    public function get_all() {
        return $this->db->order_by('sort_order', 'ASC')
                        ->order_by('name', 'ASC')
                        ->get('variant_units')
                        ->result_array();
    }

    public function get_by_id($id) {
        return $this->db->where('id', (int)$id)->get('variant_units')->row_array();
    }

    public function create($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert('variant_units', $data);
        return $this->db->insert_id();
    }

    public function update($id, $data) {
        $this->db->where('id', (int)$id)->update('variant_units', $data);
        return $this->db->affected_rows();
    }

    public function delete($id) {
        $in_use = $this->db->where('unit_id', (int)$id)->count_all_results('product_variants');
        if ($in_use > 0) return false;
        $this->db->where('id', (int)$id)->delete('variant_units');
        return true;
    }

    public function make_unique_slug($name, $exclude_id = null) {
        $slug = url_title(strtolower($name), '-', TRUE);
        $base = $slug;
        $i = 1;
        while (TRUE) {
            $this->db->where('slug', $slug);
            if ($exclude_id) $this->db->where('id !=', (int)$exclude_id);
            if ($this->db->count_all_results('variant_units') === 0) break;
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }

    public static function format_label($unit_value, $unit) {
        $value = rtrim(rtrim(number_format((float)$unit_value, 3, '.', ''), '0'), '.');
        $symbol = trim($unit['symbol'] ?? $unit['name'] ?? '');
        if ($value === '1' && in_array($unit['slug'] ?? '', ['box','pack','piece','unit','carton','bag','bottle','strip','roll','set','bundle','tray','sachet','can','tub','dozen'], true)) {
            return '1 ' . ($unit['name'] ?? $symbol);
        }
        return trim($value . ' ' . $symbol);
    }
}
