<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Contact extends Sk_Base_Api {

    public function store() {
        $data = $this->body();

        $name    = trim($data['name']    ?? '');
        $email   = trim($data['email']   ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name)                        return $this->error('Name is required.');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) return $this->error('A valid email is required.');
        if (!$message)                     return $this->error('Message is required.');

        if ($this->db->table_exists('contact_enquiries')) {
            $this->db->insert('contact_enquiries', [
                'name'       => $name,
                'email'      => $email,
                'message'    => $message,
                'created_at' => date('Y-m-d H:i:s'),
                'status'     => 'new',
            ]);
        }

        $this->success([], 'Thank you! We will get back to you shortly.');
    }
}
