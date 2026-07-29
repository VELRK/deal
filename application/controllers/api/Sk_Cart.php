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

    private function _resolve_variant($product, $variant_id = null) {
        $this->load->model('Sk_Product_variant_model');
        if ($variant_id) {
            $variant = $this->Sk_Product_variant_model->get_by_id((int)$variant_id);
            if (!$variant || (int)$variant['product_id'] !== (int)$product['id']) return null;
            return $variant;
        }
        if (!empty($product['variants'])) {
            foreach ($product['variants'] as $v) {
                if (!empty($v['is_default'])) return $v;
            }
            return $product['variants'][0];
        }
        return null;
    }

    private function _apply_cart_filters($key, $product_id, $variant_id = null) {
        $this->db->where(array_filter($key));
        $this->db->where('product_id', (int)$product_id);
        if ($this->db->field_exists('variant_id', 'cart')) {
            if ($variant_id) {
                $this->db->where('variant_id', (int)$variant_id);
            } else {
                $this->db->where('variant_id IS NULL', null, false);
            }
        }
    }

    private function _find_cart_row($key, $product_id, $variant_id = null) {
        $this->_apply_cart_filters($key, $product_id, $variant_id);
        return $this->db->get('cart')->row_array();
    }

    private function _stock_label(array $product, $variant = null): string {
        $name = (string)($product['name'] ?? 'Product');
        $label = is_array($variant) ? trim((string)($variant['label'] ?? '')) : '';
        return $label !== '' ? "{$name} ({$label})" : $name;
    }

    private function _stock_error(array $product, $variant, int $need, int $available) {
        $title = $this->_stock_label($product, $variant);
        $msg = "Not enough stock for '{$title}'. Available: {$available}, requested: {$need}.";
        return $this->error($msg, 400, [
            'stock_issues' => [[
                'product_id' => (int)($product['id'] ?? 0),
                'variant_id' => is_array($variant) ? (int)($variant['id'] ?? 0) ?: null : null,
                'name'       => $title,
                'available'  => $available,
                'requested'  => $need,
            ]],
        ]);
    }

    public function index() {
        $key   = $this->_cart_key();
        $items = $this->_get_cart_items($key);
        $this->success(['items' => $items, 'summary' => $this->_summary($items)]);
    }

    public function add() {
        $data        = $this->body();
        $product_id  = (int)($data['product_id'] ?? 0);
        $variant_id  = !empty($data['variant_id']) ? (int)$data['variant_id'] : null;
        $quantity    = max(1, (int)($data['quantity'] ?? 1));

        $product = $this->Sk_Product_model->get_by_id($product_id);
        if (!$product || $product['status'] !== 'active') return $this->error('Product not found.');

        $variant = $this->_resolve_variant($product, $variant_id);
        $stock = $variant ? (int)$variant['stock'] : (int)$product['stock'];
        if ($stock < $quantity) {
            return $this->_stock_error($product, $variant, $quantity, $stock);
        }

        $key = $this->_cart_key();
        $existing = $this->_find_cart_row($key, $product_id, $variant ? (int)$variant['id'] : null);

        if ($existing) {
            $new_qty = $existing['quantity'] + $quantity;
            if ($stock < $new_qty) {
                return $this->_stock_error($product, $variant, $new_qty, $stock);
            }
            $this->db->where('id', $existing['id'])->update('cart', ['quantity' => $new_qty]);
        } else {
            $insert = array_filter($key) + [
                'product_id' => $product_id,
                'quantity'   => $quantity,
                'created_at' => date('Y-m-d H:i:s'),
            ];
            if ($this->db->field_exists('variant_id', 'cart') && $variant) {
                $insert['variant_id'] = (int)$variant['id'];
            }
            $this->db->insert('cart', $insert);
        }

        $items = $this->_get_cart_items($key);
        $this->success(['items' => $items, 'summary' => $this->_summary($items)], 'Added to cart.');
    }

    public function update() {
        $data        = $this->body();
        $product_id  = (int)($data['product_id'] ?? 0);
        $variant_id  = !empty($data['variant_id']) ? (int)$data['variant_id'] : null;
        $quantity    = (int)($data['quantity'] ?? 0);
        $key         = $this->_cart_key();

        if ($quantity <= 0) {
            $this->_apply_cart_filters($key, $product_id, $variant_id);
            $this->db->delete('cart');
        } else {
            $product = $this->Sk_Product_model->get_by_id($product_id);
            if (!$product) return $this->error('Product not found.');
            $variant = $this->_resolve_variant($product, $variant_id);
            $stock = $variant ? (int)$variant['stock'] : (int)$product['stock'];
            if ($stock < $quantity) {
                return $this->_stock_error($product, $variant, $quantity, $stock);
            }
            $this->_apply_cart_filters($key, $product_id, $variant_id);
            $this->db->update('cart', ['quantity' => $quantity]);
        }

        $items = $this->_get_cart_items($key);
        $this->success(['items' => $items, 'summary' => $this->_summary($items)]);
    }

    public function remove() {
        $data        = $this->body();
        $product_id  = (int)($data['product_id'] ?? 0);
        $variant_id  = !empty($data['variant_id']) ? (int)$data['variant_id'] : null;
        $key         = $this->_cart_key();
        $this->_apply_cart_filters($key, $product_id, $variant_id);
        $this->db->delete('cart');
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

            $variant = null;
            if (!empty($row['variant_id'])) {
                $variant = $this->_resolve_variant($p, (int)$row['variant_id']);
            } elseif (!empty($p['variants'])) {
                $variant = $this->_resolve_variant($p, null);
            }

            $price = $variant ? (float)$variant['price'] : (float)$p['price'];
            $sale  = $variant ? ($variant['sale_price'] ?? null) : ($p['sale_price'] ?? null);
            $effective = ($sale && $sale > 0 && $sale < $price) ? (float)$sale : $price;
            $label = $variant['label'] ?? ($p['unit_label'] ?? null);

            $items[] = [
                'cart_id'         => $row['id'],
                'product_id'      => $p['id'],
                'variant_id'      => $variant['id'] ?? null,
                'variant_label'   => $label,
                'name'            => $p['name'] . ($label ? ' (' . $label . ')' : ''),
                'thumbnail'       => $p['thumbnail'],
                'slug'            => $p['slug'],
                'price'           => $price,
                'sale_price'      => $sale,
                'effective_price' => $effective,
                'stock'           => $variant ? (int)$variant['stock'] : (int)$p['stock'],
                'quantity'        => (int)$row['quantity'],
                'subtotal'        => round($effective * $row['quantity'], 2),
                'created_at'      => $row['created_at'] ?? null,
                'added_at'        => $row['created_at'] ?? null,
            ];
        }
        return $items;
    }

    private function _summary($items) {
        $subtotal = array_sum(array_column($items, 'subtotal'));
        $settings = $this->get_settings();
        $shipping = $subtotal >= ($settings['free_shipping_above'] ?? 999) ? 0 : ($settings['shipping_charge'] ?? 50);
        // Storefront does not charge/show GST
        $tax      = 0;
        $summary = [
            'subtotal'     => round($subtotal, 2),
            'shipping'     => (float)$shipping,
            'tax'          => $tax,
            'discount'     => 0,
            'total'        => round($subtotal + $shipping + $tax, 2),
            'item_count'   => array_sum(array_column($items, 'quantity')),
        ];

        // Royalty points (separate ledger from wallet) — show when logged in
        $this->load->helper('sk_royalty');
        sk_royalty_ensure_schema();
        $userId = (int)($this->user['user_id'] ?? 0);
        if ($userId < 1) {
            $jwt = $this->sk_jwt->get_user_from_request();
            $userId = (int)($jwt['user_id'] ?? 0);
        }
        if ($userId > 0) {
            $this->load->model('Sk_Royalty_model');
            $summary['royalty'] = $this->Sk_Royalty_model->get_info($userId);
        } else {
            $summary['royalty'] = [
                'enabled'      => sk_royalty_enabled($settings),
                'show_on_cart' => false,
                'points'       => 0,
                'balance_rm'   => 0,
                'hint'         => 'Login to see and redeem royalty points.',
            ];
        }

        return $summary;
    }
}
