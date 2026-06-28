<?php

defined('BASEPATH') OR exit('No direct script access allowed');



require_once APPPATH . 'controllers/admin/Sk_Base.php';



class Affiliate_reports extends Sk_Base {



    public function __construct() {

        parent::__construct();

        if (!$this->is_super_admin() && !$this->current_vendor_id()) {

            show_error('Access denied.', 403);

        }

        $this->load->model('Sk_Affiliate_model');

        $this->Sk_Affiliate_model->ensure_vendor_affiliate_schema();

    }



    protected function scoped_vendor_id(): ?int {

        return $this->current_vendor_id();

    }



    public function index() {

        $from = $this->input->get('from') ?: date('Y-m-01');

        $to   = $this->input->get('to') ?: date('Y-m-d');

        $tab  = $this->input->get('tab') ?: 'dashboard';

        $vendorId = $this->scoped_vendor_id();



        $data['title'] = $vendorId ? 'Affiliate Performance Reports' : 'Affiliate Analytics';

        $data['from']  = $from;

        $data['to']    = $to;

        $data['tab']   = $tab;

        $data['is_vendor_scope'] = (bool)$vendorId;

        $data['stats'] = $this->Sk_Affiliate_model->report_stats($from, $to, $vendorId);

        $data['top_affiliates'] = $this->Sk_Affiliate_model->get_top_affiliates($vendorId, 10, $from, $to);

        $data['daily_checkouts'] = $this->Sk_Affiliate_model->get_daily_checkouts($vendorId, $from, $to);

        $data['sales_rows'] = $this->Sk_Affiliate_model->get_report_sales($vendorId, $from, $to);

        $data['commission_rows'] = $this->Sk_Affiliate_model->get_report_commissions($vendorId, $from, $to);

        $data['conversion_rows'] = $this->Sk_Affiliate_model->get_report_conversions($vendorId, $from, $to);



        $this->render('affiliate_reports/index', $data);

    }



    public function export() {

        $from = $this->input->get('from') ?: date('Y-m-01');

        $to   = $this->input->get('to') ?: date('Y-m-d');

        $type = $this->input->get('type') ?: 'commissions';

        $vendorId = $this->scoped_vendor_id();



        header('Content-Type: text/csv');

        header('Content-Disposition: attachment; filename="affiliate_' . $type . '_' . $from . '.csv"');

        $out = fopen('php://output', 'w');



        if ($type === 'checkouts' || $type === 'clicks') {

            fputcsv($out, ['Date', 'Checkout Orders']);

            foreach ($this->Sk_Affiliate_model->get_daily_checkouts($vendorId, $from, $to) as $r) {

                fputcsv($out, [$r['d'], $r['cnt']]);

            }

        } elseif ($type === 'sales') {

            fputcsv($out, ['Order ID', 'Affiliate', 'Promo', 'Order Total', 'Commission', 'Status', 'Date']);

            foreach ($this->Sk_Affiliate_model->get_report_sales($vendorId, $from, $to, 5000) as $r) {

                fputcsv($out, [$r['order_id'], $r['affiliate_name'], $r['promo_code'], $r['order_total'], $r['commission_amount'], $r['status'], $r['created_at']]);

            }

        } elseif ($type === 'conversions') {

            fputcsv($out, ['Affiliate', 'Promo', 'Period Orders', 'Period Sales Amount', 'Lifetime Orders']);

            foreach ($this->Sk_Affiliate_model->get_report_conversions($vendorId, $from, $to, 5000) as $r) {

                fputcsv($out, [

                    $r['name'],

                    $r['promo_code'],

                    $r['period_checkouts'] ?? $r['period_sales'] ?? 0,

                    $r['period_sales_amount'] ?? 0,

                    $r['total_sales'],

                ]);

            }

        } else {

            fputcsv($out, ['Order ID', 'Affiliate', 'Promo', 'Order Total', 'Rate %', 'Commission', 'Status', 'Date']);

            foreach ($this->Sk_Affiliate_model->get_report_commissions($vendorId, $from, $to, 5000) as $r) {

                fputcsv($out, [$r['order_id'], $r['affiliate_name'], $r['promo_code'], $r['order_total'], $r['commission_rate'], $r['commission_amount'], $r['status'], $r['created_at']]);

            }

        }

        fclose($out);

    }

}

