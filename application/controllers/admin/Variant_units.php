<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Variant_units extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Variant_unit_model');
    }

    public function index() {
        $data['title'] = 'Variant Units';
        $data['units'] = $this->Sk_Variant_unit_model->get_all();
        $this->render('variant_units/list', $data);
    }

    public function store() {
        $name = trim($this->input->post('name', TRUE));
        if ($name === '') return $this->json(['success' => false, 'message' => 'Name required']);

        $symbol = trim($this->input->post('symbol', TRUE));
        $unit_type = $this->input->post('unit_type', TRUE) ?: 'count';

        $this->Sk_Variant_unit_model->create([
            'name'       => $name,
            'slug'       => $this->Sk_Variant_unit_model->make_unique_slug($name),
            'symbol'     => $symbol ?: $name,
            'unit_type'  => in_array($unit_type, ['weight','volume','count','length'], true) ? $unit_type : 'count',
            'sort_order' => (int)($this->input->post('sort_order') ?: 0),
            'status'     => 1,
        ]);
        $this->json(['success' => true]);
    }

    public function edit($id) {
        $unit = $this->Sk_Variant_unit_model->get_by_id($id);
        if (!$unit) return $this->json(['success' => false]);
        $this->json(['success' => true, 'data' => $unit]);
    }

    public function update($id) {
        $name = trim($this->input->post('name', TRUE));
        if ($name === '') return $this->json(['success' => false, 'message' => 'Name required']);

        $symbol = trim($this->input->post('symbol', TRUE));
        $unit_type = $this->input->post('unit_type', TRUE) ?: 'count';

        $this->Sk_Variant_unit_model->update((int)$id, [
            'name'       => $name,
            'slug'       => $this->Sk_Variant_unit_model->make_unique_slug($name, (int)$id),
            'symbol'     => $symbol ?: $name,
            'unit_type'  => in_array($unit_type, ['weight','volume','count','length'], true) ? $unit_type : 'count',
            'sort_order' => (int)($this->input->post('sort_order') ?: 0),
            'status'     => (int)$this->input->post('status'),
        ]);
        $this->json(['success' => true]);
    }

    public function delete($id) {
        if (!$this->Sk_Variant_unit_model->delete((int)$id)) {
            return $this->json(['success' => false, 'message' => 'Unit is used by product variants.']);
        }
        $this->json(['success' => true]);
    }
}
