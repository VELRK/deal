<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Category extends Sk_Base_Api {

    public function index() {
        $cached = $this->get_cache('categories', 120);
        if ($cached !== null) return $this->success($cached);

        $base = base_url();

        $cats = $this->db->where('status', 1)
            ->order_by('CASE WHEN sort_order = 0 THEN 999999 ELSE sort_order END ASC, name ASC', '', false)
            ->get('categories')->result_array();

        $subs = $this->db->select('s.id, s.category_id, s.name, s.slug, s.image, s.sort_order, s.status, s.mega_menu_title_id, COALESCE(t.sort_order, 9999) as mega_title_sort_order, COALESCE(t.title, s.mega_group) as mega_group')
                 ->from('subcategories s')
                 ->join('mega_menu_titles t', 't.id = s.mega_menu_title_id', 'left')
                 ->where('s.status', 1)
                 ->get()->result_array();

        $subMap = [];
        foreach ($subs as $s) {
            $s['image_url']     = $this->_img_url($s['image'] ?? '', $base);
            $s['product_count'] = $this->db->where('subcategory_id', $s['id'])->where('status','active')->count_all_results('products');
            $subMap[$s['category_id']][] = $s;
        }
        foreach ($subMap as &$children) {
            $this->_sort_nav_children($children);
        }
        unset($children);

        $navProdRows = $this->db
            ->select('cnp.category_id, cnp.sort_order, p.id, p.name, p.slug, p.thumbnail, p.price, p.sale_price')
            ->from('category_nav_products cnp')
            ->join('products p', 'p.id = cnp.product_id AND p.status = \'active\'')
            ->order_by('cnp.sort_order, cnp.id')
            ->get()->result_array();
        $navProdMap = [];
        foreach ($navProdRows as $r) {
            $r['thumbnail_url'] = $this->_img_url($r['thumbnail'] ?? '', $base);
            $navProdMap[$r['category_id']][] = $r;
        }

        foreach ($cats as &$c) {
            $c['image_url']     = $this->_img_url($c['image'] ?? '', $base);
            $c['nav_products']  = $navProdMap[$c['id']] ?? [];
            $c['product_count'] = $this->db->where('category_id', $c['id'])->where('status','active')->count_all_results('products');
            $c['children']      = $subMap[$c['id']] ?? [];
        }

        $this->set_cache('categories', $cats);
        $this->success($cats);
    }

    private function _img_url($img, $base) {
        if (!$img) return '';
        return strpos($img, 'http') === 0 ? $img : $base . $img;
    }

    /** sort_order 0 = unset (shows last); 1,2,3… = explicit nav position */
    private function _nav_sort_key($sort_order) {
        $n = (int)$sort_order;
        return $n === 0 ? 999999 : $n;
    }

    private function _sort_nav_children(array &$items) {
        usort($items, function ($a, $b) {
            $megaA = (int)($a['mega_title_sort_order'] ?? 9999);
            $megaB = (int)($b['mega_title_sort_order'] ?? 9999);
            if ($megaA !== $megaB) return $megaA <=> $megaB;

            $oa = $this->_nav_sort_key($a['sort_order'] ?? 0);
            $ob = $this->_nav_sort_key($b['sort_order'] ?? 0);
            if ($oa !== $ob) return $oa <=> $ob;

            return strcasecmp($a['name'] ?? '', $b['name'] ?? '');
        });
    }
}
