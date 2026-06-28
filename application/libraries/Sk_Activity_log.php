<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Central activity logger for admin, vendor, and API actions.
 */
class Sk_Activity_log {

    protected $CI;

    public function __construct() {
        $this->CI =& get_instance();
        $this->CI->load->database();
    }

    public function log(array $data): ?int {
        $payload = [
            'user_id'         => $data['user_id'] ?? null,
            'user_type'       => $data['user_type'] ?? 'admin',
            'role'            => $data['role'] ?? null,
            'vendor_id'       => $data['vendor_id'] ?? null,
            'module'          => $data['module'] ?? 'system',
            'record_id'       => $data['record_id'] ?? null,
            'action'          => $data['action'] ?? 'unknown',
            'old_value'       => isset($data['old_value']) ? json_encode($data['old_value']) : null,
            'new_value'       => isset($data['new_value']) ? json_encode($data['new_value']) : null,
            'ip_address'      => $data['ip_address'] ?? $this->CI->input->ip_address(),
            'user_agent'      => $data['user_agent'] ?? substr($this->CI->input->user_agent() ?: '', 0, 500),
            'device'          => $data['device'] ?? $this->_detect_device(),
            'request_url'     => $data['request_url'] ?? current_url(),
            'http_method'     => $data['http_method'] ?? $this->CI->input->method(TRUE),
            'response_status' => $data['response_status'] ?? null,
            'created_at'      => date('Y-m-d H:i:s'),
        ];

        if (!$this->CI->db->table_exists('activity_logs')) {
            return null;
        }

        $this->CI->db->insert('activity_logs', $payload);
        return (int)$this->CI->db->insert_id();
    }

    public function log_admin(string $module, string $action, ?int $record_id = null, $old = null, $new = null, ?int $vendor_id = null): ?int {
        $admin_id = $this->CI->session->userdata('sk_admin_id');
        return $this->log([
            'user_id'   => $admin_id,
            'user_type' => 'admin',
            'role'      => $this->CI->session->userdata('sk_admin_role'),
            'vendor_id' => $vendor_id ?? $this->CI->session->userdata('sk_vendor_id'),
            'module'    => $module,
            'record_id' => $record_id,
            'action'    => $action,
            'old_value' => $old,
            'new_value' => $new,
        ]);
    }

    protected function _detect_device(): string {
        $ua = strtolower($this->CI->input->user_agent() ?: '');
        if (strpos($ua, 'mobile') !== false) return 'mobile';
        if (strpos($ua, 'tablet') !== false) return 'tablet';
        return 'desktop';
    }
}
