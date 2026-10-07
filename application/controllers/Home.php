<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Fallback when Apache rewrite does not send "/" to frontend/index.html.
 * Serves the React SPA shell so public_html root sites (e.g. 2deal.my) work.
 */
class Home extends CI_Controller {

    public function index() {
        $this->load->helper('sk_seo_html');
        sk_seo_html_serve(sk_seo_html_from_home(), 200);
    }
}
