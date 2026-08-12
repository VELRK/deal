<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Fallback when Apache rewrite does not send "/" to frontend/index.html.
 * Serves the React SPA shell so public_html root sites (e.g. 2deal.my) work.
 */
class Home extends CI_Controller {

    public function index() {
        $spa = FCPATH . 'frontend' . DIRECTORY_SEPARATOR . 'index.html';
        if (is_file($spa)) {
            header('Content-Type: text/html; charset=UTF-8');
            header('Cache-Control: no-cache, no-store, must-revalidate');
            readfile($spa);
            return;
        }
        show_404();
    }
}
