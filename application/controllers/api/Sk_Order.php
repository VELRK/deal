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
        $fullNameCheck = trim((string) ($addr['full_name'] ?? ''));
        if ($fullNameCheck === '' || preg_match('/^(User|SER|USR|CUST)\s*\d{1,8}$/i', $fullNameCheck)) {
            return $this->error('Please enter your real full name (not a generated code like SER001).');
        }
        $addr['full_name'] = $fullNameCheck;
        $addr['company_name'] = trim((string) ($addr['company_name'] ?? '')) ?: '';

        // Optional email (top-level or nested) — unique when provided
        $emailRaw = $data['email'] ?? ($data['customer_email'] ?? ($addr['email'] ?? null));
        if ($emailRaw !== null && trim((string) $emailRaw) !== '') {
            $emailCheck = strtolower(trim((string) $emailRaw));
            if (!filter_var($emailCheck, FILTER_VALIDATE_EMAIL)) {
                return $this->error('Invalid email address.');
            }
            $this->Sk_User_model->ensure_otp_user_schema();
            if ($this->Sk_User_model->email_exists($emailCheck, (int) $this->user['user_id'])) {
                return $this->error('This email is already in use.');
            }
            $data['email'] = $emailCheck;
            $addr['email'] = $emailCheck;
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
        $stock_issues = [];

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
            $need  = (int)$item['quantity'];
            if ($stock < $need) {
                $label = trim((string)($variant['label'] ?? ''));
                $title = $label !== '' ? ($p['name'] . ' (' . $label . ')') : $p['name'];
                $stock_issues[] = [
                    'product_id' => (int)$p['id'],
                    'variant_id' => $variant ? ((int)($variant['id'] ?? 0) ?: null) : null,
                    'name'       => $title,
                    'available'  => max(0, $stock),
                    'requested'  => $need,
                ];
                continue;
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

        if (!empty($stock_issues)) {
            $parts = [];
            foreach ($stock_issues as $s) {
                if ((int)$s['available'] <= 0) {
                    $parts[] = "'{$s['name']}' is out of stock";
                } else {
                    $parts[] = "'{$s['name']}' (available {$s['available']}, requested {$s['requested']})";
                }
            }
            $msg = count($stock_issues) === 1
                ? ('Cannot place order: ' . $parts[0] . '.')
                : ('Cannot place order — stock issues: ' . implode('; ', $parts) . '.');
            return $this->error($msg, 400, ['stock_issues' => $stock_issues]);
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

        $payment_method = strtolower(trim((string)($data['payment_method'] ?? 'razorpay')));
        // Wallet is a separate full-pay method only — no partial wallet + gateway.
        if ($payment_method === 'wallet') {
            $use_wallet = true;
        } else {
            $use_wallet = false;
        }
        $use_royalty    = !empty($data['use_royalty']) || !empty($data['apply_royalty']);
        $royalty_points_req = (int)($data['royalty_points'] ?? 0);
        $wallet_discount = 0;
        $wallet_amount   = 0.0;
        $royalty_used_points = 0;
        $royalty_used_rm     = 0.0;

        $this->load->model(['Sk_Customer_wallet_model', 'Sk_Royalty_model']);
        $this->load->helper('sk_royalty');
        sk_royalty_ensure_schema();
        $wallet_enabled = $this->Sk_Customer_wallet_model->is_enabled();
        $settingsAll = $settings;
        $royalty_enabled = sk_royalty_enabled($settingsAll);
        $minRoyaltyPts = sk_royalty_min_redeem_points($settingsAll);
        $minRoyaltyRm = sk_royalty_min_redeem_rm($settingsAll);

        $uses_wallet = ($payment_method === 'wallet' && $wallet_enabled);

        if ($payment_method === 'wallet' && !$wallet_enabled) {
            return $this->error('Wallet payments are not enabled.');
        }

        $code_discount = $discount;

        if ($uses_wallet) {
            $walletPct = $this->Sk_Customer_wallet_model->get_wallet_discount_percent();
            // get_wallet_discount_percent() already returns 0 when disabled / invalid
            if ($walletPct > 0) {
                $wallet_discount = round(max(0, $subtotal - $discount) * $walletPct / 100, 2);
                if ($wallet_discount > 0) {
                    $discount += $wallet_discount;
                } else {
                    $wallet_discount = 0;
                }
            }
        }

        // Normal shipping from admin settings; wallet pay always gets free delivery.
        $shipping = ($subtotal <= 0)
            ? 0
            : ($subtotal >= ($settings['free_shipping_above'] ?? 999) ? 0 : ($settings['shipping_charge'] ?? 50));
        if ($uses_wallet) {
            $shipping = 0;
        }
        $taxable_amount = max(0, $subtotal - $discount);
        // Storefront does not charge/show GST
        $tax      = 0;
        $total    = round($taxable_amount + $shipping + $tax, 2);

        // Royalty can stack with coupon/affiliate and wallet; remainder is paid by wallet / COD / online.
        if ($use_royalty && $royalty_enabled) {
            $availPts = $this->Sk_Royalty_model->get_points($user_id);
            $availRm = $this->Sk_Royalty_model->points_to_rm($availPts);
            $testUnlock = sk_royalty_test_unlock($settingsAll);
            $needPts = $testUnlock ? 1 : $minRoyaltyPts;
            $needRm = $testUnlock ? 0.01 : $minRoyaltyRm;
            if ($availPts < $needPts || $availRm < $needRm) {
                return $this->error(
                    $testUnlock
                        ? ('No royalty points to apply. You have ' . $availPts . ' pts.')
                        : ('Need at least RM ' . number_format($minRoyaltyRm, 0)
                            . ' (' . $minRoyaltyPts . ' pts) royalty to pay with points. You have '
                            . $availPts . ' pts (RM ' . number_format($availRm, 2) . ').')
                );
            }
            if ($total <= 0) {
                return $this->error('Cart is empty.');
            }
            $ptsToUse = $royalty_points_req > 0 ? min($royalty_points_req, $availPts) : $availPts;
            $wantRm = $this->Sk_Royalty_model->points_to_rm($ptsToUse);
            $royalty_used_rm = round(min($wantRm, $total), 2);
            $royalty_used_points = $this->Sk_Royalty_model->rm_to_points($royalty_used_rm);
            if ($royalty_used_rm <= 0 || $royalty_used_points < 1) {
                return $this->error('Could not apply royalty points to this order.');
            }
        }

        $dueAfterRoyalty = round(max(0, $total - $royalty_used_rm), 2);

        if ($uses_wallet && $dueAfterRoyalty > 0) {
            $walletInfo = $this->Sk_Customer_wallet_model->get_checkout_info($user_id);
            $balance = round((float)($walletInfo['balance'] ?? 0), 2);
            // Wallet method: balance must cover the remainder after royalty (and any promo).
            if ($balance + 0.009 < $dueAfterRoyalty) {
                return $this->error(
                    'Insufficient wallet balance. Need RM ' . number_format($dueAfterRoyalty, 2)
                    . ' (you have RM ' . number_format($balance, 2) . ').'
                    . ($royalty_used_rm > 0 ? ' After royalty, wallet must cover the remaining amount.' : ' Wallet pays the full order only — no payment gateway.')
                );
            }
            $wallet_amount = $dueAfterRoyalty;
        }

        if ($payment_method === 'wallet') {
            if (round($wallet_amount + $royalty_used_rm, 2) + 0.009 < $total) {
                return $this->error('Insufficient wallet balance for this order.');
            }
            // Force method + paid state — never open Razorpay for wallet.
            $payment_method = 'wallet';
        }

        $gateway_amount = round(max(0, $total - $royalty_used_rm - $wallet_amount), 2);
        // Fully covered by royalty and/or wallet → paid now (no COD/online remainder)
        $is_paid_now    = ($gateway_amount <= 0.009);
        // COD + fully paid (wallet/royalty) → Confirmed immediately.
        // Unpaid Razorpay → payment_attempt until verify succeeds (no cancel on modal close).
        $is_cod         = strtolower((string)$payment_method) === 'cod';
        $confirm_now    = $is_paid_now || $is_cod;
        $is_razorpay_due = !$confirm_now && strtolower((string)$payment_method) === 'razorpay';

        // Safety: wallet method must never leave a gateway remainder.
        if ($payment_method === 'wallet' && !$is_paid_now) {
            return $this->error('Insufficient wallet balance for this order.');
        }
        $this->_ensure_order_wallet_schema();
        $this->_ensure_order_discount_schema();
        $this->_ensure_order_source_schema();
        $this->Sk_Order_model->ensure_payment_attempt_status();
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
            'royalty_used_points' => $royalty_used_points,
            'royalty_used_rm'     => $royalty_used_rm,
            'order_source'     => $this->_resolve_order_source($data),
            'payment_method'   => $payment_method,
            'payment_status'   => $is_paid_now ? 'paid' : 'pending',
            'status'           => $confirm_now ? 'confirmed' : ($is_razorpay_due ? 'payment_attempt' : 'pending'),
            'status_updated_at'=> $now,
            'confirmed_at'     => $confirm_now ? $now : null,
            'notes'            => trim(
                ($data['note'] ?? $data['notes'] ?? '')
                . ($wallet_discount > 0 ? ' [Wallet discount: ' . $wallet_discount . ']' : '')
                . ($royalty_used_points > 0 ? ' [Royalty redeemed: ' . $royalty_used_points . ' pts / RM ' . number_format($royalty_used_rm, 2) . ']' : '')
            ) ?: null,
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

        // Keep My Addresses in sync for first-time checkout (OTP / new accounts)
        $this->Sk_User_model->ensure_default_shipping_address($user_id, [
            'full_name'    => $addr['full_name'],
            'phone'        => $shippingPhone,
            'line1'        => $addr['line1'],
            'line2'        => $addr['line2'] ?? '',
            'city'         => $addr['city'],
            'state'        => $addr['state'],
            'pincode'      => $addr['pincode'],
            'country'      => $addr['country'] ?? ($settings['default_country'] ?? 'Malaysia'),
            'company_name' => $addr['company_name'] ?? '',
        ]);

        // Persist real name (+ optional unique email) from checkout onto the user account
        $this->_sync_user_from_checkout($user_id, $addr, $data);

        $order_id = $this->Sk_Order_model->create($order_data, $order_items);

        if ($wallet_amount > 0) {
            $payDesc = 'Wallet full payment for order #' . $order_id;
            if (!$this->Sk_Customer_wallet_model->apply_wallet_payment(
                $user_id,
                $wallet_amount,
                $order_id,
                $payDesc
            )) {
                $this->db->where('id', $order_id)->delete('orders');
                $this->db->where('order_id', $order_id)->delete('order_items');
                return $this->error('Insufficient wallet balance for this order.');
            }
        }

        // Redeem royalty only when order is confirmed now (COD / wallet / fully paid).
        // Unpaid Razorpay (payment_attempt) keeps points until payment verify confirms.
        if ($confirm_now && $royalty_used_points > 0 && $royalty_used_rm > 0) {
            $orderForRoyalty = array_merge($order_data, [
                'id' => $order_id,
                'user_id' => $user_id,
                'royalty_used_points' => $royalty_used_points,
                'royalty_used_rm' => $royalty_used_rm,
                'status' => 'confirmed',
            ]);
            $debitRes = sk_royalty_debit_for_order($orderForRoyalty);
            if (empty($debitRes['success'])) {
                if ($wallet_amount > 0) {
                    $this->Sk_Customer_wallet_model->refund_order_payment($user_id, $order_id, $wallet_amount);
                }
                $this->db->where('id', $order_id)->delete('orders');
                $this->db->where('order_id', $order_id)->delete('order_items');
                return $this->error($debitRes['message'] ?? 'Insufficient royalty points for this order.');
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

        // Royalty earn after paid order, or immediately for COD
        if (($order['payment_status'] ?? '') === 'paid'
            || strtolower((string)($order['payment_method'] ?? '')) === 'cod') {
            sk_royalty_credit_for_order($order);
            $order = $this->Sk_Order_model->get_by_id($order_id, $user_id);
        }

        // Email + WhatsApp only when order is paid now or COD/wallet.
        // Unpaid Razorpay (payment_attempt): notify after payment/verify only.
        $this->load->helper(['sk_mailer', 'sk_invoice', 'sk_whatsapp']);
        sk_invoice_ensure_vendor_schema();
        $settings = $this->get_settings();
        if (in_array($payment_method, ['cod', 'wallet'], true) || $is_paid_now) {
            sk_mail_order_invoice($order, $settings);
            $waStatus = ($order['status'] ?? '') ?: 'confirmed';
            sk_whatsapp_notify_order_status($order, $waStatus, $settings);
        }

        $this->success([
            'order' => $order,
            'payment' => [
                'requires_gateway' => $is_razorpay_due,
                'gateway_amount'   => $gateway_amount,
                'next_step'        => $is_razorpay_due ? 'create_payment_order' : 'complete',
            ],
        ], 'Order placed successfully.', 200);
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

        $fresh = $this->Sk_Order_model->get_by_id((int)$id, $this->user['user_id']);
        if ($fresh) {
            $this->load->helper(['sk_mailer', 'sk_whatsapp']);
            $settings = $this->get_settings();
            sk_mail_order_status($fresh, 'cancelled', $settings);
            sk_whatsapp_notify_order_status($fresh, 'cancelled', $settings);
        }

        $this->success([], $result['message']);
    }

    /** Authenticated invoice links for the logged-in customer. */
    public function invoice($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id((int)$id, $this->user['user_id']);
        if (!$order) {
            return $this->error('Order not found.', 404);
        }
        $this->load->helper(['sk_invoice', 'sk_invoice_pdf']);
        $token = sk_invoice_public_token((int)$order['id'], (string)$order['order_number']);
        $this->success([
            'order_id'       => (int)$order['id'],
            'order_number'   => $order['order_number'],
            'download_url'   => site_url('invoice/download/' . (int)$order['id'] . '/' . $token),
            'view_url'       => site_url('invoice/view/' . (int)$order['id'] . '/' . $token),
            'api_download'   => site_url('shopkart-api/order/' . (int)$order['id'] . '/invoice/download'),
        ]);
    }

    /** Stream PDF invoice for the logged-in order owner (Bearer auth). */
    public function invoice_download($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id((int)$id, $this->user['user_id']);
        if (!$order) {
            return $this->error('Order not found.', 404);
        }
        $this->load->helper(['sk_invoice', 'sk_invoice_pdf']);
        sk_invoice_ensure_vendor_schema();
        $settings = $this->get_settings();
        $invoice = sk_invoice_build($order, $settings);
        $pdf = sk_invoice_build_pdf($invoice);
        $filename = 'invoice-' . preg_replace('/[^a-zA-Z0-9_-]/', '', $invoice['order_number'] ?? (string)$id) . '.pdf';

        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . strlen($pdf));
        header('Cache-Control: private, max-age=0, must-revalidate');
        echo $pdf;
        exit;
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

    private function _ensure_order_source_schema(): void {
        $this->Sk_Order_model->ensure_order_source_schema();
    }

    /**
     * Resolve checkout channel: web | app | unknown.
     * Body order_source/platform, or headers X-Order-Source / X-Client-Platform.
     */
    private function _resolve_order_source(array $data): string {
        $raw = $data['order_source'] ?? ($data['platform'] ?? null);
        if ($raw === null || trim((string) $raw) === '') {
            $raw = $this->input->get_request_header('X-Order-Source', true);
        }
        if ($raw === null || trim((string) $raw) === '') {
            $raw = $this->input->get_request_header('X-Client-Platform', true);
        }
        $v = strtolower(trim((string) $raw));
        if (in_array($v, ['web', 'website'], true)) {
            return 'web';
        }
        if (in_array($v, ['app', 'ios', 'android', 'mobile'], true)) {
            return 'app';
        }
        return 'unknown';
    }

    /**
     * Save checkout delivery name (and optional email) onto the user row.
     * Replaces empty / SER001 / User #### placeholders with the real name from the cart form.
     */
    private function _sync_user_from_checkout(int $user_id, array $addr, array $data): void {
        $user = $this->Sk_User_model->get_by_id($user_id);
        if (!$user) {
            return;
        }
        $this->Sk_User_model->ensure_otp_user_schema();
        $update = [];

        $fullName = trim((string) ($addr['full_name'] ?? ''));
        $curName = trim((string) ($user['name'] ?? ''));
        $isPlaceholderName = $curName === ''
            || (bool) preg_match('/^(User|SER|USR|CUST)\s*\d{1,8}$/i', $curName);
        if ($fullName !== '' && ($isPlaceholderName || strcasecmp($curName, $fullName) !== 0)) {
            if (mb_strlen($fullName) > 100) {
                $fullName = mb_substr($fullName, 0, 100);
            }
            $update['name'] = $fullName;
        }

        // Optional email from checkout body or nested address
        $emailRaw = $data['email'] ?? ($data['customer_email'] ?? ($addr['email'] ?? null));
        if ($emailRaw !== null) {
            $newEmail = strtolower(trim((string) $emailRaw));
            $curEmail = strtolower(trim((string) ($user['email'] ?? '')));
            $isPlaceholderEmail = $curEmail === ''
                || strpos($curEmail, 'ph_') === 0
                || strpos($curEmail, '@shopkart.app') !== false
                || strpos($curEmail, '@2deal.app') !== false;

            if ($newEmail === '') {
                if ($isPlaceholderEmail) {
                    $update['email'] = null;
                }
            } elseif (filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
                if (!$this->Sk_User_model->email_exists($newEmail, $user_id)) {
                    if ($isPlaceholderEmail || $curEmail !== $newEmail) {
                        $update['email'] = $newEmail;
                    }
                }
            }
        }

        if ($update) {
            $this->Sk_User_model->update($user_id, $update);
        }
    }
}
