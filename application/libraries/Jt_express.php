<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * JT Express Malaysia Open Platform API client.
 * Docs: POST x-www-form-urlencoded, header digest = base64(md5(bizContentJson + privateKey)).
 */
class Jt_express {

    protected $CI;
    protected $enabled = false;
    protected $sandbox = true;
    protected $api_account = '';
    protected $private_key = '';
    protected $customer_code = '';
    protected $customer_password = '';
    protected $demo_uuid = '';
    protected $default_weight = '1';
    protected $sender = [];

    public function __construct($settings = null) {
        $this->CI =& get_instance();
        if ($settings === null) {
            $this->CI->load->model('Sk_Admin_model');
            $settings = $this->CI->Sk_Admin_model->get_settings();
        }
        $this->load_from_settings($settings);
    }

    public function is_enabled() {
        return $this->enabled
            && $this->api_account !== ''
            && $this->private_key !== ''
            && $this->customer_code !== '';
    }

    public function load_from_settings(array $settings) {
        $this->enabled           = !empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0';
        $this->sandbox             = empty($settings['jt_express_sandbox']) || $settings['jt_express_sandbox'] !== '0';
        $this->api_account         = trim($settings['jt_express_api_account'] ?? '');
        $this->private_key         = trim($settings['jt_express_private_key'] ?? '');
        $this->customer_code       = trim($settings['jt_express_customer_code'] ?? '');
        $this->customer_password   = trim($settings['jt_express_customer_password'] ?? '');
        $this->demo_uuid           = trim($settings['jt_express_demo_uuid'] ?? '5ba402abcfdc4dff9cb1c589afcf9682');
        $this->default_weight      = trim($settings['jt_express_default_weight'] ?? '1') ?: '1';

        $address = trim($settings['jt_express_sender_address'] ?? '');
        $this->sender = [
            'name'        => trim($settings['jt_express_sender_name'] ?? ($settings['site_name'] ?? 'Shop')),
            'mobile'      => $this->normalize_phone($settings['jt_express_sender_phone'] ?? ($settings['site_phone'] ?? '')),
            'phone'       => $this->normalize_phone($settings['jt_express_sender_phone'] ?? ($settings['site_phone'] ?? '')),
            'postCode'    => trim($settings['jt_express_sender_postcode'] ?? ''),
            'prov'        => trim($settings['jt_express_sender_state'] ?? ''),
            'city'        => trim($settings['jt_express_sender_city'] ?? ''),
            'area'        => $address,
            'address'     => $address,
            'countryCode' => 'MYS',
        ];
    }

    /**
     * Create shipment (addOrder).
     */
    public function add_order(array $order) {
        if (!$this->is_enabled()) {
            return $this->fail('JT Express is not configured.');
        }

        $txlogisticId = $order['jt_txlogistic_id'] ?? $order['order_number'];
        $receiverAddr = trim(($order['shipping_line1'] ?? '') . ' ' . ($order['shipping_line2'] ?? ''));
        $totalQty     = 0;
        $items        = [];
        foreach ($order['items'] ?? [] as $item) {
            $qty = max(1, (int)($item['quantity'] ?? 1));
            $totalQty += $qty;
            $items[] = [
                'itemName'      => mb_substr($item['product_name'] ?? 'Product', 0, 100),
                'number'        => $qty,
                'itemValue'     => number_format((float)($item['price'] ?? 0), 2, '.', ''),
                'priceCurrency' => 'MYR',
                'desc'          => mb_substr($item['product_sku'] ?? '', 0, 50),
            ];
        }
        if ($totalQty < 1) {
            $totalQty = 1;
            $items[]  = [
                'itemName'      => 'Order ' . $txlogisticId,
                'number'        => 1,
                'itemValue'     => number_format((float)($order['subtotal'] ?? $order['total'] ?? 0), 2, '.', ''),
                'priceCurrency' => 'MYR',
                'desc'          => '',
            ];
        }

        $payload = [
            'customerCode'  => $this->customer_code,
            'txlogisticId'  => $txlogisticId,
            'expressType'   => 'EZ',
            'orderType'     => '2',
            'serviceType'   => '1',
            'deliveryType'  => '1',
            'payType'       => 'PP_PM',
            'goodsType'     => 'ITN1',
            'weight'        => $this->default_weight,
            'totalQuantity' => $totalQty,
            'itemsValue'    => number_format((float)($order['total'] ?? 0), 2, '.', ''),
            'priceCurrency' => 'MYR',
            'operateType'   => 1,
            'sender'        => $this->sender,
            'receiver'      => [
                'name'        => trim($order['shipping_name'] ?? 'Customer'),
                'mobile'      => $this->normalize_phone($order['shipping_phone'] ?? ''),
                'phone'       => $this->normalize_phone($order['shipping_phone'] ?? ''),
                'postCode'    => trim($order['shipping_pincode'] ?? ''),
                'prov'        => trim($order['shipping_state'] ?? ''),
                'city'        => trim($order['shipping_city'] ?? ''),
                'area'        => $receiverAddr,
                'address'     => $receiverAddr,
                'countryCode' => 'MYS',
            ],
            'items'         => $items,
        ];

        return $this->request('/api/order/addOrder', $payload);
    }

    /**
     * Print airway bill (printOrder).
     */
    public function print_order($billCode, $printSize = 0) {
        if (!$this->is_enabled()) {
            return $this->fail('JT Express is not configured.');
        }
        if ($billCode === '') {
            return $this->fail('AWB / bill code is required.');
        }

        return $this->request('/api/order/printOrder', [
            'customerCode' => $this->customer_code,
            'billCode'     => $billCode,
            'printSize'    => (int)$printSize,
            'printCod'     => 0,
        ]);
    }

