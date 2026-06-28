<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Seo extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Seo_model');
    }

    public function index() {
        if (!$this->Sk_Seo_model->table_exists()) {
            $this->session->set_flashdata('error', 'Run SEO migration first: database/run_seo_migration.php');
        }

        $data['title']    = 'SEO Manager';
        $data['pages']    = $this->Sk_Seo_model->get_all_pages();
        $data['globals']  = $this->Sk_Seo_model->get_global_seo();
        $data['audit']    = $this->Sk_Seo_model->audit_summary();
        $data['products'] = $this->db->select('id, name, slug, meta_title, meta_desc')
            ->where('status', 'active')->order_by('name')->limit(50)->get('products')->result_array();
        $data['blogs']    = $this->db->table_exists('blogs')
            ? $this->db->select('id, title, slug, meta_title, meta_desc')->where('status', 1)->order_by('created_at', 'DESC')->limit(50)->get('blogs')->result_array()
            : [];

        $this->render('seo/index', $data);
    }

    public function edit_page($id) {
        $page = $this->Sk_Seo_model->get_page_by_id((int)$id);
        if (!$page) show_404();

        $data['title'] = 'Edit SEO — ' . $page['page_label'];
        $data['page']  = $page;
        $this->render('seo/edit_page', $data);
    }

    public function update_page($id) {
        $page = $this->Sk_Seo_model->get_page_by_id((int)$id);
        if (!$page) show_404();

        $data = [
            'meta_title'       => $this->input->post('meta_title', TRUE),
            'meta_description' => $this->input->post('meta_description'),
            'meta_keywords'    => $this->input->post('meta_keywords', TRUE),
            'og_title'         => $this->input->post('og_title', TRUE),
            'og_description'   => $this->input->post('og_description'),
            'og_image'         => $this->input->post('og_image', TRUE),
            'canonical_url'    => $this->input->post('canonical_url', TRUE),
            'robots'           => $this->input->post('robots', TRUE) ?: 'index,follow',
            'head_scripts'     => $this->input->post('head_scripts'),
            'footer_scripts'   => $this->input->post('footer_scripts'),
        ];

        $upload = $this->upload_file('og_image_file', 'seo');
        if ($upload) $data['og_image'] = $upload;

        $this->Sk_Seo_model->save_page((int)$id, $data);
        $this->activity_log->log_admin('seo', 'update_page', (int)$id, $page, $data);
        $this->session->set_flashdata('success', 'Page SEO saved.');
        redirect('admin/seo/edit_page/' . $id);
    }

    public function update_global() {
        $fields = [
            'meta_title', 'meta_desc', 'meta_keywords', 'seo_og_image',
            'head_scripts', 'footer_scripts', 'google_analytics',
        ];
        $data = [];
        foreach ($fields as $f) {
            $val = $this->input->post($f);
            if ($val !== null) $data[$f] = $val;
        }
        $upload = $this->upload_file('seo_og_image_file', 'seo');
        if ($upload) $data['seo_og_image'] = $upload;

        $this->Sk_Admin_model->save_settings($data);
        $this->activity_log->log_admin('seo', 'update_global', null, null, array_keys($data));
        $this->session->set_flashdata('success', 'Global SEO settings saved.');
        redirect('admin/seo');
    }
}
