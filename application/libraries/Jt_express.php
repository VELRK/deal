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
        $this->CI->load->helper('sk_jt_express');
        $jtCfg = sk_jt_express_config();

        $this->enabled = !empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0';
        // Do not use empty() — PHP empty('0') === true would force sandbox forever.
        $this->sandbox = sk_jt_express_is_sandbox($settings);
        $this->default_weight = trim($settings['jt_express_default_weight'] ?? '1') ?: '1';

        // Safety: DB still holding demo API account while sandbox is OFF → force production.
        $dbApi = trim($settings['jt_express_api_account'] ?? '');
        if (!$this->sandbox && ($dbApi === '' || $dbApi === '640826271705595946')) {
            // keep sandbox=false; credentials applied below from config
        }

        // Production credentials always come from config (never from editable DB fields).
        if (!$this->sandbox) {
            $prod = is_array($jtCfg['production'] ?? null) ? $jtCfg['production'] : [];
            $this->api_account       = trim($prod['api_account'] ?? '838338320232973056');
            $this->private_key       = trim($prod['private_key'] ?? 'c1fe13bc3f7642fd96297248a80533d5');
            $this->customer_code     = trim($prod['customer_code'] ?? 'JTMY024627');
            $this->customer_password = trim($prod['customer_password'] ?? '06F4B84632C34F6476EAB9F872587660');
            $this->demo_uuid         = trim($prod['demo_uuid'] ?? '');
            $address = trim($prod['sender_address'] ?? '');
            $this->sender = [
                'name'        => trim($prod['sender_name'] ?? ($settings['site_name'] ?? 'Shop')),
                'mobile'      => $this->normalize_phone($prod['sender_phone'] ?? ''),
                'phone'       => $this->normalize_phone($prod['sender_phone'] ?? ''),
                'postCode'    => trim($prod['sender_postcode'] ?? ''),
                'prov'        => trim($prod['sender_state'] ?? ''),
                'city'        => trim($prod['sender_city'] ?? ''),
                'area'        => $address,
                'address'     => $address,
                'countryCode' => 'MYS',
            ];
            return;
        }

        // Sandbox: Settings DB (with config sandbox defaults as fallback).
        $sb = is_array($jtCfg['sandbox'] ?? null) ? $jtCfg['sandbox'] : [];
        $this->api_account       = trim($settings['jt_express_api_account'] ?? ($sb['api_account'] ?? ''));
        $this->private_key       = trim($settings['jt_express_private_key'] ?? ($sb['private_key'] ?? ''));
        $this->customer_code     = trim($settings['jt_express_customer_code'] ?? ($sb['customer_code'] ?? ''));
        $this->customer_password = trim($settings['jt_express_customer_password'] ?? ($sb['customer_password'] ?? ''));
        $this->demo_uuid         = trim($settings['jt_express_demo_uuid'] ?? ($sb['demo_uuid'] ?? '5ba402abcfdc4dff9cb1c589afcf9682'));

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

    /** Debug-friendly mode + masked account (for admin error messages). */
    public function debug_identity() {
        return [
            'mode'        => $this->sandbox ? 'sandbox' : 'production',
            'api_account' => $this->api_account,
            'customer'    => $this->customer_code,
            'base_url'    => $this->base_url(),
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
            $itemWeightGrams = max(1, (int)round(((float)$this->default_weight * 1000) / max(1, $qty)));
            $items[] = [
                'itemName'     => mb_substr($item['product_name'] ?? 'Product', 0, 100),
                'number'       => (string)$qty,
                'itemValue'    => number_format((float)($item['price'] ?? 0), 2, '.', ''),
                'itemCurrency' => 'MYR',
                'weight'       => (string)$itemWeightGrams,
                'itemDesc'     => mb_substr($item['product_sku'] ?? '', 0, 50),
            ];
        }
        if ($totalQty < 1) {
            $totalQty = 1;
            $items[]  = [
                'itemName'     => 'Order ' . $txlogisticId,
                'number'       => '1',
                'itemValue'    => number_format((float)($order['subtotal'] ?? $order['total'] ?? 0), 2, '.', ''),
                'itemCurrency' => 'MYR',
                'weight'       => (string)max(1, (int)round((float)$this->default_weight * 1000)),
                'itemDesc'     => '',
            ];
        }

        $itemsValue = number_format((float)($order['total'] ?? 0), 2, '.', '');
        $weight     = number_format((float)$this->default_weight, 2, '.', '');

        $payload = [
            'customerCode'  => $this->customer_code,
            'txlogisticId'  => $txlogisticId,
            'actionType'    => 'add',
            'expressType'   => 'EZ',
            'serviceType'   => '1',
            'payType'       => 'PP_PM',
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
            'packageInfo'   => [
                'packageQuantity' => (string)max(1, $totalQty),
                'weight'          => $weight,
                'packageValue'    => $itemsValue,
                'goodsType'       => 'ITN8',
                'length'          => '10.00',
                'width'           => '10.00',
                'height'          => '10.00',
            ],
            'items'         => $items,
        ];

        return $this->request('/api/order/addOrder', $payload);
    }

    /**
     * Print airway bill (printOrder).
     * Docs require customerCode + password + txlogisticId; billCode optional but preferred.
     */
    public function print_order($billCode, $txlogisticId = '', $printSize = 0) {
        if (!$this->is_enabled()) {
            return $this->fail('JT Express is not configured.');
        }
        $billCode = trim((string)$billCode);
        $txlogisticId = trim((string)$txlogisticId);
        if ($billCode === '' && $txlogisticId === '') {
            return $this->fail('AWB / bill code or txlogisticId is required.');
        }

        $payload = [
            'customerCode'  => $this->customer_code,
            'txlogisticId'  => $txlogisticId !== '' ? $txlogisticId : $billCode,
            'enableNewPrint'=> 'mdzt',
        ];
        if ($billCode !== '') {
            $payload['billCode'] = $billCode;
        }
        // printSize kept for older templates; new mid-platform uses enableNewPrint
        if ((int)$printSize > 0) {
            $payload['printSize'] = (int)$printSize;
        }

        return $this->request('/api/order/printOrder', $payload);
    }

    /**
     * Cancel shipment (cancelOrder).
     * JT MY requires billCode once an AWB has been issued.
     */
    public function cancel_order($txlogisticId, $reason = 'Cancelled by merchant', $billCode = '') {
        if (!$this->is_enabled()) {
            return $this->fail('JT Express is not configured.');
        }
        $txlogisticId = trim((string)$txlogisticId);
        $billCode = trim((string)$billCode);
        if ($txlogisticId === '' && $billCode === '') {
            return $this->fail('txlogisticId or billCode is required.');
        }

        $payload = [
            'customerCode' => $this->customer_code,
            'orderType'    => 1,
            'reason'       => mb_substr((string)$reason, 0, 200),
        ];
        if ($txlogisticId !== '') {
            $payload['txlogisticId'] = $txlogisticId;
        }
        if ($billCode !== '') {
            $payload['billCode'] = $billCode;
        }

        return $this->request('/api/order/cancelOrder', $payload);
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

        // Sandbox/production both require business password on trace
        return $this->request('/api/logistics/trace', [
            'customerCode' => $this->customer_code,
            'billCodes'    => $billCode,
        ], true);
    }

    protected function request($path, array $biz, $with_business_digest = true) {
        if ($with_business_digest) {
            // MY Open Platform: business password = MD5(plain + jadada369t3) uppercase
            $biz['password'] = $this->business_password_hash();
            if (empty($biz['customerCode']) && $this->customer_code !== '') {
                $biz['customerCode'] = $this->customer_code;
            }
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
        $candidates = [];
        if (isset($res['data'])) {
            $candidates[] = $res['data'];
        }
        $candidates[] = $res;
        if (isset($res['data']['orderList']) && is_array($res['data']['orderList'])) {
            $candidates = array_merge($candidates, $res['data']['orderList']);
        }
        if (isset($res['data'][0]) && is_array($res['data'][0])) {
            $candidates[] = $res['data'][0];
        }

        foreach ($candidates as $data) {
            if (is_string($data) && $data !== '' && !preg_match('/[\{\[]/', $data)) {
                return $data;
            }
            if (!is_array($data)) {
                continue;
            }
            foreach (['billCode', 'billcode', 'waybillNo', 'waybill_no', 'mailNo', 'awb'] as $k) {
                if (!empty($data[$k])) {
                    return (string)$data[$k];
                }
            }
        }
        return '';
    }

    /** Plaintext customer password (from settings), fallback private key for demo. */
    protected function customer_plain_password() {
        return $this->customer_password !== '' ? $this->customer_password : $this->private_key;
    }

    /**
     * Business param password = MD5(plain + jadada369t3) uppercase.
     * If settings already store a 32-char hex hash (Flutter Firestore app_data/hash style), use it as-is.
     */
    protected function business_password_hash() {
        $plain = $this->customer_plain_password();
        if (preg_match('/^[A-Fa-f0-9]{32}$/', $plain)) {
            return strtoupper($plain);
        }
        return strtoupper(md5($plain . 'jadada369t3'));
    }

    protected function business_digest() {
        $pwdHash = $this->business_password_hash();
        return base64_encode(md5($this->customer_code . $pwdHash, true));
    }

    protected function header_digest($bizContentJson) {
        return base64_encode(md5($bizContentJson . $this->private_key, true));
    }

    protected function base_url() {
        $this->CI->load->helper('sk_jt_express');
        $jtCfg = sk_jt_express_config();
        $urls = is_array($jtCfg['api_urls'] ?? null) ? $jtCfg['api_urls'] : [];
        if ($this->sandbox) {
            return $urls['sandbox'] ?? 'https://demoopenapi.jtexpress.my/webopenplatformapi';
        }
        return $urls['production'] ?? 'https://ylopenapi.jtexpress.my/webopenplatformapi';
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
