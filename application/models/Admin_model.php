<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_model extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function login($username, $password)
    {
        $this->db->where('username', $username);
        $admin = $this->db->get('admin')->row();
        
        if ($admin && $password === $admin->password) {
            return $admin;
        }
        return false;
    }

    public function get_by_id($id)
    {
        return $this->db->get_where('admin', array('id' => $id))->row();
    }

    public function update_password($id, $password)
    {
        $this->db->where('id', $id);
        return $this->db->update('admin', array('password' => $password));
    }
}

