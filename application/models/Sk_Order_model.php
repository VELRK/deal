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
            $this->Sk_Product_model->reduce_stock($item['product_id'], $item['quantity']);
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
        $data = ['status' => $status];
        if ($status === 'shipped') $data['shipped_at'] = date('Y-m-d H:i:s');
        if ($status === 'delivered') $data['delivered_at'] = date('Y-m-d H:i:s');
        $this->db->where('id', $order_id)->update('orders', $data);
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
}
