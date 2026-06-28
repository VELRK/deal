<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Affiliate_Base extends CI_Controller {

    protected $affiliate;

    public function __construct() {
        parent::__construct();
        $this->load->model(['Sk_Affiliate_model', 'Sk_Admin_model']);
        $this->load->library(['session', 'upload', 'form_validation']);
        $this->load->helper(['url', 'form']);

        if (get_class($this) !== 'Affiliate_login') {
            $this->_require_affiliate();
        }
    }

    protected function _require_affiliate(): void {
        $id = (int)$this->session->userdata('sk_affiliate_id');
        if (!$id) {
            redirect('admin/affiliate/login');
        }
        $this->affiliate = $this->Sk_Affiliate_model->get_by_id($id);
        if (!$this->affiliate || $this->affiliate['status'] === 'rejected') {
            $this->session->unset_userdata(['sk_affiliate_login', 'sk_affiliate_id', 'sk_affiliate_name']);
            redirect('admin/affiliate/login');
        }
    }

    protected function render(string $view, array $data = []): void {
        $data['affiliate'] = $this->affiliate;
        $data['settings']  = $this->Sk_Admin_model->get_settings();
        $data['stats']     = $this->Sk_Affiliate_model->get_dashboard_stats((int)$this->affiliate['id']);
        $this->load->view('affiliate/layout/header', $data);
        $this->load->view('affiliate/layout/sidebar', $data);
        $this->load->view('affiliate/' . $view, $data);
        $this->load->view('affiliate/layout/footer', $data);
    }

    protected function upload_file(string $field, string $dir = 'affiliate'): ?string {
        $path = FCPATH . 'assets/uploads/' . $dir . '/';
        if (!is_dir($path)) mkdir($path, 0755, true);
        $config = [
            'upload_path'   => $path,
            'allowed_types' => 'jpg|jpeg|png|gif|webp|pdf',
            'max_size'      => 4096,
            'file_name'     => uniqid($dir . '_'),
        ];
        $this->load->library('upload', $config);
        $this->upload->initialize($config);
        if ($this->upload->do_upload($field)) {
            return 'assets/uploads/' . $dir . '/' . $this->upload->data('file_name');
        }
        return null;
    }
}
