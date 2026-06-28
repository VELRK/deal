<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Base extends CI_Controller {

    protected $admin;
    /** @var Sk_Vendor_context */
    protected $vendor_context;
    /** @var Sk_Activity_log */
    protected $activity_log;

    public function __construct() {
        parent::__construct();
        $this->load->model(['Sk_Admin_model', 'Sk_Product_model', 'Sk_Order_model', 'Sk_User_model', 'Sk_Promo_model', 'Sk_Vendor_model']);
        $this->load->library(['session', 'form_validation', 'upload', 'pagination', 'Sk_Activity_log', 'Sk_Vendor_context']);
        $this->load->helper(['url', 'form', 'text', 'date']);

        $this->vendor_context = $this->sk_vendor_context;
        $this->activity_log   = $this->sk_activity_log;

        if (get_class($this) !== 'Login' && get_class($this) !== 'Vendor_login') {
            $this->_require_admin();
        }
    }

    protected function _require_admin() {
        if ($this->session->userdata('sk_vendor_login')) {
            $vid = (int)$this->session->userdata('sk_vendor_id');
            if (!$vid) {
                redirect('admin/vendor/login');
            }
            $vendor = $this->Sk_Vendor_model->get_by_id($vid, false);
            if (!$vendor || $vendor['status'] !== 'approved') {
                $this->session->unset_userdata(['sk_vendor_login', 'sk_vendor_id', 'sk_vendor_name', 'sk_vendor_email']);
                redirect('admin/vendor/login');
            }
            $this->admin = [
                'id'         => 0,
                'name'       => $vendor['business_name'] ?: $vendor['owner_name'],
                'owner_name' => $vendor['owner_name'],
                'email'      => $vendor['email'],
                'role'       => 'vendor',
            ];
            return;
        }

        $admin_id = $this->session->userdata('sk_admin_id');
        if (!$admin_id) {
            redirect('admin/login');
        }
        $this->admin = $this->Sk_Admin_model->get_by_id($admin_id);
        if (!$this->admin) {
            $this->session->sess_destroy();
            redirect('admin/login');
        }
    }

    protected function is_super_admin(): bool {
        return $this->vendor_context->is_super_admin();
    }

    protected function current_vendor_id(): ?int {
        return $this->vendor_context->vendor_id();
    }

    /** Vendor ID for writes: scoped vendor or super-admin selection. */
    protected function resolve_vendor_id_for_write(?int $posted = null): ?int {
        if ($this->current_vendor_id()) {
            return $this->current_vendor_id();
        }
        if ($posted) return (int)$posted;
        return null;
    }

    protected function assert_product_vendor_access(?array $product): void {
        if (!$product) show_404();
        $vid = $this->current_vendor_id();
        if ($vid && (int)($product['vendor_id'] ?? 0) !== $vid) {
            show_error('Access denied.', 403);
        }
    }

    protected function render($view, $data = []) {
        $data['admin']           = $this->admin;
        $data['settings']        = $this->Sk_Admin_model->get_settings();
        $data['vendor_context']  = $this->vendor_context;
        $data['vendor_logged_in']= (bool)$this->session->userdata('sk_vendor_login');
        $data['impersonating']   = (bool)$this->session->userdata('sk_vendor_id')
            && (bool)$this->session->userdata('sk_admin_id')
            && !$data['vendor_logged_in'];
        $this->load->view('admin/layout/header', $data);
        $this->load->view('admin/layout/sidebar', $data);
        $this->load->view('admin/' . $view, $data);
        $this->load->view('admin/layout/footer', $data);
    }

    protected function json($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    protected function upload_file($field, $dir = 'products') {
        $path = FCPATH . 'assets/uploads/' . $dir . '/';
        if (!is_dir($path)) mkdir($path, 0755, true);

        $config = [
            'upload_path'   => $path,
            'allowed_types' => 'jpg|jpeg|png|gif|webp',
            'max_size'      => 2048,
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
