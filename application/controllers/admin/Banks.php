<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Banks extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Bank_model');
    }

    public function index() {
        $data['title'] = 'Banks';
        $data['banks'] = $this->Sk_Bank_model->get_all(false);
        $this->render('banks/list', $data);
    }

    public function store() {
        $name = trim($this->input->post('name', TRUE));
        if ($name === '') {
            return $this->json(['success' => false, 'message' => 'Bank name required']);
        }
        $id = $this->Sk_Bank_model->create([
            'name'       => $name,
            'code'       => $this->input->post('code', TRUE),
            'status'     => 1,
            'sort_order' => (int)$this->input->post('sort_order'),
        ]);
        $this->json(['success' => true, 'id' => $id, 'name' => $name]);
    }

    public function edit($id) {
        $bank = $this->Sk_Bank_model->get_by_id((int)$id);
        if (!$bank) {
            return $this->json(['success' => false]);
        }
        $this->json(['success' => true, 'data' => $bank]);
    }

    public function update($id) {
        $name = trim($this->input->post('name', TRUE));
        if ($name === '') {
            return $this->json(['success' => false, 'message' => 'Bank name required']);
        }
        $this->Sk_Bank_model->update_bank((int)$id, [
            'name'       => $name,
            'code'       => $this->input->post('code', TRUE),
            'status'     => (int)$this->input->post('status'),
            'sort_order' => (int)$this->input->post('sort_order'),
        ]);
        $this->json(['success' => true]);
    }

    public function delete($id) {
        $this->Sk_Bank_model->delete((int)$id);
        $this->json(['success' => true]);
    }
}
