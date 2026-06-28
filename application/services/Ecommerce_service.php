<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ecommerce_service
{
    protected $CI;

    public function __construct()
    {
        $this->CI =& get_instance();
        $this->CI->load->database();
        $this->CI->load->model('User_model');
    }

    public function registerUser(array $input)
    {
        $roleId = $this->resolveRoleId(isset($input['role']) ? $input['role'] : 'customer');
        $data = array(
            'role_id' => $roleId,
            'name' => $input['name'],
            'email' => $input['email'],
            'mobile' => isset($input['mobile']) ? $input['mobile'] : null,
            'password_hash' => password_hash($input['password'], PASSWORD_BCRYPT),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $id = $this->CI->User_model->create($data);
        return $this->CI->User_model->findById($id);
    }

    public function login($email, $password)
    {
        $user = $this->CI->User_model->findByEmail($email);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            return false;
        }
        return $user;
    }

    public function createPasswordReset($userId)
    {
        $token = bin2hex(random_bytes(24));
        $this->CI->db->insert('password_resets', array(
            'user_id' => $userId,
            'token_hash' => password_hash($token, PASSWORD_BCRYPT),
            'expires_at' => date('Y-m-d H:i:s', strtotime('+30 minutes')),
            'created_at' => date('Y-m-d H:i:s')
        ));
        return $token;
    }

    public function getProducts(array $filters)
    {
        $qb = $this->CI->db->select('p.*, c.name AS category_name, b.name AS brand_name')
            ->from('products p')
            ->join('categories c', 'c.id = p.category_id')
            ->join('brands b', 'b.id = p.brand_id', 'left')
            ->where('p.is_active', 1)
            ->where('p.is_deleted', 0);

        if (!empty($filters['keyword'])) {
            $qb->group_start()
                ->like('p.name', $filters['keyword'])
                ->or_like('p.description', $filters['keyword'])
                ->group_end();
        }
        if (!empty($filters['category_id'])) {
            $qb->where('p.category_id', (int) $filters['category_id']);
        }
        if (!empty($filters['brand_id'])) {
            $qb->where('p.brand_id', (int) $filters['brand_id']);
        }
        if (!empty($filters['min_price'])) {
            $qb->where('p.price >=', (float) $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $qb->where('p.price <=', (float) $filters['max_price']);
        }
        if (!empty($filters['rating'])) {
            $qb->where('p.average_rating >=', (float) $filters['rating']);
        }

        switch (isset($filters['sort']) ? $filters['sort'] : '') {
            case 'price_asc': $qb->order_by('p.price', 'ASC'); break;
            case 'price_desc': $qb->order_by('p.price', 'DESC'); break;
            case 'popular': $qb->order_by('p.total_reviews', 'DESC'); break;
            default: $qb->order_by('p.created_at', 'DESC');
        }
        return $qb->limit(50)->get()->result_array();
    }

    public function addToCart($userId, array $payload)
    {
        $cart = $this->CI->db->where('user_id', $userId)->where('status', 'active')->get('carts')->row_array();
        if (!$cart) {
            $this->CI->db->insert('carts', array('user_id' => $userId, 'status' => 'active'));
            $cart = array('id' => $this->CI->db->insert_id());
        }
        $this->CI->db->replace('cart_items', array(
            'cart_id' => $cart['id'],
            'product_id' => (int) $payload['product_id'],
            'variant_id' => !empty($payload['variant_id']) ? (int) $payload['variant_id'] : null,
            'quantity' => max(1, (int) $payload['quantity']),
            'unit_price' => (float) $payload['unit_price'],
            'updated_at' => date('Y-m-d H:i:s')
        ));
        return $this->CI->db->where('cart_id', $cart['id'])->get('cart_items')->result_array();
    }

    public function placeOrder($userId, array $payload)
    {
        $orderNo = 'ORD' . date('YmdHis') . random_int(1000, 9999);
        $this->CI->db->insert('orders', array(
            'order_no' => $orderNo,
            'user_id' => $userId,
            'address_id' => (int) $payload['address_id'],
            'status' => 'pending',
            'payment_status' => 'pending',
            'subtotal' => (float) $payload['subtotal'],
            'discount_total' => (float) $payload['discount_total'],
            'shipping_total' => (float) $payload['shipping_total'],
            'tax_total' => (float) $payload['tax_total'],
            'grand_total' => (float) $payload['grand_total'],
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ));
        $orderId = $this->CI->db->insert_id();
        foreach ($payload['items'] as $item) {
            $this->CI->db->insert('order_items', array(
                'order_id' => $orderId,
                'product_id' => (int) $item['product_id'],
                'variant_id' => !empty($item['variant_id']) ? (int) $item['variant_id'] : null,
                'product_name' => $item['product_name'],
                'sku' => $item['sku'],
                'quantity' => (int) $item['quantity'],
                'unit_price' => (float) $item['unit_price'],
                'total_price' => (float) $item['total_price']
            ));
        }
        return $this->CI->db->where('id', $orderId)->get('orders')->row_array();
    }

    public function createRazorpayOrder(array $order)
    {
        $this->CI->config->load('ecommerce', true);
        $cfg = $this->CI->config->item('ecommerce');
        $keyId = isset($cfg['razorpay_key_id']) ? $cfg['razorpay_key_id'] : '';
        $keySecret = isset($cfg['razorpay_key_secret']) ? $cfg['razorpay_key_secret'] : '';

        if ($keyId === '' || $keySecret === '') {
            return array('error' => 'Razorpay credentials missing');
        }

        $payload = array(
            'amount' => (int) round((float) $order['grand_total'] * 100),
            'currency' => 'INR',
            'receipt' => $order['order_no'],
            'notes' => array(
                'order_id' => (string) $order['id'],
                'platform' => 'ci3-ecommerce'
            )
        );

        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_USERPWD, $keyId . ':' . $keySecret);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        $raw = curl_exec($ch);
        $curlErr = curl_error($ch);
        $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($curlErr) {
            log_message('error', 'Razorpay curl error: ' . $curlErr);
            return array('error' => 'Unable to connect payment gateway');
        }

        $decoded = json_decode((string) $raw, true);
        if ($statusCode < 200 || $statusCode >= 300 || !is_array($decoded) || empty($decoded['id'])) {
            log_message('error', 'Razorpay order create failed. HTTP: ' . $statusCode . ' response: ' . $raw);
            return array('error' => 'Payment gateway rejected request');
        }

        return array(
            'provider' => 'razorpay',
            'provider_order_id' => $decoded['id'],
            'amount_paise' => (int) $decoded['amount'],
            'currency' => $decoded['currency'],
            'key_id' => $keyId
        );
    }

    public function resolveRoleId($roleCode)
    {
        $role = $this->CI->db->where('code', $roleCode)->get('roles')->row_array();
        return $role ? (int) $role['id'] : 3;
    }
}
