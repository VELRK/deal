<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'controllers/admin/Sk_Base.php';

class CouponReport extends Sk_Base {

    public function index() {
        $search = $this->input->get('search', TRUE);
        $page   = max(1, (int)($this->input->get('page') ?? 1));
        $limit  = 20;
        $offset = ($page - 1) * $limit;

        // Summary per coupon code
        $q = $this->db
            ->select('pc.id, pc.code, pc.type, pc.value, pc.usage_limit, pc.usage_count,
                      SUM(o.discount) AS total_discount_given,
                      COUNT(pu.id)    AS times_used,
                      MAX(pu.used_at) AS last_used')
            ->from('promo_codes pc')
            ->join('promo_usage pu', 'pu.promo_id = pc.id', 'left')
            ->join('orders o',       'o.id = pu.order_id',  'left');

        if ($search) $q->like('pc.code', $search);

        $summaries = $q->group_by('pc.id')
                       ->order_by('times_used DESC')
                       ->limit($limit, $offset)
                       ->get()->result_array();

        // Detailed usage log (fresh query)
        $this->db->reset_query();
        $q2 = $this->db
            ->select('pu.used_at, pc.code, u.name AS user_name, u.email AS user_email, o.order_number, o.discount, o.total')
            ->from('promo_usage pu')
            ->join('promo_codes pc', 'pc.id = pu.promo_id', 'left')
            ->join('users u',        'u.id = pu.user_id',   'left')
            ->join('orders o',       'o.id = pu.order_id',  'left');

        if ($search) $q2->like('pc.code', $search);

        $usage_log = $q2->order_by('pu.used_at DESC')->limit(100)->get()->result_array();

        $total_discount = array_sum(array_column($summaries, 'total_discount_given'));

        $data['title']          = 'Coupon Report';
        $data['summaries']      = $summaries;
        $data['usage_log']      = $usage_log;
        $data['total_discount'] = $total_discount;
        $data['search']         = $search;
        $data['page']           = $page;
        $data['limit']          = $limit;
        $data['settings']       = $this->Sk_Admin_model->get_settings();
        $this->render('reports/coupon', $data);
    }
}
