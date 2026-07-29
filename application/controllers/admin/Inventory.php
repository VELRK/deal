<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Inventory extends Sk_Base {

    public function index() {
        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 20;
        $offset = ($page - 1) * $limit;
        $vendor_id = $this->current_vendor_id() ?: ((int)$this->input->get('vendor_id') ?: null);

        $filters = [
            'search'   => $this->input->get('search', TRUE),
            'low_only' => $this->input->get('low_only') === '1',
            'vendor_id'=> $vendor_id,
        ];

        $result = $this->Sk_Product_model->get_inventory_list($filters, $limit, $offset);

        $data['title']    = 'Inventory';
        $data['rows']     = $result['rows'];
        $data['total']    = $result['total'];
        $data['page']     = $page;
        $data['limit']    = $limit;
        $data['filters']  = $filters;
        $data['vendor_id']= $vendor_id;
        if ($this->is_super_admin()) {
            $data['vendors'] = $this->Sk_Vendor_model->get_all(['status' => 'approved'], 200, 0)['rows'];
        }
        $this->render('inventory/index', $data);
    }

    public function view($id) {
        $id = (int)$id;
        $product = $this->Sk_Product_model->get_by_id($id);
        if (!$product) {
            show_404();
        }
        $this->assert_product_vendor_access($product);

        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 20;
        $offset = ($page - 1) * $limit;
        $orders = $this->Sk_Order_model->get_orders_for_product($id, $limit, $offset);

        $data['title']       = 'Inventory — ' . ($product['name'] ?? '');
        $data['product']     = $product;
        $data['order_rows']  = $orders['rows'];
        $data['order_total'] = $orders['total'];
        $data['page']        = $page;
        $data['limit']       = $limit;
        $this->render('inventory/view', $data);
    }
}
