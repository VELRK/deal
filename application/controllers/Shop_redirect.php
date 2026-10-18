<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 301 old /shop-default?category_id=|&subcategory_id= URLs to pretty paths.
 * Unfiltered /shop-default still serves the SPA.
 */
class Shop_redirect extends CI_Controller {

    public function index() {
        $this->load->model('Sk_Url_Redirect_model');
        $catId = (int)$this->input->get('category_id');
        $subId = (int)$this->input->get('subcategory_id');

        if ($subId > 0) {
            $sub = $this->db->where('id', $subId)->where('status', 1)->get('subcategories')->row_array();
            if ($sub && !empty($sub['slug'])) {
                $cat = $this->db->where('id', (int)$sub['category_id'])->where('status', 1)->get('categories')->row_array();
                if ($cat && !empty($cat['slug'])) {
                    return $this->redirect_permanent(
                        $this->Sk_Url_Redirect_model->subcategory_path($cat['slug'], $sub['slug'])
                    );
                }
            }
        }

        if ($catId > 0) {
            $cat = $this->db->where('id', $catId)->where('status', 1)->get('categories')->row_array();
            if ($cat && !empty($cat['slug'])) {
                return $this->redirect_permanent(
                    $this->Sk_Url_Redirect_model->collection_path($cat['slug'])
                );
            }
        }

        // No filter ids — serve SPA shop page
        $this->load->helper('sk_seo_html');
        sk_seo_html_serve([
            'title' => 'Shop | 2Deal',
            'robots' => 'index,follow',
        ], 200);
    }

    protected function redirect_permanent(string $to_path) {
        $to_path = $this->Sk_Url_Redirect_model->normalize_path($to_path);
        $target = rtrim(base_url(), '/') . $to_path;
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Location: ' . $target, true, 301);
        exit;
    }
}
