<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Order extends Sk_Base_Api {

    public function checkout() {
        $this->auth_required();
        $data = $this->body();

        // Validate address
        $addr = $data['address'] ?? null;
        if (!$addr || empty($addr['full_name']) || empty($addr['line1'])) {
            return $this->error('Shipping address is required.');
        }

        // Build cart
        $user_id = $this->user['user_id'];
        $items   = $this->db->where('user_id', $user_id)->get('cart')->result_array();
        if (empty($items)) return $this->error('Cart is empty.');

        $settings = $this->get_settings();
        $subtotal = 0;
        $order_items = [];

        foreach ($items as $item) {
            $p = $this->Sk_Product_model->get_by_id($item['product_id']);
            if (!$p || $p['status'] !== 'active') return $this->error("Product '{$p['name']}' is no longer available.");
            if ($p['stock'] < $item['quantity']) return $this->error("Insufficient stock for '{$p['name']}'.");
            $price    = $p['effective_price'] ?? $p['sale_price'] ?? $p['price'];
            $sub      = round($price * $item['quantity'], 2);
            $subtotal += $sub;
            $order_items[] = [
                'product_id'   => $p['id'],
                'product_name' => $p['name'],
                'product_sku'  => $p['sku'],
                'thumbnail'    => $p['thumbnail'],
                'price'        => $price,
                'quantity'     => $item['quantity'],
                'subtotal'     => $sub,
            ];
        }

        // Promo — regular coupon or affiliate market code
        $discount = 0;
        $promo_code = null;
        $affiliate_id = null;
        $affiliate_promo = null;
        $check = null;
        $affCheck = null;

        if (!empty($data['promo_code'])) {
            $code = $data['promo_code'];
            $check = $this->Sk_Promo_model->validate($code, $user_id, $subtotal);
            if ($check['valid']) {
                $discount   = $check['discount'];
                $promo_code = strtoupper(trim($code));
            } else {
                $this->load->model('Sk_Affiliate_model');
                $affCheck = $this->Sk_Affiliate_model->validate_checkout_code($code, $subtotal);
                if ($affCheck['valid']) {
                    $discount        = $affCheck['discount'];
                    $promo_code      = $affCheck['code'];
                    $affiliate_id    = (int)$affCheck['affiliate']['id'];
                    $affiliate_promo = $affCheck['code'];
                }
            }
        }

        $payment_method = $data['payment_method'] ?? 'razorpay';
        $wallet_discount = 0;

        if ($payment_method === 'wallet') {
            $this->load->model('Sk_Customer_wallet_model');
            if (!$this->Sk_Customer_wallet_model->is_enabled()) {
                return $this->error('Wallet payments are not enabled.');
            }
            $walletPct = $this->Sk_Customer_wallet_model->get_wallet_discount_percent();
            if ($walletPct > 0) {
                $wallet_discount = round(max(0, $subtotal - $discount) * $walletPct / 100, 2);
                $discount += $wallet_discount;
            }
        }

        $shipping = $subtotal >= ($settings['free_shipping_above'] ?? 999) ? 0 : ($settings['shipping_charge'] ?? 50);
        $taxable_amount = max(0, $subtotal - $discount);
        $tax      = round($taxable_amount * ($settings['tax_rate'] ?? 18) / 100, 2);
        $total    = round($taxable_amount + $shipping + $tax, 2);

        $order_data = [
            'user_id'          => $user_id,
            'subtotal'         => $subtotal,
            'shipping'         => $shipping,
            'tax'              => $tax,
            'discount'         => $discount,
            'promo_code'       => $promo_code,
            'affiliate_id'     => $affiliate_id,
            'affiliate_promo'  => $affiliate_promo,
            'total'            => $total,
            'payment_method'   => $payment_method,
            'payment_status'   => $payment_method === 'wallet' ? 'paid' : 'pending',
            'status'           => $payment_method === 'wallet' ? 'confirmed' : 'pending',
            'notes'            => $wallet_discount > 0
                ? trim(($data['note'] ?? $data['notes'] ?? '') . ' [Wallet discount: ' . $wallet_discount . ']')
                : ($data['note'] ?? $data['notes'] ?? null),
            'shipping_name'    => $addr['full_name'],
            'shipping_phone'   => $addr['phone'] ?? '',
            'shipping_line1'   => $addr['line1'],
            'shipping_line2'   => $addr['line2'] ?? '',
            'shipping_city'    => $addr['city'],
            'shipping_state'   => $addr['state'],
            'shipping_pincode' => $addr['pincode'],
            'shipping_country' => $addr['country'] ?? 'India',
        ];

        $order_id = $this->Sk_Order_model->create($order_data, $order_items);

        if ($payment_method === 'wallet') {
            if (!$this->Sk_Customer_wallet_model->apply_wallet_payment($user_id, $total, $order_id, 'Order #' . $order_id)) {
                $this->db->where('id', $order_id)->delete('orders');
                $this->db->where('order_id', $order_id)->delete('order_items');
                return $this->error('Insufficient wallet balance for this order.');
            }
        }

        // Record promo usage
        if ($promo_code && !empty($check['valid']) && !empty($check['promo'])) {
            $this->Sk_Promo_model->record_usage($check['promo']['id'], $user_id, $order_id);
        }

        // Affiliate commission when market code used
        if ($affiliate_id) {
            $this->load->model('Sk_Affiliate_model');
            $this->Sk_Affiliate_model->record_order_commission($affiliate_id, $order_id, $taxable_amount, $user_id);
        }

        // Clear cart
        $this->db->where('user_id', $user_id)->delete('cart');

        $order = $this->Sk_Order_model->get_by_id($order_id, $user_id);

        // Email tax invoice (COD/wallet immediately; Razorpay after payment verify)
        $this->load->helper(['sk_mailer', 'sk_invoice']);
        sk_invoice_ensure_vendor_schema();
        $settings = $this->get_settings();
        if (in_array($payment_method, ['cod', 'wallet'], true)) {
            sk_mail_order_invoice($order, $settings);
        }

        $this->success(['order' => $order], 'Order placed successfully.', 201);
    }

    public function index() {
        $this->auth_required();
        $page   = max(1, (int)($this->input->get('page') ?? 1));
        $limit  = 10;
        $offset = ($page - 1) * $limit;
        $orders = $this->Sk_Order_model->get_user_orders($this->user['user_id'], $limit, $offset);
        // Attach items to each order for frontend display
        foreach ($orders as &$o) {
            $o['items'] = $this->Sk_Order_model->get_items($o['id']);
        }
        unset($o);
        $this->success($orders);
    }

    public function show($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id($id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);
        $this->success($order);
    }

    public function cancel($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id((int)$id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);
        if ($order['status'] !== 'pending') {
            return $this->error('Only pending orders can be cancelled.');
        }
        $this->Sk_Order_model->update_status((int)$id, 'cancelled');
        $this->Sk_Order_model->update_payment_status((int)$id, 'failed');
        $this->success([], 'Order cancelled.');
    }
}
