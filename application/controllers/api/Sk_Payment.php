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

        $settings   = $this->get_settings();
        $key_id     = $settings['razorpay_key_id']     ?? config_item('razorpay_key_id');
        $key_secret = $settings['razorpay_key_secret'] ?? config_item('razorpay_key_secret');

        if (!$key_id || !$key_secret) {
            return $this->error('Payment gateway not configured.', 503);
        }

        $amount_paise = (int)round($order['total'] * 100);

        // Call Razorpay Orders API
        $payload = json_encode([
            'amount'          => $amount_paise,
            'currency'        => 'INR',
            'receipt'         => $order['order_number'],
            'payment_capture' => 1,
        ]);

        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_USERPWD        => "$key_id:$key_secret",
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_SSL_VERIFYPEER => false, // Fix for local dev hangs
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => 30,
        ]);
        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            log_message('error', 'CURL Error: ' . curl_error($ch));
        }
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $rzp = json_decode($response, true);

        if ($http_code !== 200 || empty($rzp['id'])) {
            log_message('error', 'Razorpay create order failed: ' . $response);
            return $this->error('Failed to create payment order. Please try again.');
        }

        // Save payment record
        $this->Sk_Order_model->save_payment([
            'order_id'          => $order_id,
            'razorpay_order_id' => $rzp['id'],
            'amount'            => $order['total'],
            'currency'          => 'INR',
            'status'            => 'created',
        ]);

        $this->success([
            'razorpay_order_id' => $rzp['id'],
            'amount'            => $amount_paise,
            'currency'          => 'INR',
            'key_id'            => $key_id,
            'order_number'      => $order['order_number'],
            'prefill' => [
                'name'  => $order['shipping_name'],
                'email' => $this->Sk_User_model->get_by_id($this->user['user_id'])['email'] ?? '',
                'contact' => $order['shipping_phone'],
            ],
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

        $this->load->helper(['sk_mailer', 'sk_invoice']);
        sk_invoice_ensure_vendor_schema();
        if (empty($order['invoice_emailed_at'])) {
            sk_mail_order_invoice($order, $settings);
        }

        $this->success(['order' => $order], 'Payment successful! Your order is confirmed.');
    }
}
