<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Order_model extends CI_Model {

    public function create($data, $items) {
        $data['order_number'] = $this->generate_order_number();
        $data['created_at']   = date('Y-m-d H:i:s');
        $this->db->insert('orders', $data);
        $order_id = $this->db->insert_id();

        foreach ($items as $item) {
            $item['order_id'] = $order_id;
            $this->db->insert('order_items', $item);
            $this->load->model('Sk_Product_model');
            $this->Sk_Product_model->reduce_stock(
                $item['product_id'],
                $item['quantity'],
                !empty($item['variant_id']) ? (int)$item['variant_id'] : null
            );
        }
        return $order_id;
    }

    public function get_by_id($id, $user_id = null) {
        $this->db->where('o.id', $id);
        if ($user_id) $this->db->where('o.user_id', $user_id);
        $order = $this->db->select('o.*, u.name as customer_name, u.email as customer_email')
                          ->from('orders o')
                          ->join('users u', 'u.id = o.user_id', 'left')
                          ->get()->row_array();
        if ($order) {
            $order['items'] = $this->get_items($id);
            $order['payment'] = $this->get_payment($id);
        }
        return $order;
    }

    public function get_items($order_id) {
        return $this->db->where('order_id', $order_id)->get('order_items')->result_array();
    }

    public function get_payment($order_id) {
        return $this->db->where('order_id', $order_id)->order_by('id', 'DESC')->limit(1)->get('payments')->row_array();
    }

    public function get_user_orders($user_id, $limit = 10, $offset = 0) {
        return $this->db->where('user_id', $user_id)
                        ->order_by('created_at', 'DESC')
                        ->limit($limit, $offset)
                        ->get('orders')->result_array();
    }

    public function update_status($order_id, $status) {
        $this->ensure_jt_schema();
        $now = date('Y-m-d H:i:s');
        $data = [
            'status'            => $status,
            'status_updated_at' => $now,
        ];
        if ($status === 'confirmed') {
            $data['confirmed_at'] = $now;
        }
        if ($status === 'processing') {
            $data['processing_at'] = $now;
        }
        if ($status === 'shipped') {
            $data['shipped_at'] = $now;
        }
        if ($status === 'delivered') {
            $data['delivered_at'] = $now;
        }
        $this->db->where('id', $order_id)->update('orders', $data);
    }

    public function update_jt_shipment($order_id, array $data) {
        $this->ensure_jt_schema();
        $allowed = [
            'courier_provider', 'jt_txlogistic_id', 'jt_bill_code', 'jt_courier_status',
            'jt_label_data', 'jt_track_data', 'jt_shipment_created_at', 'tracking_number', 'status',
            'confirmed_at', 'processing_at', 'status_updated_at', 'shipped_at', 'delivered_at',
        ];
        $update = [];
        foreach ($allowed as $k) {
            if (array_key_exists($k, $data)) {
                $update[$k] = $data[$k];
            }
        }
        if (!$update) {
            return;
        }
        $this->db->where('id', (int)$order_id)->update('orders', $update);
    }

    public function clear_jt_shipment($order_id) {
        $this->ensure_jt_schema();
        $this->db->where('id', (int)$order_id)->update('orders', [
            'courier_provider'        => null,
            'jt_txlogistic_id'        => null,
            'jt_bill_code'            => null,
            'jt_courier_status'       => 'cancelled',
            'jt_label_data'           => null,
            'jt_track_data'           => null,
            'jt_shipment_created_at'  => null,
        ]);
    }

    public function get_by_tracking($tracking_number) {
        if ($tracking_number === '') {
            return null;
        }
        $this->ensure_jt_schema();
        $order = $this->db->group_start()
            ->where('tracking_number', $tracking_number)
            ->or_where('jt_bill_code', $tracking_number)
            ->group_end()
            ->order_by('id', 'DESC')
            ->limit(1)
            ->get('orders')->row_array();
        if (!$order) {
            return null;
        }
        $order['items'] = $this->get_items($order['id']);
        return $order;
    }

    public function ensure_jt_schema() {
        $this->load->helper('sk_jt_express');
        sk_jt_express_ensure_schema();
    }

    public function update_payment_status($order_id, $status) {
        $this->db->where('id', $order_id)->update('orders', ['payment_status' => $status]);
    }

    public function save_payment($data) {
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert('payments', $data);
        return $this->db->insert_id();
    }

    public function update_payment($razorpay_order_id, $data) {
        $this->db->where('razorpay_order_id', $razorpay_order_id)->update('payments', $data);
    }

    public function get_all_admin($limit, $offset, $filters = []) {
        $this->db->select('o.*, u.name as customer_name, u.email as customer_email')
                 ->from('orders o')
                 ->join('users u', 'u.id = o.user_id', 'left');
        if (!empty($filters['status']))         $this->db->where('o.status', $filters['status']);
        if (!empty($filters['payment_status'])) $this->db->where('o.payment_status', $filters['payment_status']);
        if (!empty($filters['search']))         $this->db->like('o.order_number', $filters['search']);
        $this->db->order_by('o.created_at', 'DESC')->limit($limit, $offset);
        return $this->db->get()->result_array();
    }

    public function count_admin($filters = []) {
        $this->db->from('orders o');
        if (!empty($filters['status']))         $this->db->where('o.status', $filters['status']);
        if (!empty($filters['payment_status'])) $this->db->where('o.payment_status', $filters['payment_status']);
        if (!empty($filters['search']))         $this->db->like('o.order_number', $filters['search']);
        return $this->db->count_all_results();
    }

    /**
     * Orders for JT Express module: shipments created, or ready to create.
     * @return array{rows:array,total:int}
     */
    public function get_jt_shipments(array $filters = [], int $limit = 20, int $offset = 0): array {
        $this->db->from('orders o');
        $this->_jt_shipments_where($filters);
        $total = (int)$this->db->count_all_results();

        $this->db->select('o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone')
            ->from('orders o')
            ->join('users u', 'u.id = o.user_id', 'left');
        $this->_jt_shipments_where($filters);
        $this->db->order_by('o.id', 'DESC')->limit($limit, $offset);
        $rows = $this->db->get()->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    private function _jt_shipments_where(array $filters): void {
        $this->db->where_not_in('o.status', ['cancelled', 'returned']);
        $scope = $filters['scope'] ?? 'all';
        if ($scope === 'created') {
            $this->db->where("o.jt_bill_code IS NOT NULL AND o.jt_bill_code != ''", null, false);
        } elseif ($scope === 'pending') {
            $this->db->group_start()
                ->where('o.jt_bill_code IS NULL', null, false)
                ->or_where('o.jt_bill_code', '')
                ->group_end();
            $this->db->where_in('o.status', ['confirmed', 'processing', 'shipped', 'pending']);
        }
        if (!empty($filters['search'])) {
            $q = $filters['search'];
            $this->db->group_start()
                ->like('o.order_number', $q)
                ->or_like('o.jt_bill_code', $q)
                ->or_like('o.tracking_number', $q)
                ->or_like('o.shipping_name', $q)
                ->or_like('o.shipping_phone', $q)
                ->group_end();
        }
    }

    // Stats
    public function total_orders()   { return $this->db->count_all('orders'); }
    public function pending_orders() { return $this->db->where('status', 'pending')->count_all_results('orders'); }
    public function total_revenue()  {
        $r = $this->db->select_sum('total')->where('payment_status', 'paid')->get('orders')->row();
        return $r->total ?? 0;
    }
    public function monthly_revenue() {
        $r = $this->db->select_sum('total')
                      ->where('payment_status', 'paid')
                      ->where('MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())', null, false)
                      ->get('orders')->row();
        return $r->total ?? 0;
    }
    public function revenue_by_day($days = 30) {
        $rows = $this->db
            ->select('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders')
            ->where('payment_status', 'paid')
            ->where('created_at >=', date('Y-m-d', strtotime("-{$days} days")))
            ->group_by('DATE(created_at)')
            ->order_by('date', 'ASC')
            ->get('orders')->result_array();

        // Build a full date range so chart shows every day (zero for days with no orders)
        $map = [];
        foreach ($rows as $r) $map[$r['date']] = (float) $r['revenue'];

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = date('Y-m-d', strtotime("-{$i} days"));
            $result[] = ['date' => date('d M', strtotime($d)), 'revenue' => $map[$d] ?? 0];
        }
        return $result;
    }
    public function top_products($limit = 5) {
        return $this->db->select('oi.product_name, oi.product_id, SUM(oi.quantity) as qty_sold, SUM(oi.subtotal) as revenue')
                        ->from('order_items oi')
                        ->join('orders o', 'o.id = oi.order_id')
                        ->where('o.payment_status', 'paid')
                        ->group_by('oi.product_id')
                        ->order_by('qty_sold', 'DESC')
                        ->limit($limit)
                        ->get()->result_array();
    }

    /**
     * Orders that include a product (for inventory detail).
     * @return array{rows:array,total:int}
     */
    public function get_orders_for_product(int $productId, int $limit = 20, int $offset = 0): array {
        $productId = (int)$productId;
        $total = (int)$this->db->where('product_id', $productId)->count_all_results('order_items');

        $rows = $this->db->select('o.id, o.order_number, o.status, o.created_at, o.payment_status,
                oi.quantity, oi.variant_id, oi.variant_label, oi.price, oi.subtotal')
            ->from('order_items oi')
            ->join('orders o', 'o.id = oi.order_id')
            ->where('oi.product_id', $productId)
            ->order_by('o.created_at', 'DESC')
            ->limit($limit, $offset)
            ->get()->result_array();

        return ['rows' => $rows, 'total' => $total];
    }

    public function recent_orders($limit = 5) {
        return $this->db->select('o.*, u.name as customer_name')
                        ->from('orders o')
                        ->join('users u', 'u.id = o.user_id', 'left')
                        ->order_by('o.created_at', 'DESC')
                        ->limit($limit)->get()->result_array();
    }

    private function generate_order_number() {
        return 'SK' . strtoupper(substr(md5(microtime()), 0, 8));
    }

    /**
     * True when the user has a qualifying order line for this product (paid, COD, or wallet).
     *
     * @return array{order_id:int,order_item_id:int}|null
     */
    public function user_purchased_product($user_id, $product_id) {
        $user_id = (int)$user_id;
        $product_id = (int)$product_id;
        if ($user_id <= 0 || $product_id <= 0) {
            return null;
        }

        $row = $this->db
            ->select('oi.id AS order_item_id, oi.order_id')
            ->from('order_items oi')
            ->join('orders o', 'o.id = oi.order_id')
            ->where('oi.product_id', $product_id)
            ->where('o.user_id', $user_id)
            ->where_not_in('o.status', ['cancelled', 'returned'])
            ->group_start()
                ->where('o.payment_status', 'paid')
                ->or_where('o.payment_method', 'cod')
            ->group_end()
            ->order_by('o.id', 'DESC')
            ->limit(1)
            ->get()
            ->row_array();

        if (!$row) {
            return null;
        }

        return [
            'order_id'      => (int)$row['order_id'],
            'order_item_id' => (int)$row['order_item_id'],
        ];
    }

    /** Statuses customers may cancel (before shipment). */
    public function customer_cancellable_statuses(): array {
        return ['pending', 'confirmed', 'processing'];
    }

    public function can_customer_cancel(array $order): ?string {
        if (($order['status'] ?? '') === 'cancelled') {
            return null;
        }
        if (!in_array($order['status'] ?? '', $this->customer_cancellable_statuses(), true)) {
            return 'This order can no longer be cancelled.';
        }
        return null;
    }

    public function restore_stock_for_order(int $orderId): void {
        $this->load->model('Sk_Product_model');
        foreach ($this->get_items($orderId) as $item) {
            $qty = (int)($item['quantity'] ?? 0);
            if ($qty <= 0) {
                continue;
            }
            $this->Sk_Product_model->restore_stock(
                (int)$item['product_id'],
                $qty,
                !empty($item['variant_id']) ? (int)$item['variant_id'] : null
            );
        }
    }

    /**
     * Cancel order with wallet / Razorpay refunds and stock restore.
     *
     * @return array{ok: bool, message: string}
     */
    public function cancel_order(int $orderId, ?int $userId = null, array $settings = [], bool $adminForce = false): array {
        $order = $this->get_by_id($orderId, $userId);
        if (!$order) {
            return ['ok' => false, 'message' => 'Order not found.'];
        }
        if (($order['status'] ?? '') === 'cancelled') {
            return ['ok' => true, 'message' => 'Order already cancelled.'];
        }

        if (!$adminForce) {
            $block = $this->can_customer_cancel($order);
            if ($block) {
                return ['ok' => false, 'message' => $block];
            }
        } elseif (in_array($order['status'] ?? '', ['delivered', 'returned'], true)) {
            return ['ok' => false, 'message' => 'Delivered or returned orders cannot be cancelled.'];
        }

        $walletRefund = (float)($order['wallet_amount'] ?? 0);
        if ($walletRefund <= 0 && ($order['payment_method'] ?? '') === 'wallet' && ($order['payment_status'] ?? '') === 'paid') {
            $walletRefund = (float)$order['total'];
        }

        $royaltyRefundPts = (int)($order['royalty_used_points'] ?? 0);
        $royaltyRefundRm  = round((float)($order['royalty_used_rm'] ?? 0), 2);

        $onlineRefund = 0.0;
        $payment = $order['payment'] ?? $this->get_payment($orderId);
        $wasPaid = ($order['payment_status'] ?? '') === 'paid';
        if ($wasPaid && ($order['payment_method'] ?? '') === 'razorpay') {
            $onlineRefund = round(max(0, (float)$order['total'] - $walletRefund - $royaltyRefundRm), 2);
        }

        if ($onlineRefund > 0) {
            $paymentId = $payment['razorpay_payment_id'] ?? '';
            if (!$paymentId) {
                return ['ok' => false, 'message' => 'Payment record missing. Contact support to cancel this order.'];
            }
            $refund = $this->_razorpay_refund($paymentId, $onlineRefund, $settings);
            if (!$refund['ok']) {
                return ['ok' => false, 'message' => $refund['message']];
            }
        }

        if ($walletRefund > 0) {
            $this->load->model('Sk_Customer_wallet_model');
            if (!$this->Sk_Customer_wallet_model->refund_order_payment((int)$order['user_id'], $orderId, $walletRefund)) {
                return ['ok' => false, 'message' => 'Could not refund wallet balance. Please contact support.'];
            }
        }

        if ($royaltyRefundPts > 0 && $royaltyRefundRm > 0) {
            $this->load->model('Sk_Royalty_model');
            $this->Sk_Royalty_model->credit(
                (int)$order['user_id'],
                $royaltyRefundPts,
                $royaltyRefundRm,
                'ORD-' . $orderId . '-ROYALTY-REFUND',
                'Royalty refund ' . $royaltyRefundPts . ' pts (RM ' . number_format($royaltyRefundRm, 2) . ') for cancelled order #' . $orderId,
                $orderId
            );
        }

        $this->restore_stock_for_order($orderId);

        $newPaymentStatus = $wasPaid ? 'refunded' : 'failed';
        $this->update_status($orderId, 'cancelled');
        $this->update_payment_status($orderId, $newPaymentStatus);

        $msg = 'Order cancelled.';
        if ($wasPaid) {
            $msg = 'Order cancelled and refund initiated.';
        } elseif ($walletRefund > 0) {
            $msg = 'Order cancelled. Wallet balance has been restored.';
        }

        return ['ok' => true, 'message' => $msg];
    }

    /** @return array{ok: bool, message: string} */
    protected function _razorpay_refund(string $paymentId, float $amountRm, array $settings): array {
        if ($amountRm <= 0) {
            return ['ok' => true, 'message' => ''];
        }
        $keyId     = $settings['razorpay_key_id'] ?? config_item('razorpay_key_id');
        $keySecret = $settings['razorpay_key_secret'] ?? config_item('razorpay_key_secret');
        if (!$keyId || !$keySecret) {
            return ['ok' => false, 'message' => 'Payment gateway not configured for refund.'];
        }

        $currency = strtoupper($settings['currency_code'] ?? 'MYR');
        $payload = json_encode([
            'amount'   => (int)round($amountRm * 100),
            'currency' => $currency,
            'notes'    => ['reason' => 'Order cancelled by customer'],
        ]);

        $ch = curl_init('https://api.razorpay.com/v1/payments/' . rawurlencode($paymentId) . '/refund');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_USERPWD        => $keyId . ':' . $keySecret,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => 30,
        ]);
        $response = curl_exec($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $body = json_decode($response ?: '', true);
        if ($httpCode >= 200 && $httpCode < 300 && !empty($body['id'])) {
            return ['ok' => true, 'message' => ''];
        }

        $err = is_array($body) ? ($body['error']['description'] ?? $body['error']['reason'] ?? '') : '';
        log_message('error', 'Razorpay refund failed for payment ' . $paymentId . ': ' . $response);
        return ['ok' => false, 'message' => $err ?: 'Online payment refund failed. Please contact support.'];
    }
}
