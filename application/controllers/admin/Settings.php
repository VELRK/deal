<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Settings extends Sk_Base {

    public function index() {
        $this->load->helper('sk_invoice');
        sk_invoice_ensure_vendor_schema();
        $data['title']    = 'Settings - ShopKart Admin';
        $data['settings'] = $this->Sk_Admin_model->get_settings();
        $this->render('settings/index', $data);
    }

    public function update() {
        $fields = [
            'site_name', 'site_email', 'site_phone', 'site_address',
            'currency', 'currency_symbol', 'tax_rate', 'shipping_charge',
            'free_shipping_above', 'razorpay_key_id', 'razorpay_key_secret',
            'razorpay_mode', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass',
            'smtp_from_name', 'meta_title', 'meta_desc', 'meta_keywords', 'seo_og_image',
            'head_scripts', 'footer_scripts', 'google_analytics', 'top_bar_text',
            'whatsapp_number',
            'company_legal_name', 'gstin', 'pan_no', 'state_code', 'invoice_prefix', 'invoice_footer',
        ];

        $data = [];
        foreach ($fields as $f) {
            $val = $this->input->post($f, TRUE);
            if ($val !== null) $data[$f] = $val;
        }
        // Checkbox: absent when unchecked, present with value "1" when checked
        $data['newsletter_popup_enabled'] = $this->input->post('newsletter_popup_enabled') ? '1' : '0';
        $data['top_bar_enabled'] = $this->input->post('top_bar_enabled') ? '1' : '0';
        $data['whatsapp_enabled'] = $this->input->post('whatsapp_enabled') ? '1' : '0';

        // logo upload
        $logo = $this->upload_file('site_logo', 'settings');
        if ($logo) $data['site_logo'] = $logo;

        $og = $this->upload_file('seo_og_image_file', 'seo');
        if ($og) $data['seo_og_image'] = $og;

        $this->Sk_Admin_model->save_settings($data);
        $this->session->set_flashdata('success', 'Settings saved successfully.');
        redirect('admin/settings');
    }
}
