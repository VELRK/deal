<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Whatsapp_report extends Sk_Base {

    public function index() {
        $this->load->helper('sk_whatsapp');
        sk_whatsapp_ensure_log_schema();

        $status = trim((string)$this->input->get('status', TRUE));
        $search = trim((string)$this->input->get('search', TRUE));
        $from   = trim((string)$this->input->get('from', TRUE));
        $to     = trim((string)$this->input->get('to', TRUE));
        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 25;
        $offset = ($page - 1) * $limit;

        $applyFilters = function () use ($status, $search, $from, $to) {
            if (in_array($status, ['sent', 'failed', 'skipped'], true)) {
                $this->db->where('delivery_status', $status);
            }
            if ($search !== '') {
                $this->db->group_start()
                    ->like('order_number', $search)
                    ->or_like('phone', $search)
                    ->or_like('reason', $search)
                    ->group_end();
            }
            if ($from !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $from)) {
                $this->db->where('created_at >=', $from . ' 00:00:00');
            }
            if ($to !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $to)) {
                $this->db->where('created_at <=', $to . ' 23:59:59');
            }
        };

        $applyFilters();
        $total = (int)$this->db->count_all_results('whatsapp_logs');

        $applyFilters();
        $rows = $this->db->order_by('id', 'DESC')->limit($limit, $offset)->get('whatsapp_logs')->result_array();

        // Summary counts (same date/search filters, ignore status filter for cards)
        $this->db->reset_query();
        if ($search !== '') {
            $this->db->group_start()
                ->like('order_number', $search)
                ->or_like('phone', $search)
                ->or_like('reason', $search)
                ->group_end();
        }
        if ($from !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $from)) {
            $this->db->where('created_at >=', $from . ' 00:00:00');
        }
        if ($to !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $to)) {
            $this->db->where('created_at <=', $to . ' 23:59:59');
        }
        $summaryRows = $this->db->select('delivery_status, COUNT(*) AS cnt', false)
            ->group_by('delivery_status')
            ->get('whatsapp_logs')->result_array();
        $summary = ['sent' => 0, 'failed' => 0, 'skipped' => 0, 'total' => 0];
        foreach ($summaryRows as $s) {
            $k = $s['delivery_status'];
            $c = (int)$s['cnt'];
            if (isset($summary[$k])) {
                $summary[$k] = $c;
            }
            $summary['total'] += $c;
        }

        $data['title']   = 'WhatsApp Delivery Report';
        $data['logs']    = $rows;
        $data['summary'] = $summary;
        $data['total']   = $total;
        $data['page']    = $page;
        $data['limit']   = $limit;
        $data['status']  = $status;
        $data['search']  = $search;
        $data['from']    = $from;
        $data['to']      = $to;
        $this->render('whatsapp_report/index', $data);
    }

    public function view($id = 0) {
        $this->load->helper('sk_whatsapp');
        sk_whatsapp_ensure_log_schema();
        $row = $this->db->where('id', (int)$id)->get('whatsapp_logs')->row_array();
        if (!$row) {
            show_404();
        }
        $data['title'] = 'WhatsApp Log #' . (int)$id;
        $data['log']   = $row;
        $this->render('whatsapp_report/view', $data);
    }
}
