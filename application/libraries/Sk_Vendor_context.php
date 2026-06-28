<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Resolves vendor scope for admin sessions (super admin vs vendor admin).
 */
class Sk_Vendor_context {

    protected $CI;
    protected $vendor_id = null;
    protected $is_super = true;

    public function __construct() {
        $this->CI =& get_instance();
        $this->CI->load->database();
        $this->_resolve();
    }

    protected function _resolve(): void {
        $role = $this->CI->session->userdata('sk_admin_role');
        $session_vendor = $this->CI->session->userdata('sk_vendor_id');

        if ($session_vendor) {
            $this->vendor_id = (int)$session_vendor;
            $this->is_super  = false;
            return;
        }

        if ($role === 'superadmin' || $role === 'admin') {
            $this->is_super = true;
            return;
        }

        $admin_id = $this->CI->session->userdata('sk_admin_id');
        if ($admin_id && $this->CI->db->field_exists('vendor_id', 'admins')) {
            $admin = $this->CI->db->select('vendor_id, role')->where('id', $admin_id)->get('admins')->row_array();
            if (!empty($admin['vendor_id'])) {
                $this->vendor_id = (int)$admin['vendor_id'];
                $this->is_super  = false;
            }
        }
    }

    public function is_super_admin(): bool {
        return $this->is_super && !$this->vendor_id;
    }

    public function vendor_id(): ?int {
        return $this->vendor_id;
    }

    public function require_super_admin(): void {
        if (!$this->is_super_admin()) {
            show_error('Access denied. Super admin only.', 403);
        }
    }

    /** Apply vendor_id filter to query builder when scoped. */
    public function scope_query(string $alias = '', string $column = 'vendor_id'): void {
        if ($this->vendor_id) {
            $field = $alias ? "$alias.$column" : $column;
            $this->CI->db->where($field, $this->vendor_id);
        }
    }

    public function impersonate(int $vendor_id): void {
        $this->CI->session->set_userdata('sk_vendor_id', $vendor_id);
        $this->vendor_id = $vendor_id;
        $this->is_super  = false;
    }

    public function stop_impersonate(): void {
        $this->CI->session->unset_userdata('sk_vendor_id');
        $this->vendor_id = null;
        $this->is_super  = true;
    }
}
