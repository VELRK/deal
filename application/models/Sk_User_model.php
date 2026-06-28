<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_User_model extends CI_Model {

    public function create($data) {
        $data['password']   = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['verify_token'] = bin2hex(random_bytes(32));
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert('users', $data);
        return $this->db->insert_id();
    }

    public function get_by_email($email) {
        return $this->db->where('email', $email)->get('users')->row_array();
    }

    public function get_by_phone($phone) {
        return $this->db->where('phone', $phone)->get('users')->row_array();
    }

    public function get_by_id($id) {
        return $this->db->where('id', $id)->get('users')->row_array();
    }

    public function verify_password($plain, $hash) {
        return password_verify($plain, $hash);
    }

    public function update($id, $data) {
        if (!empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        $this->db->where('id', $id)->update('users', $data);
        return $this->db->affected_rows();
    }

    public function update_last_login($id) {
        $this->db->where('id', $id)->update('users', ['last_login' => date('Y-m-d H:i:s')]);
    }

    /** Generate a 6-digit email verification code (15 min expiry). */
    public function set_reset_code($email) {
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->db->where('email', $email)->update('users', [
            'reset_token'   => $code,
            'reset_expires' => date('Y-m-d H:i:s', strtotime('+15 minutes')),
        ]);
        return $code;
    }

    /** Verify email code and issue a secure reset token (30 min expiry). */
    public function verify_reset_code($email, $code) {
        $user = $this->db->where('email', $email)
            ->where('reset_token', $code)
            ->where('reset_expires >', date('Y-m-d H:i:s'))
            ->get('users')->row_array();
        if (!$user) {
            return null;
        }

        $token = bin2hex(random_bytes(32));
        $this->db->where('id', $user['id'])->update('users', [
            'reset_token'   => $token,
            'reset_expires' => date('Y-m-d H:i:s', strtotime('+30 minutes')),
        ]);
        return $token;
    }

    public function get_by_reset_token($token) {
        return $this->db->where('reset_token', $token)
                        ->where('reset_expires >', date('Y-m-d H:i:s'))
                        ->get('users')->row_array();
    }

    /** Reset password only after email code was verified (secure token). */
    public function reset_password_with_token($email, $token, $password) {
        if (strlen($token) <= 6 || ctype_digit($token)) {
            return false;
        }

        $user = $this->db->where('email', $email)
            ->where('reset_token', $token)
            ->where('reset_expires >', date('Y-m-d H:i:s'))
            ->get('users')->row_array();
        if (!$user) {
            return false;
        }

        $this->reset_password($user['id'], $password);
        return true;
    }

    public function reset_password($id, $password) {
        $this->db->where('id', $id)->update('users', [
            'password'      => password_hash($password, PASSWORD_BCRYPT),
            'reset_token'   => null,
            'reset_expires' => null,
        ]);
    }

    // Addresses
    public function get_addresses($user_id) {
        return $this->db->where('user_id', $user_id)->get('addresses')->result_array();
    }

    public function get_address($id, $user_id) {
        return $this->db->where(['id' => $id, 'user_id' => $user_id])->get('addresses')->row_array();
    }

    public function save_address($data) {
        if (!empty($data['is_default'])) {
            $this->db->where('user_id', $data['user_id'])->update('addresses', ['is_default' => 0]);
        }
        if (!empty($data['id'])) {
            $id = $data['id'];
            unset($data['id']);
            $this->db->where(['id' => $id, 'user_id' => $data['user_id']])->update('addresses', $data);
            return $id;
        }
        $this->db->insert('addresses', $data);
        return $this->db->insert_id();
    }

    public function delete_address($id, $user_id) {
        return $this->db->where(['id' => $id, 'user_id' => $user_id])->delete('addresses');
    }

    // Wishlist
    public function get_wishlist($user_id) {
        return $this->db->select('w.*, p.name, p.price, p.sale_price, p.thumbnail, p.slug')
                        ->from('wishlist w')
                        ->join('products p', 'p.id = w.product_id')
                        ->where('w.user_id', $user_id)
                        ->get()->result_array();
    }

    public function wishlist_toggle($user_id, $product_id) {
        $exists = $this->db->where(['user_id' => $user_id, 'product_id' => $product_id])
                           ->count_all_results('wishlist');
        if ($exists) {
            $this->db->where(['user_id' => $user_id, 'product_id' => $product_id])->delete('wishlist');
            return 'removed';
        } else {
            $this->db->insert('wishlist', ['user_id' => $user_id, 'product_id' => $product_id, 'created_at' => date('Y-m-d H:i:s')]);
            return 'added';
        }
    }

    // Admin
    public function get_all_admin($limit, $offset, $search = '') {
        if ($search) {
            $this->db->group_start()->like('name', $search)->or_like('email', $search)->group_end();
        }
        return $this->db->order_by('created_at', 'DESC')->limit($limit, $offset)->get('users')->result_array();
    }

    public function count_admin($search = '') {
        if ($search) {
            $this->db->group_start()->like('name', $search)->or_like('email', $search)->group_end();
        }
        return $this->db->count_all_results('users');
    }

    public function total_users()     { return $this->db->count_all('users'); }
    public function new_users_today() {
        return $this->db->where('DATE(created_at) = CURDATE()', null, false)->count_all_results('users');
    }
}
