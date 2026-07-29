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
        $email = strtolower(trim((string) $email));
        if ($email === '') {
            return null;
        }
        return $this->db->where('email', $email)->get('users')->row_array();
    }

    public function get_by_phone($phone) {
        $phone = trim((string) $phone);
        if ($phone === '') {
            return null;
        }
        $row = $this->db->where('phone', $phone)->get('users')->row_array();
        if ($row) {
            return $row;
        }
        // Match common MY variants (60… / 0… / +60…)
        $digits = preg_replace('/\D+/', '', $phone);
        if ($digits === '') {
            return null;
        }
        $variants = array_values(array_unique(array_filter([
            $digits,
            '+' . $digits,
            (strpos($digits, '60') === 0 && strlen($digits) > 2) ? ('0' . substr($digits, 2)) : null,
            (strpos($digits, '0') === 0) ? ('60' . substr($digits, 1)) : null,
        ])));
        if (!$variants) {
            return null;
        }
        return $this->db->where_in('phone', $variants)->get('users')->row_array();
    }

    public function email_exists($email, $exclude_id = null): bool {
        $email = strtolower(trim((string) $email));
        if ($email === '') {
            return false;
        }
        if ($exclude_id) {
            $this->db->where('id !=', (int) $exclude_id);
        }
        return (int) $this->db->where('email', $email)->count_all_results('users') > 0;
    }

    public function phone_exists($phone, $exclude_id = null): bool {
        $user = $this->get_by_phone($phone);
        if (!$user) {
            return false;
        }
        if ($exclude_id && (int) $user['id'] === (int) $exclude_id) {
            return false;
        }
        return true;
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

    public function ensure_deleted_at_column(): void {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;
        if ($this->db->field_exists('deleted_at', 'users')) {
            return;
        }
        $this->db->query('ALTER TABLE `users` ADD COLUMN `deleted_at` DATETIME NULL DEFAULT NULL AFTER `status`');
    }

    /** Soft-delete account so email/phone can be reused. */
    public function soft_delete($id): bool {
        $this->ensure_deleted_at_column();
        $id = (int)$id;
        $user = $this->get_by_id($id);
        if (!$user) {
            return false;
        }
        $stamp = date('YmdHis');
        $data = [
            'status'        => 0,
            'deleted_at'    => date('Y-m-d H:i:s'),
            'email'         => 'deleted_' . $id . '_' . $stamp . '@deleted.local',
            'phone'         => 'del' . $id . $stamp,
            'reset_token'   => null,
            'reset_expires' => null,
            'password'      => password_hash(bin2hex(random_bytes(16)), PASSWORD_BCRYPT),
        ];
        $this->db->where('id', $id)->update('users', $data);
        return true;
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
    public function ensure_address_schema(): void {
        static $done = false;
        if ($done) return;
        $done = true;
        if (!$this->db->field_exists('company_name', 'addresses')) {
            $this->db->query("ALTER TABLE `addresses` ADD COLUMN `company_name` VARCHAR(150) NULL DEFAULT NULL AFTER `full_name`");
        }
        if (!$this->db->field_exists('address_type', 'addresses')) {
            $this->db->query("ALTER TABLE `addresses` ADD COLUMN `address_type` VARCHAR(20) NOT NULL DEFAULT 'shipping' AFTER `label`");
        }
    }

    public function get_addresses($user_id) {
        $this->ensure_address_schema();
        return $this->db->where('user_id', $user_id)->order_by('is_default', 'DESC')->order_by('id', 'DESC')->get('addresses')->result_array();
    }

    public function get_address($id, $user_id) {
        $this->ensure_address_schema();
        return $this->db->where(['id' => $id, 'user_id' => $user_id])->get('addresses')->row_array();
    }

    public function save_address($data) {
        $this->ensure_address_schema();
        $id = !empty($data['id']) ? (int)$data['id'] : 0;
        $allowed = ['user_id','full_name','company_name','phone','line1','line2','city','state','pincode','country','label','is_default','address_type'];
        $row = array_intersect_key($data, array_flip($allowed));
        $row['address_type'] = in_array(($row['address_type'] ?? 'shipping'), ['shipping', 'billing'], true)
            ? $row['address_type'] : 'shipping';
        if (!empty($row['is_default'])) {
            $this->db->where('user_id', $row['user_id'])
                     ->where('address_type', $row['address_type'])
                     ->update('addresses', ['is_default' => 0]);
        }
        if ($id) {
            $this->db->where(['id' => $id, 'user_id' => $row['user_id']])->update('addresses', $row);
            return $id;
        }
        $this->db->insert('addresses', $row);
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
