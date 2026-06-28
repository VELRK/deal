<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Product_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    // ── Get paginated product list with filters ──────────────────────────────
    public function get_all($filters = [], $limit = 20, $offset = 0) {
        $this->db->select('p.*, c.name as category_name, sc.name as subcategory_name, b.name as brand_name')
                 ->from('products p')
                 ->join('categories c', 'c.id = p.category_id', 'left')
                 ->join('subcategories sc', 'sc.id = p.subcategory_id', 'left')
                 ->join('brands b', 'b.id = p.brand_id', 'left');

        if (!empty($filters['category_id'])) {
            $this->db->where('p.category_id', $filters['category_id']);
        }
        if (!empty($filters['subcategory_id'])) {
            $this->db->where('p.subcategory_id', $filters['subcategory_id']);
        }
        if (!empty($filters['brand_id'])) {
            $this->db->where('p.brand_id', $filters['brand_id']);
        }
        if (!empty($filters['status'])) {
            $this->db->where('p.status', $filters['status']);
        } else {
            $this->db->where('p.status', 'active');
        }
        if (!empty($filters['featured'])) {
            $this->db->where('p.featured', 1);
        }
        if (!empty($filters['nav_featured'])) {
            $this->db->where('p.nav_featured', 1);
        }
        if (!empty($filters['special_product'])) {
            $this->db->where('p.special_product', 1);
        }
        if (!empty($filters['search'])) {
            $this->db->group_start()
                     ->like('p.name', $filters['search'])
                     ->or_like('p.sku', $filters['search'])
                     ->or_like('p.tags', $filters['search'])
                     ->or_like('p.saree_type', $filters['search'])
                     ->or_like('p.fabric', $filters['search'])
                     ->or_like('p.color', $filters['search'])
                     ->or_like('p.origin_state', $filters['search'])
                     ->group_end();
        }
        if (!empty($filters['min_price'])) {
            $this->db->where('p.price >=', $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $this->db->where('p.price <=', $filters['max_price']);
        }
        // Saree-specific filters
        if (!empty($filters['fabric']))      $this->db->where('p.fabric', $filters['fabric']);
        if (!empty($filters['saree_type']))  $this->db->where('p.saree_type', $filters['saree_type']);
        if (!empty($filters['occasion']))    $this->db->like('p.occasion', $filters['occasion']);
        if (!empty($filters['color']))       $this->db->like('p.color', $filters['color']);
        if (!empty($filters['work_type']))   $this->db->like('p.work_type', $filters['work_type']);
        if (!empty($filters['blouse_included'])) $this->db->where('p.blouse_included', 1);
        if (!empty($filters['origin_state'])) $this->db->where('p.origin_state', $filters['origin_state']);

        $sort_map = [
            'price_asc'   => 'p.price ASC',
            'price_desc'  => 'p.price DESC',
            'newest'      => 'p.created_at DESC',
            'popular'     => 'p.total_sold DESC',
            'rating'      => 'p.avg_rating DESC',
        ];
        $sort = $sort_map[$filters['sort'] ?? ''] ?? 'p.created_at DESC';
        $this->db->order_by($sort);

        $count_query = $this->db->get_compiled_select('', FALSE);
        $total = $this->db->query('SELECT COUNT(*) as cnt FROM (' . $count_query . ') sub')->row()->cnt;

        $this->db->limit($limit, $offset);
        $products = $this->db->get()->result_array();

        foreach ($products as &$p) {
            $p['images'] = $this->get_images($p['id']);
            $this->_decode_json_fields($p);
            $this->apply_sale_timing($p);
        }

        return ['data' => $products, 'total' => $total];
    }

    public function get_by_id($id) {
        $product = $this->db->select('p.*, c.name as category_name, b.name as brand_name')
                            ->from('products p')
                            ->join('categories c', 'c.id = p.category_id', 'left')
                            ->join('brands b', 'b.id = p.brand_id', 'left')
                            ->where('p.id', $id)
                            ->get()->row_array();
        if ($product) {
            $product['images'] = $this->get_images($id);
            $product['videos'] = $this->get_videos($id);
            $this->_decode_json_fields($product);
            $this->apply_sale_timing($product);
        }
        return $product;
    }

    public function get_by_slug($slug) {
        $product = $this->db->select('p.*, c.name as category_name, b.name as brand_name')
                            ->from('products p')
                            ->join('categories c', 'c.id = p.category_id', 'left')
                            ->join('brands b', 'b.id = p.brand_id', 'left')
                            ->where('p.slug', $slug)
                            ->where('p.status', 'active')
                            ->get()->row_array();
        if ($product) {
            $product['images'] = $this->get_images($product['id']);
            $product['videos'] = $this->get_videos($product['id']);
            $this->_decode_json_fields($product);
            $this->apply_sale_timing($product);
        }
        return $product;
    }

    public function get_videos($product_id) {
        return $this->db->where('product_id', $product_id)
                        ->order_by('sort_order', 'ASC')
                        ->get('product_videos')->result_array();
    }

    public function _decode_json_fields(&$product) {
        foreach (['features', 'category_attributes', 'colors_json'] as $field) {
            if (!empty($product[$field]) && is_string($product[$field])) {
                $decoded = json_decode($product[$field], true);
                $product[$field] = $decoded !== null ? $decoded : $product[$field];
            }
        }
        if (!empty($product['sizes']) && is_string($product['sizes'])) {
            $product['sizes'] = array_map('trim', explode(',', $product['sizes']));
        }
    }

    public function get_images($product_id) {
        return $this->db->where('product_id', $product_id)
                        ->order_by('sort_order', 'ASC')
                        ->get('product_images')->result_array();
    }

    public function create($data) {
        $data['slug'] = $this->make_unique_slug($data['name'], 'products');
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert('products', $data);
        return $this->db->insert_id();
    }

    public function update($id, $data) {
        // Never regenerate slug on update — changing slug breaks existing product URLs.
        // Slug is fixed at creation and stays stable for the product's lifetime.
        unset($data['slug']);
        $this->db->where('id', $id)->update('products', $data);
        return $this->db->affected_rows();
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete('product_images');
        $this->db->where('id', $id)->delete('products');
        return $this->db->affected_rows();
    }

    public function save_images($product_id, $images) {
        foreach ($images as $img) {
            $this->db->insert('product_images', [
                'product_id' => $product_id,
                'image'      => $img['image'],
                'alt'        => $img['alt'] ?? '',
                'sort_order' => $img['sort_order'] ?? 0,
            ]);
        }
    }

    public function delete_image($image_id, $product_id) {
        return $this->db->where(['id' => $image_id, 'product_id' => $product_id])
                        ->delete('product_images');
    }

    public function reduce_stock($product_id, $qty) {
        $this->db->set('stock', 'stock - ' . (int)$qty, FALSE)
                 ->set('total_sold', 'total_sold + ' . (int)$qty, FALSE)
                 ->where('id', $product_id)
                 ->update('products');
    }

    public function get_related($product_id, $category_id, $limit = 6) {
        $rows = $this->db->where('category_id', $category_id)
                        ->where('id !=', $product_id)
                        ->where('status', 'active')
                        ->limit($limit)
                        ->get('products')->result_array();
        foreach ($rows as &$row) {
            $this->apply_sale_timing($row);
        }
        return $rows;
    }

    private function apply_sale_timing(&$product) {
        $now        = date('Y-m-d H:i:s');
        $sale_price = isset($product['sale_price']) ? (float)$product['sale_price'] : null;
        $base_price = isset($product['price'])      ? (float)$product['price']       : 0.0;
        $start_at   = $product['sale_start_at'] ?? null;
        $end_at     = $product['sale_end_at']   ?? null;

        // sale_price is always valid unless it's outside an explicit time window
        $within_window = true;
        if (!empty($start_at) && $now < $start_at) $within_window = false;
        if (!empty($end_at)   && $now > $end_at)   $within_window = false;

        $price_valid = $sale_price !== null && $sale_price > 0 && $sale_price < $base_price;
        $sale_active = $price_valid && $within_window;

        // hot_sale only adds the "HOT SALE" badge / marquee — it does NOT gate the price
        $product['sale_active']    = $sale_active ? 1 : 0;
        $product['effective_price']= $sale_active ? $sale_price : $base_price;

        if (!$sale_active) {
            $product['sale_price'] = null;
        }
    }

    public function count_all_admin($search = '', ?int $vendor_id = null) {
        if ($vendor_id) $this->db->where('vendor_id', $vendor_id);
        if ($search) {
            $this->db->group_start()->like('name', $search)->or_like('sku', $search)->group_end();
        }
        return $this->db->count_all_results('products');
    }

    public function get_all_admin($limit, $offset, $search = '', ?int $vendor_id = null) {
        $this->db->select('p.*, c.name as category_name, v.business_name as vendor_name')
                 ->from('products p')
                 ->join('categories c', 'c.id = p.category_id', 'left')
                 ->join('vendors v', 'v.id = p.vendor_id', 'left');
        if ($vendor_id) $this->db->where('p.vendor_id', $vendor_id);
        if ($search) {
            $this->db->group_start()->like('p.name', $search)->or_like('p.sku', $search)->group_end();
        }
        $this->db->order_by('p.created_at', 'DESC')->limit($limit, $offset);
        return $this->db->get()->result_array();
    }

    private function make_unique_slug($name, $table, $exclude_id = null) {
        $slug = url_title(strtolower($name), '-', TRUE);
        $base = $slug;
        $i = 1;
        while (TRUE) {
            $this->db->where('slug', $slug);
            if ($exclude_id) $this->db->where('id !=', $exclude_id);
            $count = $this->db->count_all_results($table);
            if ($count === 0) break;
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }

    // Dashboard stats
    public function total_products(?int $vendor_id = null) {
        if ($vendor_id) $this->db->where('vendor_id', $vendor_id);
        return $this->db->count_all_results('products');
    }
    public function low_stock_count() {
        return $this->db->where('stock <=', $this->db->query('SELECT low_stock_alert FROM products LIMIT 1')->row()->low_stock_alert ?? 5)
                        ->count_all_results('products');
    }
}
