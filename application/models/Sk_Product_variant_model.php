<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Product_variant_model extends CI_Model {

    /** @var bool|null */
    private static $schema_ready = null;

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Variant_unit_model');
    }

    /** True when variant tables exist (safe before migration on production). */
    public function schema_ready() {
        if (self::$schema_ready !== null) {
            return self::$schema_ready;
        }
        $tables = $this->db->list_tables();
        self::$schema_ready = in_array('product_variants', $tables, true)
            && in_array('variant_units', $tables, true);
        return self::$schema_ready;
    }

    public function get_by_product($product_id, $active_only = true) {
        if (!$this->schema_ready()) {
            return [];
        }
        $this->db->select('pv.*, vu.name as unit_name, vu.slug as unit_slug, vu.symbol as unit_symbol, vu.unit_type')
                 ->from('product_variants pv')
                 ->join('variant_units vu', 'vu.id = pv.unit_id', 'left')
                 ->where('pv.product_id', (int)$product_id);
        if ($active_only) {
            $this->db->where('pv.status', 1)->where('vu.status', 1);
        }
        $rows = $this->db->order_by('pv.is_default', 'DESC')
                         ->order_by('pv.sort_order', 'ASC')
                         ->order_by('pv.id', 'ASC')
                         ->get()->result_array();
        foreach ($rows as &$row) {
            $row = $this->enrich_row($row);
        }
        return $rows;
    }

    public function get_by_id($id) {
        if (!$this->schema_ready()) {
            return null;
        }
        $row = $this->db->select('pv.*, vu.name as unit_name, vu.slug as unit_slug, vu.symbol as unit_symbol, vu.unit_type')
                        ->from('product_variants pv')
                        ->join('variant_units vu', 'vu.id = pv.unit_id', 'left')
                        ->where('pv.id', (int)$id)
                        ->get()->row_array();
        return $row ? $this->enrich_row($row) : null;
    }

    public function get_default_for_product($product_id) {
        $rows = $this->get_by_product($product_id);
        if (empty($rows)) return null;
        foreach ($rows as $row) {
            if (!empty($row['is_default'])) return $row;
        }
        return $rows[0];
    }

    public function replace_for_product($product_id, array $variants) {
        if (!$this->schema_ready()) {
            return;
        }
        $this->db->where('product_id', (int)$product_id)->delete('product_variants');
        if (empty($variants)) return;

        $has_default = false;
        foreach ($variants as $i => $v) {
            if (!empty($v['is_default'])) $has_default = true;
        }

        foreach ($variants as $i => $v) {
            $unit_id = (int)($v['unit_id'] ?? 0);
            if (!$unit_id) continue;
            $unit = $this->Sk_Variant_unit_model->get_by_id($unit_id);
            if (!$unit) continue;

            $unit_value = (float)($v['unit_value'] ?? 1);
            $label = trim($v['label'] ?? '');
            if ($label === '') {
                $label = Sk_Variant_unit_model::format_label($unit_value, $unit);
            }

            $this->db->insert('product_variants', [
                'product_id'  => (int)$product_id,
                'unit_id'     => $unit_id,
                'label'       => $label,
                'unit_value'  => $unit_value,
                'price'       => (float)($v['price'] ?? 0),
                'sale_price'  => ($v['sale_price'] ?? '') !== '' && $v['sale_price'] !== null ? (float)$v['sale_price'] : null,
                'stock'       => (int)($v['stock'] ?? 0),
                'sku'         => $v['sku'] ?? null,
                'image'       => $v['image'] ?? null,
                'is_default'  => !empty($v['is_default']) || (!$has_default && $i === 0) ? 1 : 0,
                'sort_order'  => (int)($v['sort_order'] ?? $i),
                'status'      => 1,
                'created_at'  => date('Y-m-d H:i:s'),
            ]);
        }
    }

    public function enrich_row(array $row) {
        $unit = [
            'name'   => $row['unit_name'] ?? '',
            'symbol' => $row['unit_symbol'] ?? '',
            'slug'   => $row['unit_slug'] ?? '',
        ];
        if (empty($row['label'])) {
            $row['label'] = Sk_Variant_unit_model::format_label($row['unit_value'] ?? 1, $unit);
        }
        $base = (float)($row['price'] ?? 0);
        $sale = isset($row['sale_price']) ? (float)$row['sale_price'] : null;
        $row['effective_price'] = ($sale !== null && $sale > 0 && $sale < $base) ? $sale : $base;
        $row['sale_active'] = ($sale !== null && $sale > 0 && $sale < $base) ? 1 : 0;
        if (!empty($row['image'])) {
            $row['image_url'] = base_url($row['image']);
        }
        return $row;
    }
}
