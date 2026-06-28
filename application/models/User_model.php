<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model
{
    protected $table = 'users';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function create($data)
    {
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function findByEmail($email)
    {
        return $this->db->where('email', $email)->get($this->table)->row_array();
    }

    public function findById($id)
    {
        return $this->db->where('id', (int) $id)->get($this->table)->row_array();
    }

    public function updateById($id, array $data)
    {
        return $this->db->where('id', (int) $id)->update($this->table, $data);
    }

    public function get_by_id($id)
    {
        return $this->db->get_where($this->table, array('id' => $id))->row();
    }

    public function get_by_phone($phone, $country_code = '+91')
    {
        return $this->db->get_where($this->table, array('phone' => $phone, 'country_code' => $country_code))->row();
    }

    public function update($id, $data)
    {
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function is_phone_exists($phone, $country_code = '+91')
    {
        $this->db->where('phone', $phone)->where('country_code', $country_code);
        return $this->db->count_all_results($this->table) > 0;
    }
}

