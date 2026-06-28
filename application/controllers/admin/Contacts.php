<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Contacts extends Sk_Base {

    public function index() {
        $data['title']    = 'Contact Enquiries';
        $data['contacts'] = $this->db->table_exists('contact_enquiries')
            ? $this->db->order_by('created_at', 'DESC')->get('contact_enquiries')->result_array()
            : [];
        $this->render('contacts/list', $data);
    }

    public function mark_read($id) {
        $this->db->where('id', $id)->update('contact_enquiries', ['status' => 'read']);
        $this->json(['success' => true]);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete('contact_enquiries');
        $this->json(['success' => true]);
    }
}
