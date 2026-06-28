<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Testimonial extends Sk_Base_Api {

    public function index() {
        $cached = $this->get_cache('testimonials', 120);
        if ($cached !== null) return $this->success($cached);

        $rows = $this->db
            ->select('t.id, t.author_name, t.author_title, t.quote, t.rating,
                      t.product_id, p.name AS product_name, p.slug AS product_slug,
                      p.price AS product_price, p.sale_price AS product_sale_price,
                      p.thumbnail AS product_thumbnail')
            ->from('sk_testimonials t')
            ->join('products p', 'p.id = t.product_id', 'left')
            ->where('t.status', 1)
            ->order_by('t.sort_order', 'ASC')
            ->order_by('t.created_at', 'DESC')
            ->get()->result_array();

        $base = base_url();
        foreach ($rows as &$r) {
            $r['product_image_url'] = !empty($r['product_thumbnail'])
                ? $base . $r['product_thumbnail'] : null;
        }
        unset($r);

        $this->set_cache('testimonials', $rows);
        $this->success($rows);
    }
}
