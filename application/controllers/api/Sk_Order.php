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

        $settings = $this->get_settings();
        $this->load->helper('sk_isms');
        $shippingPhone = sk_isms_normalize_phone($addr['phone'] ?? '', $settings);
        if ($shippingPhone === '') {
            return $this->error(sk_isms_phone_error());
        }
        $addr['phone'] = $shippingPhone;

        // Build cart
        $user_id = $this->user['user_id'];
        $items   = $this->db->where('user_id', $user_id)->get('cart')->result_array();
        if (empty($items)) return $this->error('Cart is empty.');

        $subtotal = 0;
        $order_items = [];

        foreach ($items as $item) {
            $p = $this->Sk_Product_model->get_by_id($item['product_id']);
            if (!$p || $p['status'] !== 'active') {
                $name = $p['name'] ?? 'Product';
                return $this->error("Product '{$name}' is no longer available.");
            }

            $variant = null;
            $variant_id = !empty($item['variant_id']) ? (int)$item['variant_id'] : null;
            if ($variant_id) {
                $this->load->model('Sk_Product_variant_model');
                $variant = $this->Sk_Product_variant_model->get_by_id($variant_id);
                if (!$variant || (int)$variant['product_id'] !== (int)$p['id']) {
                    return $this->error("Invalid variant for '{$p['name']}'.");
                }
            } elseif (!empty($p['variants'])) {
                foreach ($p['variants'] as $v) {
                    if (!empty($v['is_default'])) { $variant = $v; break; }
                }
                if (!$variant) $variant = $p['variants'][0];
            }

            $stock = $variant ? (int)$variant['stock'] : (int)$p['stock'];
            if ($stock < $item['quantity']) {
                return $this->error("Insufficient stock for '{$p['name']}'.");
            }

            $price = $variant
                ? ($variant['effective_price'] ?? $variant['sale_price'] ?? $variant['price'])
                : ($p['effective_price'] ?? $p['sale_price'] ?? $p['price']);
            $sub      = round($price * $item['quantity'], 2);
            $subtotal += $sub;

            $variant_label = $variant['label'] ?? ($p['unit_label'] ?? null);
            $line = [
                'product_id'   => $p['id'],
                'product_name' => $p['name'] . ($variant_label ? ' (' . $variant_label . ')' : ''),
                'product_sku'  => $variant['sku'] ?? $p['sku'],
                'thumbnail'    => $p['thumbnail'],
                'price'        => $price,
                'quantity'     => $item['quantity'],
                'subtotal'     => $sub,
            ];
            if ($this->db->field_exists('variant_id', 'order_items')) {
                $line['variant_id'] = $variant['id'] ?? null;
            }
            if ($this->db->field_exists('variant_label', 'order_items')) {
                $line['variant_label'] = $variant_label;
            }
            if ($this->db->field_exists('vendor_id', 'order_items') && !empty($p['vendor_id'])) {
                $line['vendor_id'] = (int)$p['vendor_id'];
            }
            $order_items[] = $line;
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
        $use_wallet     = !empty($data['use_wallet']);
        $wallet_discount = 0;
        $wallet_amount   = 0.0;

        $this->load->model('Sk_Customer_wallet_model');
        $wallet_enabled = $this->Sk_Customer_wallet_model->is_enabled();
        $uses_wallet    = ($payment_method === 'wallet')
            || ($payment_method === 'razorpay' && $use_wallet && $wallet_enabled);

        if ($payment_method === 'wallet' && !$wallet_enabled) {
            return $this->error('Wallet payments are not enabled.');
        }

        $code_discount = $discount;

        if ($uses_wallet && $wallet_enabled) {
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

        if ($uses_wallet && $wallet_enabled && $total > 0) {
            $walletInfo = $this->Sk_Customer_wallet_model->get_checkout_info($user_id);
            $wallet_amount = round(min((float)($walletInfo['balance'] ?? 0), $total), 2);
        }

        if ($payment_method === 'wallet') {
            if ($wallet_amount < $total) {
                return $this->error('Insufficient wallet balance for this order.');
            }
        } elseif ($payment_method === 'razorpay' && $use_wallet && $wallet_enabled && $wallet_amount >= $total && $total > 0) {
            $payment_method = 'wallet';
        }

        $gateway_amount = round(max(0, $total - $wallet_amount), 2);
        $is_paid_now    = ($payment_method === 'wallet');

        $this->_ensure_order_wallet_schema();
        $this->_ensure_order_discount_schema();
        $this->load->helper(['sk_jt_express', 'sk_vendor_dashboard']);
        sk_jt_express_ensure_schema();
        sk_vendor_dashboard_ensure_schema();
        $now = date('Y-m-d H:i:s');
        $order_data = [
            'user_id'          => $user_id,
            'subtotal'         => $subtotal,
            'shipping'         => $shipping,
            'tax'              => $tax,
            'discount'         => $discount,
            'affiliate_discount' => $affiliate_id ? $code_discount : 0,
            'wallet_discount'  => $wallet_discount,
            'promo_code'       => $promo_code,
            'affiliate_id'     => $affiliate_id,
            'affiliate_promo'  => $affiliate_promo,
            'total'            => $total,
            'wallet_amount'    => $wallet_amount,
            'payment_method'   => $payment_method,
            'payment_status'   => $is_paid_now ? 'paid' : 'pending',
            'status'           => $is_paid_now ? 'confirmed' : 'pending',
            'status_updated_at'=> $now,
            'confirmed_at'     => $is_paid_now ? $now : null,
            'notes'            => $wallet_discount > 0
                ? trim(($data['note'] ?? $data['notes'] ?? '') . ' [Wallet discount: ' . $wallet_discount . ']')
                : ($data['note'] ?? $data['notes'] ?? null),
            'shipping_name'    => $addr['full_name'],
            'shipping_phone'   => $shippingPhone,
            'shipping_line1'   => $addr['line1'],
            'shipping_line2'   => $addr['line2'] ?? '',
            'shipping_city'    => $addr['city'],
            'shipping_state'   => $addr['state'],
            'shipping_pincode' => $addr['pincode'],
            'shipping_country' => $addr['country'] ?? ($settings['default_country'] ?? 'Malaysia'),
        ];

        // Billing address (optional) — checkbox "same as shipping" sends billing_same=true
        $billingSame = !empty($data['billing_same']) || empty($data['billing_address']);
        $bill = $billingSame ? $addr : ($data['billing_address'] ?? $addr);
        $billingPhone = $billingSame
            ? $shippingPhone
            : sk_isms_normalize_phone($bill['phone'] ?? '', $settings);
        if (!$billingSame && $billingPhone === '') {
            return $this->error('A valid mobile number is required for billing.');
        }
        $this->_ensure_order_billing_schema();
        $order_data['billing_name']     = $bill['full_name'] ?? $addr['full_name'];
        $order_data['billing_company']  = trim($bill['company_name'] ?? '') ?: null;
        $order_data['billing_phone']    = $billingPhone ?: $shippingPhone;
        $order_data['billing_line1']    = $bill['line1'] ?? $addr['line1'];
        $order_data['billing_line2']    = $bill['line2'] ?? ($addr['line2'] ?? '');
        $order_data['billing_city']     = $bill['city'] ?? $addr['city'];
        $order_data['billing_state']    = $bill['state'] ?? $addr['state'];
        $order_data['billing_pincode']  = $bill['pincode'] ?? $addr['pincode'];
        $order_data['billing_country']  = $bill['country'] ?? ($addr['country'] ?? 'Malaysia');

        $order_id = $this->Sk_Order_model->create($order_data, $order_items);

        if ($wallet_amount > 0) {
            if (!$this->Sk_Customer_wallet_model->apply_wallet_payment(
                $user_id,
                $wallet_amount,
                $order_id,
                $gateway_amount > 0
                    ? ('Partial wallet payment for order #' . $order_id)
                    : ('Order #' . $order_id)
            )) {
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
            $this->Sk_Affiliate_model->record_order_commission($affiliate_id, $order_id, $subtotal, $user_id);
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
        $this->load->helper('sk_jt_express');
        sk_jt_express_ensure_schema();
        $page   = max(1, (int)($this->input->get('page') ?? 1));
        $limit  = 10;
        $offset = ($page - 1) * $limit;
        $orders = $this->Sk_Order_model->get_user_orders($this->user['user_id'], $limit, $offset);
        // Attach items to each order for frontend display
        foreach ($orders as &$o) {
            $o['items'] = $this->Sk_Order_model->get_items($o['id']);
            sk_order_attach_tracking($o);
        }
        unset($o);
        $this->success($orders);
    }

    public function show($id) {
        $this->auth_required();
        $this->load->helper('sk_jt_express');
        sk_jt_express_ensure_schema();
        $order = $this->Sk_Order_model->get_by_id($id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);
        sk_order_attach_tracking($order);
        $this->success($order);
    }

    public function cancel($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id((int)$id, $this->user['user_id']);
        if (!$order) {
            return $this->error('Order not found.', 404);
        }

        $this->_jt_cancel_if_needed($order);
        $this->_ensure_order_wallet_schema();

        $result = $this->Sk_Order_model->cancel_order(
            (int)$id,
            (int)$this->user['user_id'],
            $this->get_settings(),
            false
        );
        if (!$result['ok']) {
            return $this->error($result['message'], 400);
        }

        $this->success([], $result['message']);
    }

    private function _jt_cancel_if_needed(array $order) {
        $txId = $order['jt_txlogistic_id'] ?? $order['order_number'] ?? '';
        $billCode = trim((string)($order['jt_bill_code'] ?? $order['tracking_number'] ?? ''));
        if ($txId === '' && $billCode === '') {
            return;
        }
        if (($order['jt_courier_status'] ?? '') === 'cancelled') {
            return;
        }
        $settings = $this->get_settings();
        if (empty($settings['jt_express_enabled']) || $settings['jt_express_enabled'] === '0') {
            return;
        }
        $this->load->library('Jt_express', $settings);
        if (!$this->jt_express->is_enabled()) {
            return;
        }
        $result = $this->jt_express->cancel_order($txId, 'Cancelled by customer', $billCode);
        if (!empty($result['success'])) {
            $this->Sk_Order_model->update_jt_shipment((int)$order['id'], [
                'jt_courier_status' => 'cancelled',
                'jt_bill_code'      => null,
            ]);
        }
    }

    private function _ensure_order_wallet_schema(): void {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;
        if (!$this->db->field_exists('wallet_amount', 'orders')) {
            $this->db->query('ALTER TABLE `orders` ADD COLUMN `wallet_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER `total`');
        }
    }

    private function _ensure_order_discount_schema(): void {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;
        if (!$this->db->field_exists('affiliate_discount', 'orders')) {
            $this->db->query('ALTER TABLE `orders` ADD COLUMN `affiliate_discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER `discount`');
        }
        if (!$this->db->field_exists('wallet_discount', 'orders')) {
            $this->db->query('ALTER TABLE `orders` ADD COLUMN `wallet_discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER `affiliate_discount`');
        }
    }

    private function _ensure_order_billing_schema(): void {
        static $done = false;
        if ($done) return;
        $done = true;
        $cols = [
            'billing_name' => "VARCHAR(150) NULL",
            'billing_company' => "VARCHAR(150) NULL",
            'billing_phone' => "VARCHAR(30) NULL",
            'billing_line1' => "VARCHAR(255) NULL",
            'billing_line2' => "VARCHAR(255) NULL",
            'billing_city' => "VARCHAR(100) NULL",
            'billing_state' => "VARCHAR(100) NULL",
            'billing_pincode' => "VARCHAR(20) NULL",
            'billing_country' => "VARCHAR(80) NULL DEFAULT 'Malaysia'",
        ];
        foreach ($cols as $col => $def) {
            if (!$this->db->field_exists($col, 'orders')) {
                $this->db->query("ALTER TABLE `orders` ADD COLUMN `{$col}` {$def}");
            }
        }
    }
}
