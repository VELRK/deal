<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Seo extends Sk_Base_Api {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Seo_model');
    }

    /** GET /seo/page/{key} or /seo?path=/about */
    public function page($key = null) {
        $globals = $this->Sk_Seo_model->get_global_seo();
        $path    = $this->input->get('path', TRUE);

        if ($key) {
            $row = $this->Sk_Seo_model->get_page_by_key($key);
        } elseif ($path) {
            $row = $this->Sk_Seo_model->get_page_by_route($path);
        } else {
            return $this->error('page key or path required', 400);
        }

        if (!$row) {
            return $this->success([
                'meta_title'       => $globals['meta_title'],
                'meta_description' => $globals['meta_description'],
                'meta_keywords'    => $globals['meta_keywords'],
                'og_image'         => $globals['og_image'],
                'head_scripts'     => $globals['head_scripts'],
                'footer_scripts'   => $globals['footer_scripts'],
            ]);
        }

        $formatted = $this->Sk_Seo_model->format_page($row, $globals);
        $formatted['head_scripts']   = $formatted['head_scripts'] ?: $globals['head_scripts'];
        $formatted['footer_scripts'] = $formatted['footer_scripts'] ?: $globals['footer_scripts'];

        $this->success($formatted);
    }

    public function global_config() {
        $cached = $this->get_cache('seo_global', 300);
        if ($cached !== null) return $this->success($cached);

        $data = $this->Sk_Seo_model->get_global_seo();
        $this->set_cache('seo_global', $data);
        $this->success($data);
    }
}
