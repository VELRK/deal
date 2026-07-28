<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Api_explorer extends Sk_Base {

    public function index() {
        $this->config->load('sk_mobile_api_docs', TRUE);
        $catalog = $this->config->item('catalog', 'sk_mobile_api_docs');
        $groups  = $this->config->item('groups', 'sk_mobile_api_docs');
        $guide   = $this->config->item('guide', 'sk_mobile_api_docs');

        $data['title']    = 'Mobile API Explorer';
        $data['catalog']  = $catalog ?: [];
        $data['groups']   = $groups ?: [];
        $data['guide']    = $guide ?: [];
        $data['api_base'] = rtrim(site_url('shopkart-api'), '/') . '/';
        $this->render('api_explorer/index', $data);
    }
}
