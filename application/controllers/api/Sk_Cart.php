<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Cart extends Sk_Base_Api {

    private function _cart_key() {
        $user = $this->sk_jwt->get_user_from_request();
        return $user
            ? ['user_id' => $user['user_id'], 'session_id' => null]
            : ['user_id' => null, 'session_id' => $this->input->get_request_header('X-Session-ID') ?? session_id()];
    }

    public function index() {
        $key   = $this->_cart_key();
        $items = $this->_get_cart_items($key);
        $this->success(['items' => $items, 'summary' => $this->_summary($items)]);
    }

    public function add() {
        $data       = $this->body();
        $product_id = (int)($data['product_id'] ?? 0);
        $quantity   = max(1, (int)($data['quantity'] ?? 1));

        $product = $this->Sk_Product_model->get_by_id($product_id);
        if (!$product || $product['status'] !== 'active') return $this->error('Product not found.');
        if ($product['stock'] < $quantity) return $this->error('Not enough stock.');

        $key = $this->_cart_key();
        $where = array_filter($key) + ['product_id' => $product_id];
        $existing = $this->db->where($where)->get('cart')->row_array();

        if ($existing) {
            $new_qty = $existing['quantity'] + $quantity;
            if ($product['stock'] < $new_qty) return $this->error('Not enough stock.');
            $this->db->where('id', $existing['id'])->update('cart', ['quantity' => $new_qty]);
        } else {
            $this->db->insert('cart', array_filter($key) + [
                'product_id' => $product_id,
                'quantity'   => $quantity,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

        $items = $this->_get_cart_items($key);
        $this->success(['items' => $items, 'summary' => $this->_summary($items)], 'Added to cart.');
    }

    public function update() {
        $data       = $this->body();
        $product_id = (int)($data['product_id'] ?? 0);
        $quantity   = (int)($data['quantity'] ?? 0);
        $key        = $this->_cart_key();

        if ($quantity <= 0) {
            $this->db->where(array_filter($key) + ['product_id' => $product_id])->delete('cart');
        } else {
            $product = $this->Sk_Product_model->get_by_id($product_id);
            if ($product['stock'] < $quantity) return $this->error('Not enough stock.');
            $this->db->where(array_filter($key) + ['product_id' => $product_id])
                     ->update('cart', ['quantity' => $quantity]);
        }

        $items = $this->_get_cart_items($key);
        $this->success(['items' => $items, 'summary' => $this->_summary($items)]);
    }

    public function remove() {
        $data       = $this->body();
        $product_id = (int)($data['product_id'] ?? 0);
        $key        = $this->_cart_key();
        $this->db->where(array_filter($key) + ['product_id' => $product_id])->delete('cart');
        $items = $this->_get_cart_items($key);
        $this->success(['items' => $items, 'summary' => $this->_summary($items)], 'Removed from cart.');
    }

    public function clear() {
        $key = $this->_cart_key();
        $this->db->where(array_filter($key))->delete('cart');
        $this->success([], 'Cart cleared.');
    }

    private function _get_cart_items($key) {
        $where = array_filter($key);
        $rows  = $this->db->where($where)->get('cart')->result_array();
        $items = [];
        foreach ($rows as $row) {
            $p = $this->Sk_Product_model->get_by_id($row['product_id']);
            if (!$p) continue;
            $items[] = [
                'cart_id'         => $row['id'],
                'product_id'      => $p['id'],
                'name'            => $p['name'],
                'thumbnail'       => $p['thumbnail'],
                'slug'            => $p['slug'],
                'price'           => $p['price'],
                'sale_price'      => $p['sale_price'],
                'effective_price' => $p['sale_price'] ?? $p['price'],
                'stock'           => $p['stock'],
                'quantity'        => (int)$row['quantity'],
                'subtotal'        => round(($p['sale_price'] ?? $p['price']) * $row['quantity'], 2),
            ];
        }
        return $items;
    }

    private function _summary($items) {
        $subtotal = array_sum(array_column($items, 'subtotal'));
        $settings = $this->get_settings();
        $shipping = $subtotal >= ($settings['free_shipping_above'] ?? 999) ? 0 : ($settings['shipping_charge'] ?? 50);
        $tax      = round($subtotal * ($settings['tax_rate'] ?? 18) / 100, 2);
        return [
            'subtotal'     => round($subtotal, 2),
            'shipping'     => (float)$shipping,
            'tax'          => $tax,
            'discount'     => 0,
            'total'        => round($subtotal + $shipping + $tax, 2),
            'item_count'   => array_sum(array_column($items, 'quantity')),
        ];
    }
}
