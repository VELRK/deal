<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Banner_model extends CI_Model {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function get_all($status = null)
    {
        if ($status !== null) {
            $this->db->where('status', $status);
        }
        $this->db->order_by('created_at', 'DESC');
        return $this->db->get('banners')->result();
    }

    public function get_all_for_admin()
    {
        $this->db->order_by('created_at', 'DESC');
        return $this->db->get('banners')->result();
    }

    public function get_by_id($id)
    {
        return $this->db->get_where('banners', array('id' => $id))->row();
    }

    public function create($data)
    {
        $this->db->insert('banners', $data);
        return $this->db->insert_id();
    }

    public function update($id, $data)
    {
        $this->db->where('id', $id);
        return $this->db->update('banners', $data);
    }

    public function delete($id)
    {
        $this->db->where('id', $id);
        return $this->db->delete('banners');
    }

    public function get_active()
    {
        $this->db->where('status', 'active');
        $this->db->order_by('created_at', 'ASC');
        return $this->db->get('banners')->result();
    }
}