    /**
     * Cancel shipment (cancelOrder).
     */
    public function cancel_order($txlogisticId, $reason = 'Cancelled by merchant') {
        if (!$this->is_enabled()) {
            return $this->fail('JT Express is not configured.');
        }
        if ($txlogisticId === '') {
            return $this->fail('txlogisticId is required.');
        }

        return $this->request('/api/order/cancelOrder', [
            'customerCode' => $this->customer_code,
            'txlogisticId' => $txlogisticId,
            'orderType'    => 1,
            'reason'       => mb_substr($reason, 0, 200),
        ]);
    }

    /**
     * Track shipment (logistics trace).
     */
    public function track($billCode) {
        if (!$this->is_enabled()) {
            return $this->fail('JT Express is not configured.');
        }
        if ($billCode === '') {
            return $this->fail('AWB / bill code is required.');
        }

        return $this->request('/api/logistics/trace', [
            'billCodes' => $billCode,
        ], false);
    }

    protected function request($path, array $biz, $with_business_digest = true) {
        if ($with_business_digest) {
            $biz['digest'] = $this->business_digest();
        }

        $bizJson = json_encode($biz, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($bizJson === false) {
            return $this->fail('Failed to encode request payload.');
        }

        $url = $this->base_url() . $path;
        if ($this->sandbox && $this->demo_uuid !== '') {
            $url .= (strpos($url, '?') === false ? '?' : '&') . 'uuid=' . rawurlencode($this->demo_uuid);
        }

        $headers = [
            'apiAccount: ' . $this->api_account,
            'digest: ' . $this->header_digest($bizJson),
            'timestamp: ' . (string)round(microtime(true) * 1000),
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query(['bizContent' => $bizJson]),
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_CONNECTTIMEOUT => 15,
            CURLOPT_TIMEOUT        => 45,
        ]);

        $body     = curl_exec($ch);
        $curlErr  = curl_error($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($curlErr) {
            log_message('error', 'JT Express curl error: ' . $curlErr);
            return $this->fail('Courier API connection failed: ' . $curlErr);
        }

        $decoded = json_decode($body, true);
        if (!is_array($decoded)) {
            log_message('error', 'JT Express invalid JSON (HTTP ' . $httpCode . '): ' . $body);
            return [
                'success'   => false,
                'message'   => 'Invalid response from JT Express.',
                'http_code' => $httpCode,
                'raw'       => $body,
            ];
        }

        $ok = $this->is_success_response($decoded);
        return [
            'success'   => $ok,
            'message'   => $this->response_message($decoded),
            'data'      => $decoded['data'] ?? $decoded,
            'bill_code' => $this->extract_bill_code($decoded),
            'http_code' => $httpCode,
            'raw'       => $decoded,
        ];
    }

    protected function is_success_response(array $res) {
        if (isset($res['success'])) {
            return $res['success'] === true || $res['success'] === 'true' || $res['success'] === 1 || $res['success'] === '1';
        }
        $code = isset($res['code']) ? (string)$res['code'] : '';
        if (in_array($code, ['1', '200', '1000'], true)) {
            return true;
        }
        $msg = strtolower((string)($res['msg'] ?? $res['message'] ?? $res['desc'] ?? ''));
        return strpos($msg, 'success') !== false;
    }

    protected function response_message(array $res) {
        return (string)($res['msg'] ?? $res['message'] ?? $res['desc'] ?? ($res['reason'] ?? 'Unknown response'));
    }

    protected function extract_bill_code(array $res) {
        $data = $res['data'] ?? [];
        if (is_string($data) && $data !== '') {
            return $data;
        }
        if (!is_array($data)) {
            return '';
        }
        foreach (['billCode', 'billcode', 'waybillNo', 'waybill_no', 'mailNo'] as $k) {
            if (!empty($data[$k])) {
                return (string)$data[$k];
            }
        }
        if (!empty($data[0]['billCode'])) {
            return (string)$data[0]['billCode'];
        }
        return '';
    }

    protected function business_digest() {
        $password = $this->customer_password !== '' ? $this->customer_password : $this->private_key;
        $pwdHash  = strtoupper(md5($password . 'jadada369t3'));
        return base64_encode(md5($this->customer_code . $pwdHash, true));
    }

    protected function header_digest($bizContentJson) {
        return base64_encode(md5($bizContentJson . $this->private_key, true));
    }

    protected function base_url() {
        if ($this->sandbox) {
            return 'https://demoopenapi.jtexpress.my/webopenplatformapi';
        }
        return 'https://ylopenapi.jtexpress.my/webopenplatformapi';
    }

    protected function normalize_phone($phone) {
        $phone = preg_replace('/[^\d+]/', '', (string)$phone);
        if ($phone === '') {
            return '';
        }
        if ($phone[0] === '+') {
            $phone = substr($phone, 1);
        }
        if (strpos($phone, '60') !== 0 && strlen($phone) >= 9 && strlen($phone) <= 11) {
            if ($phone[0] === '0') {
                $phone = '60' . substr($phone, 1);
            } else {
                $phone = '60' . $phone;
            }
        }
        return $phone;
    }

    protected function fail($message) {
        return ['success' => false, 'message' => $message, 'data' => null, 'raw' => null];
    }
}
