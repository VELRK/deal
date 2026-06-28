<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

/**
 * GET /shopkart-api/nav-menu
 * Returns everything the frontend header needs in a single request:
 *   - categories  (with nested subcategories grouped by mega_group)
 *   - nav_products (products flagged nav_featured = 1)
 */
class Sk_NavMenu extends Sk_Base_Api {

    public function index() {
        $base = base_url();

        /* ── Categories ─────────────────────────────────────── */
        $cats = $this->db
            ->where('status', 1)
            ->order_by('sort_order, name')
            ->get('categories')
            ->result_array();

        $subs = $this->db
            ->where('s.status', 1)
            ->order_by('s.sort_order, s.name')
            ->get('subcategories s')
            ->result_array();

        // Index subs by category_id
        $subMap = [];
        foreach ($subs as $s) {
            $s['image_url'] = $this->_img($s['image'] ?? '', $base);
            $subMap[$s['category_id']][] = $s;
        }

        // Pre-load nav products for all categories
        $navProdRows = $this->db
            ->select('cnp.category_id, cnp.sort_order, p.id, p.name, p.slug, p.thumbnail, p.price, p.sale_price')
            ->from('category_nav_products cnp')
            ->join('products p', 'p.id = cnp.product_id AND p.status = \'active\'')
            ->order_by('cnp.sort_order, cnp.id')
            ->get()->result_array();
        $navProdMap = [];
        foreach ($navProdRows as $r) {
            $r['thumbnail_url'] = $this->_img($r['thumbnail'] ?? '', $base);
            $navProdMap[$r['category_id']][] = $r;
        }

        foreach ($cats as &$c) {
            $c['image_url']    = $this->_img($c['image'] ?? '', $base);
            $c['nav_products'] = $navProdMap[$c['id']] ?? [];
            $c['children']     = $subMap[$c['id']] ?? [];
        }

        /* ── Nav-featured products ───────────────────────────── */
        $products = $this->db
            ->select('p.id, p.name, p.slug, p.thumbnail, p.price, p.sale_price')
            ->from('products p')
            ->where('p.nav_featured', 1)
            ->where('p.status', 'active')
            ->order_by('p.updated_at DESC')
            ->limit(4)
            ->get()
            ->result_array();

        foreach ($products as &$p) {
            $p['thumbnail_url'] = $this->_img($p['thumbnail'] ?? '', $base);
        }

        $this->success([
            'categories'   => $cats,
            'nav_products' => $products,
        ]);
    }

    private function _img($path, $base) {
        if (!$path) return '';
        return strpos($path, 'http') === 0 ? $path : $base . $path;
    }
}
