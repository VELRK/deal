<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Variant_unit extends Sk_Base_Api {

    public function index() {
        $this->load->model('Sk_Variant_unit_model');
        $units = $this->Sk_Variant_unit_model->get_all_active();
        $this->success($units);
    }
}
