<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Affiliate_payouts extends Sk_Base {

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

    protected function assert_payout_access(int $payoutId): array {
        $payout = $this->Sk_Affiliate_model->get_payout_by_id($payoutId);
        if (!$payout) {
            show_404();
        }
        $vid = $this->scoped_vendor_id();
        if ($vid && !$this->Sk_Affiliate_model->payout_belongs_to_vendor($payout, $vid)) {
            show_error('Access denied.', 403);
        }
        return $payout;
    }

    public function index() {
        $filters = [
            'search' => $this->input->get('search', TRUE),
            'status' => $this->input->get('status', TRUE),
        ];
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $vendorId = $this->scoped_vendor_id();
        $result = $this->Sk_Affiliate_model->get_all_payouts($filters, 20, ($page - 1) * 20, $vendorId);

        $data['title']          = $vendorId ? 'Affiliate Payouts' : 'Affiliate Payouts';
        $data['payouts']        = $result['rows'];
        $data['total']          = $result['total'];
        $data['page']           = $page;
        $data['filters']        = $filters;
        $data['min_payout']     = $this->Sk_Affiliate_model->get_min_payout();
        $data['is_vendor_scope']= (bool)$vendorId;
        $this->render('affiliate_payouts/index', $data);
    }

    public function approve($id) {
        $this->assert_payout_access((int)$id);
        if ($this->Sk_Affiliate_model->approve_payout((int)$id, $this->admin['id'], $this->input->post('notes', TRUE))) {
            $this->activity_log->log_admin('affiliate_payouts', 'approve', (int)$id, null, [], $this->scoped_vendor_id());
            $this->session->set_flashdata('success', 'Payout approved.');
        } else {
            $this->session->set_flashdata('error', 'Could not approve payout.');
        }
        redirect('admin/affiliate-payouts');
    }

    public function pay($id) {
        $this->assert_payout_access((int)$id);
        $ref = trim($this->input->post('payment_reference', TRUE));
        if (!$ref) {
            $this->session->set_flashdata('error', 'Payment reference required.');
            redirect('admin/affiliate-payouts');
        }
        if ($this->Sk_Affiliate_model->mark_payout_paid((int)$id, $this->admin['id'], $ref)) {
            $this->activity_log->log_admin('affiliate_payouts', 'paid', (int)$id, null, ['reference' => $ref], $this->scoped_vendor_id());
            $this->session->set_flashdata('success', 'Marked as paid.');
        } else {
            $this->session->set_flashdata('error', 'Could not mark paid.');
        }
        redirect('admin/affiliate-payouts');
    }

    public function reject($id) {
        $this->assert_payout_access((int)$id);
        $reason = trim($this->input->post('reason', TRUE)) ?: 'Rejected by admin';
        $this->Sk_Affiliate_model->reject_payout((int)$id, $this->admin['id'], $reason);
        $this->activity_log->log_admin('affiliate_payouts', 'reject', (int)$id, null, ['reason' => $reason], $this->scoped_vendor_id());
        $this->session->set_flashdata('success', 'Payout rejected.');
        redirect('admin/affiliate-payouts');
    }

    public function settlement() {
        $from = $this->input->get('from') ?: date('Y-m-01');
        $to   = $this->input->get('to') ?: date('Y-m-d');
        $vendorId = $this->scoped_vendor_id();

        $data['title'] = $vendorId ? 'Affiliate Settlement Report' : 'Settlement Report';
        $data['from'] = $from;
        $data['to'] = $to;
        $data['is_vendor_scope'] = (bool)$vendorId;
        $data['stats'] = $this->Sk_Affiliate_model->report_stats($from, $to, $vendorId);
        $data['payouts'] = $this->Sk_Affiliate_model->get_payouts_in_period($vendorId, $from, $to);
        $this->render('affiliate_payouts/settlement', $data);
    }

    public function export() {
        $from = $this->input->get('from') ?: date('Y-m-01');
        $to   = $this->input->get('to') ?: date('Y-m-d');
        $vendorId = $this->scoped_vendor_id();
        $rows = $this->Sk_Affiliate_model->get_payouts_in_period($vendorId, $from, $to);

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="payouts_' . $from . '_' . $to . '.csv"');
        $out = fopen('php://output', 'w');
        fputcsv($out, ['ID', 'Affiliate', 'Email', 'Promo', 'Amount', 'Status', 'Scheduled', 'Paid At', 'Reference']);
        foreach ($rows as $r) {
            fputcsv($out, [$r['id'], $r['name'], $r['email'], $r['promo_code'], $r['amount'], $r['status'],
                $r['scheduled_payout_date'], $r['paid_at'], $r['payment_reference']]);
        }
        fclose($out);
    }
}
