<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Promo extends Sk_Base_Api {

    public function apply() {
        $this->auth_required();
        $data         = $this->body();
        $code         = $data['code']         ?? '';
        $order_amount = (float)($data['order_amount'] ?? 0);

        if (!$code) return $this->error('Promo code required.');

        $result = $this->Sk_Promo_model->validate($code, $this->user['user_id'], $order_amount);

        if (!$result['valid']) {
            $this->load->model('Sk_Affiliate_model');
            $affResult = $this->Sk_Affiliate_model->validate_checkout_code($code, $order_amount);
            if ($affResult['valid']) {
                return $this->success([
                    'discount' => $affResult['discount'],
                    'code'     => $affResult['code'],
                    'type'     => $affResult['type'],
                    'value'    => $affResult['value'],
                    'source'   => 'affiliate',
                ], 'Affiliate code applied! You save ₹' . number_format($affResult['discount'], 2));
            }
            return $this->error($affResult['message'] ?? $result['message']);
        }

        $this->success([
            'discount' => $result['discount'],
            'code'     => strtoupper($code),
            'type'     => $result['promo']['type'],
            'value'    => $result['promo']['value'],
            'source'   => 'promo',
        ], 'Promo code applied! You save ₹' . number_format($result['discount'], 2));
    }
}
