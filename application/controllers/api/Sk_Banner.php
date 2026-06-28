<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Banner extends Sk_Base_Api {

    public function index() {
        $cached = $this->get_cache('banners_hero', 120);
        if ($cached !== null) return $this->success($cached);

        $banners = $this->db->where('status', 1)->where('type', 'hero')
            ->order_by('sort_order', 'ASC')->get('sk_banners')->result_array();
        $this->_add_image_url($banners);

        $this->set_cache('banners_hero', $banners);
        $this->success($banners);
    }

    public function collection() {
        $cached = $this->get_cache('banners_collection', 120);
        if ($cached !== null) return $this->success($cached);

        $banners = $this->db->where('status', 1)->where('type', 'collection')
            ->order_by('sort_order', 'ASC')->get('sk_banners')->result_array();
        $this->_add_image_url($banners);

        $this->set_cache('banners_collection', $banners);
        $this->success($banners);
    }

    public function offer() {
        $cached = $this->get_cache('banners_offer', 120);
        if ($cached !== null) return $this->success($cached);

        $banner = $this->db->where('status', 1)->where('type', 'offer')
            ->order_by('sort_order', 'ASC')->limit(1)->get('sk_banners')->row_array();
        if ($banner) $this->_add_image_url($arr = [&$banner]);

        $data = $banner ?: null;
        $this->set_cache('banners_offer', $data);
        $this->success($data);
    }

    private function _add_image_url(&$banners) {
        $base = base_url();
        foreach ($banners as &$b) {
            $img = $b['image'] ?? '';
            $b['image_url'] = (!$img) ? '' : (strpos($img, 'http') === 0 ? $img : $base . $img);
        }
    }
}
