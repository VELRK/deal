<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Payment extends Sk_Base_Api {

    /**
     * Step 1: Create a Razorpay order
     * POST /shopkart-api/payment/create-order
     * Body: { order_id: 123 }
     */
    public function create_order() {
        $this->auth_required();
        $data     = $this->body();
        $order_id = (int)($data['order_id'] ?? 0);

        $order = $this->Sk_Order_model->get_by_id($order_id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);
        if ($order['payment_status'] === 'paid') return $this->error('Order already paid.');

        $walletPaid  = round((float)($order['wallet_amount'] ?? 0), 2);
        $royaltyPaid = round((float)($order['royalty_used_rm'] ?? 0), 2);
        $payAmount   = round(max(0, (float)$order['total'] - $walletPaid - $royaltyPaid), 2);
        if ($payAmount <= 0) {
            return $this->error('Nothing left to pay online for this order.');
        }

        $settings   = $this->get_settings();
        $key_id     = trim((string)($settings['razorpay_key_id']     ?? config_item('razorpay_key_id') ?? ''));
        $key_secret = trim((string)($settings['razorpay_key_secret'] ?? config_item('razorpay_key_secret') ?? ''));

        if ($key_id === '' || $key_secret === '') {
            return $this->error('Payment gateway not configured. Please use Cash on Delivery or contact support.', 503);
        }

        // Validate contact BEFORE creating a Razorpay order (avoids orphan RZP orders)
        $this->load->helper('sk_isms');
        $user = $this->Sk_User_model->get_by_id($this->user['user_id']);
        $contact = sk_razorpay_contact($order['shipping_phone'] ?? '', $settings);
        if ($contact === '') {
            $contact = sk_razorpay_contact($user['phone'] ?? '', $settings);
        }
        if ($contact === '') {
            $contact = sk_razorpay_contact($order['billing_phone'] ?? '', $settings);
        }
        if ($contact === '') {
            return $this->error(
                'A valid Malaysian mobile number is required for online payment. Update your delivery address or profile phone (e.g. 0123456789).',
                422
            );
        }

        $amount_paise = (int)round($payAmount * 100);
        if ($amount_paise < 100) {
            return $this->error('Order amount is too small for online payment (minimum RM 1.00).');
        }

        $currency = strtoupper(trim((string)($settings['currency_code'] ?? 'MYR')));
        if (!in_array($currency, ['MYR', 'INR', 'USD', 'SGD'], true)) {
            $currency = 'MYR';
        }

        // Call Razorpay Orders API
        $payload = json_encode([
            'amount'          => $amount_paise,
            'currency'        => $currency,
            'receipt'         => $order['order_number'],
            'payment_capture' => 1,
            'notes'           => [
                'shop_order_id'     => (string)$order_id,
                'shop_order_number' => (string)$order['order_number'],
            ],
        ]);

        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_USERPWD        => "$key_id:$key_secret",
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => 30,
        ]);
        $response  = curl_exec($ch);
        $curlErr   = curl_error($ch);
        $http_code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false || $curlErr !== '') {
            log_message('error', 'Razorpay CURL Error: ' . $curlErr);
            return $this->error('Could not reach Razorpay. Please try again or use Cash on Delivery.', 502);
        }

        $rzp = json_decode($response, true);
        if (!is_array($rzp)) {
            log_message('error', 'Razorpay create order bad JSON: ' . $response);
            return $this->error('Payment gateway returned an invalid response. Please try again.');
        }

        if ($http_code !== 200 || empty($rzp['id'])) {
            $rzpMsg = $rzp['error']['description']
                ?? $rzp['error']['reason']
                ?? $rzp['message']
                ?? null;
            log_message('error', 'Razorpay create order failed HTTP ' . $http_code . ': ' . $response);
            $hint = $rzpMsg
                ? ('Razorpay: ' . $rzpMsg)
                : 'Failed to create payment order. Check Razorpay keys / MYR currency enablement, or use Cash on Delivery.';
            return $this->error($hint, 502);
        }

        // Save payment record
        $this->Sk_Order_model->save_payment([
            'order_id'          => $order_id,
            'razorpay_order_id' => $rzp['id'],
            'amount'            => $payAmount,
            'currency'          => $currency,
            'status'            => 'created',
        ]);

        $email = sk_razorpay_prefill_email($user['email'] ?? '');

        $prefill = [
            'name'    => $order['shipping_name'],
            'contact' => $contact,
        ];
        if ($email !== '') {
            $prefill['email'] = $email;
        }

        $this->success([
            'razorpay_order_id' => $rzp['id'],
            'amount'            => $amount_paise,
            'pay_amount'        => $payAmount,
            'wallet_amount'     => $walletPaid,
            'royalty_used_rm'   => $royaltyPaid,
            'order_total'       => (float)$order['total'],
            'currency'          => $currency,
            'key_id'            => $key_id,
            'order_number'      => $order['order_number'],
            'prefill'           => $prefill,
        ], 'Payment order created.');
    }

    /**
     * Step 2: Verify Razorpay signature after payment
     * POST /shopkart-api/payment/verify
     * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id }
     */
    public function verify() {
        $this->auth_required();
        $data = $this->body();

        $rzp_order_id   = $data['razorpay_order_id']  ?? '';
        $rzp_payment_id = $data['razorpay_payment_id'] ?? '';
        $rzp_signature  = $data['razorpay_signature']  ?? '';
        $order_id       = (int)($data['order_id'] ?? 0);

        if (!$rzp_order_id || !$rzp_payment_id || !$rzp_signature) {
            return $this->error('Missing payment verification data.');
        }

        if ($order_id > 0) {
            $existing = $this->Sk_Order_model->get_by_id($order_id, $this->user['user_id']);
            if ($existing && ($existing['payment_status'] ?? '') === 'paid') {
                $this->load->helper('sk_royalty');
                sk_royalty_credit_for_order($existing);
                $existing = $this->Sk_Order_model->get_by_id($order_id, $this->user['user_id']);
                return $this->success(['order' => $existing], 'Payment successful! Your order is confirmed.');
            }
        }

        $settings   = $this->get_settings();
        $key_secret = $settings['razorpay_key_secret'] ?? config_item('razorpay_key_secret');

        // Verify signature
        $expected = hash_hmac('sha256', $rzp_order_id . '|' . $rzp_payment_id, $key_secret);
        if (!hash_equals($expected, $rzp_signature)) {
            log_message('error', 'Razorpay signature mismatch for order ' . $order_id);
            return $this->error('Payment verification failed. Invalid signature.', 400);
        }

        // Update payment record
        $this->Sk_Order_model->update_payment($rzp_order_id, [
            'razorpay_payment_id' => $rzp_payment_id,
            'razorpay_signature'  => $rzp_signature,
            'status'              => 'captured',
        ]);

        // Update order
        $this->Sk_Order_model->update_payment_status($order_id, 'paid');
        $this->Sk_Order_model->update_status($order_id, 'confirmed');

        $order = $this->Sk_Order_model->get_by_id($order_id, $this->user['user_id']);

        $this->load->helper('sk_royalty');
        // Redeem reserved royalty only after payment confirms the order.
        $debitRes = sk_royalty_debit_for_order($order);
        if (empty($debitRes['success']) && (int)($order['royalty_used_points'] ?? 0) > 0) {
            log_message('error', 'Royalty redeem failed after payment for order #' . $order_id . ': ' . ($debitRes['message'] ?? ''));
        }
        sk_royalty_credit_for_order($order);
        $order = $this->Sk_Order_model->get_by_id($order_id, $this->user['user_id']);

        $this->load->helper(['sk_mailer', 'sk_invoice', 'sk_whatsapp']);
        sk_invoice_ensure_vendor_schema();
        if (empty($order['invoice_emailed_at'])) {
            sk_mail_order_invoice($order, $settings);
        }
        sk_whatsapp_notify_order_status($order, $order['status'] ?? 'confirmed', $settings);

        $this->success(['order' => $order], 'Payment successful! Your order is confirmed.');
    }

    /**
     * Verify Razorpay payment for wallet top-up.
     * POST /shopkart-api/payment/wallet-topup-verify
     */
    public function wallet_topup_verify() {
        $this->auth_required();
        $data = $this->body();

        $rzpOrderId   = $data['razorpay_order_id'] ?? '';
        $rzpPaymentId = $data['razorpay_payment_id'] ?? '';
        $rzpSignature = $data['razorpay_signature'] ?? '';
        $reference    = trim($data['reference'] ?? '');

        if (!$rzpOrderId || !$rzpPaymentId || !$rzpSignature || !$reference) {
            return $this->error('Missing payment verification data.');
        }
        if (strpos($reference, 'TOPUP-') !== 0) {
            return $this->error('Invalid wallet top-up reference.');
        }

        $settings   = $this->get_settings();
        $keySecret  = $settings['razorpay_key_secret'] ?? config_item('razorpay_key_secret');
        $expected   = hash_hmac('sha256', $rzpOrderId . '|' . $rzpPaymentId, $keySecret);
        if (!hash_equals($expected, $rzpSignature)) {
            log_message('error', 'Razorpay wallet topup signature mismatch: ' . $reference);
            return $this->error('Payment verification failed.', 400);
        }

        $this->load->model('Sk_Customer_wallet_model');
        $userId = (int)$this->user['user_id'];

        if ($this->Sk_Customer_wallet_model->is_topup_completed($reference, $userId)) {
            $wallet = $this->Sk_Customer_wallet_model->get_checkout_info($userId);
            return $this->success($wallet, 'Wallet already topped up.');
        }

        $pending = $this->Sk_Customer_wallet_model->find_topup_pending($reference, $userId, $rzpOrderId);
        if (!$pending) {
            if (!preg_match('/^TOPUP-' . $userId . '-/', $reference)) {
                return $this->error('Invalid top-up reference for your account.', 403);
            }
            return $this->error('Top-up session expired. Please try again.', 404);
        }

        $refToCredit = $pending['reference'] ?? $reference;
        if (!$this->Sk_Customer_wallet_model->complete_topup_by_reference($refToCredit, $userId)) {
            if ($this->Sk_Customer_wallet_model->is_topup_completed($refToCredit, $userId)) {
                $wallet = $this->Sk_Customer_wallet_model->get_checkout_info($userId);
                return $this->success($wallet, 'Wallet topped up successfully!');
            }
            return $this->error('Could not credit wallet. Contact support with ref ' . $reference, 500);
        }

        $wallet = $this->Sk_Customer_wallet_model->get_checkout_info($userId);
        $this->success($wallet, 'Wallet topped up successfully!');
    }

    /** ToyyibPay browser return after wallet top-up / order pay */
    public function toyyibpay_return() {
        $ref = $this->input->get('order_id') ?: $this->input->get('billExternalReferenceNo');
        $status = (int)($this->input->get('status_id') ?: 0);
        $this->load->model('Sk_Customer_wallet_model');
        if ($ref && strpos($ref, 'TOPUP-') === 0 && $status === 1) {
            $this->Sk_Customer_wallet_model->complete_topup_by_reference($ref);
        }
        $q = ($status === 1) ? 'success' : 'failed';
        redirect(rtrim(base_url(), '/') . '/account-wallet?topup=' . $q);
    }

    /** ToyyibPay server callback */
    public function toyyibpay_callback() {
        $ref = $this->input->post('order_id') ?: $this->input->get('order_id')
            ?: $this->input->post('billExternalReferenceNo') ?: $this->input->get('billExternalReferenceNo');
        $status = (int)($this->input->post('status_id') ?: $this->input->get('status_id') ?: 0);
        $this->load->model('Sk_Customer_wallet_model');
        if ($ref && strpos($ref, 'TOPUP-') === 0 && $status === 1) {
            $this->Sk_Customer_wallet_model->complete_topup_by_reference($ref);
        }
        echo 'OK';
    }
}
