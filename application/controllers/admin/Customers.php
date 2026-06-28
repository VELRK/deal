<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Customers extends Sk_Base {

    public function index() {
        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 15;
        $offset = ($page - 1) * $limit;
        $search = $this->input->get('search', TRUE);

        $data['title']     = 'Customers - ShopKart Admin';
        $data['customers'] = $this->Sk_User_model->get_all_admin($limit, $offset, $search);
        $data['total']     = $this->Sk_User_model->count_admin($search);
        $data['page']      = $page;
        $data['limit']     = $limit;
        $data['search']    = $search;
        $this->render('customers/list', $data);
    }

    public function view($id) {
        $data['title']    = 'Customer Detail';
        $data['customer'] = $this->Sk_User_model->get_by_id($id);
        if (!$data['customer']) show_404();
        $data['orders']   = $this->Sk_Order_model->get_user_orders($id);
        $this->render('customers/view', $data);
    }

    public function toggle($id) {
        $user = $this->Sk_User_model->get_by_id($id);
        $new  = $user['status'] ? 0 : 1;
        $this->Sk_User_model->update($id, ['status' => $new]);
        $this->json(['success' => true, 'status' => $new]);
    }
}
