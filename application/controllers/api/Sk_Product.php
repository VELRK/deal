<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Product extends Sk_Base_Api {

    public function index() {
        $key    = 'products_' . md5(json_encode($_GET));
        $cached = $this->get_cache($key, 60);
        if ($cached !== null) return $this->success($cached);

        $category_id   = $this->input->get('category_id');
        $category_slug = $this->input->get('category_slug', TRUE);
        if (!$category_id && $category_slug) {
            $cat = $this->db->where('slug', $category_slug)->get('categories')->row_array();
            if ($cat) $category_id = $cat['id'];
        }

        $filters = [
            'category_id'    => $category_id,
            'subcategory_id' => $this->input->get('subcategory_id'),
            'brand_id'       => $this->input->get('brand_id'),
            'search'         => $this->input->get('q', TRUE),
            'featured'       => $this->input->get('featured'),
            'nav_featured'   => $this->input->get('nav_featured'),
            'special_product'=> $this->input->get('special_product'),
            'min_price'      => $this->input->get('min_price'),
            'max_price'      => $this->input->get('max_price'),
            'sort'           => $this->input->get('sort'),
            'status'         => 'active',
            'fabric'         => $this->input->get('fabric', TRUE),
            'saree_type'     => $this->input->get('saree_type', TRUE),
            'occasion'       => $this->input->get('occasion', TRUE),
        ];
        $limit  = min((int)($this->input->get('limit') ?? 20), 100);
        $page   = max(1, (int)($this->input->get('page') ?? 1));
        $offset = ($page - 1) * $limit;

        $result = $this->Sk_Product_model->get_all($filters, $limit, $offset);

        $data = [
            'products'    => $result['data'],
            'total'       => $result['total'],
            'page'        => $page,
            'limit'       => $limit,
            'total_pages' => ceil($result['total'] / $limit),
        ];
        $this->set_cache($key, $data);
        $this->success($data);
    }

    public function show($id) {
        $key    = 'product_' . $id;
        $cached = $this->get_cache($key, 60);
        if ($cached !== null) return $this->success($cached);

        $product = is_numeric($id)
            ? $this->Sk_Product_model->get_by_id($id)
            : $this->Sk_Product_model->get_by_slug($id);
        if (!$product || $product['status'] !== 'active') {
            return $this->error('Product not found.', 404);
        }
        $product['related'] = $this->Sk_Product_model->get_related($product['id'], $product['category_id']);

        $this->load->model('Sk_Seo_model');
        $product['seo'] = $this->Sk_Seo_model->format_entity($product, 'product', $this->Sk_Seo_model->get_global_seo());

        $this->set_cache($key, $product);
        $this->success($product);
    }

    public function search() {
        $q = $this->input->get('q', TRUE);
        if (!$q) return $this->error('Search query required.');
        $result = $this->Sk_Product_model->get_all(['search' => $q, 'status' => 'active'], 20, 0);
        $this->success($result['data']);
    }
}
