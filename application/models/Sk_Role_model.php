<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Role_model extends CI_Model {

    public function seed_permissions(): void {
        if ($this->db->count_all('permissions') > 0) return;

        $modules = [
            'dashboard' => ['view'],
            'vendors'   => ['view', 'create', 'edit', 'delete', 'approve'],
            'stores'    => ['view', 'edit'],
            'products'  => ['view', 'create', 'edit', 'delete'],
            'orders'    => ['view', 'edit'],
            'wallet'    => ['view', 'credit', 'debit'],
            'roles'     => ['view', 'edit'],
            'settings'  => ['view', 'edit'],
            'seo'       => ['view', 'edit'],
            'blogs'     => ['view', 'create', 'edit', 'delete'],
        ];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $this->db->insert('permissions', [
                    'module'      => $module,
                    'action'      => $action,
                    'slug'        => $module . '.' . $action,
                    'description' => ucfirst($action) . ' ' . $module,
                ]);
            }
        }

        $role = $this->db->where('slug', 'superadmin')->get('roles')->row_array();
        if ($role) {
            $perms = $this->db->get('permissions')->result_array();
            foreach ($perms as $p) {
                $exists = $this->db->where('role_id', $role['id'])->where('permission_id', $p['id'])->count_all_results('role_permissions');
                if (!$exists) {
                    $this->db->insert('role_permissions', ['role_id' => $role['id'], 'permission_id' => $p['id']]);
                }
            }
        }
    }

    public function get_roles(): array {
        return $this->db->where('deleted_at IS NULL', null, false)
                        ->order_by('name')
                        ->get('roles')
                        ->result_array();
    }

    public function get_role(int $id): ?array {
        return $this->db->where('id', $id)->get('roles')->row_array() ?: null;
    }

    public function get_permissions(): array {
        return $this->db->order_by('module, action')->get('permissions')->result_array();
    }

    public function get_permissions_grouped(): array {
        $grouped = [];
        foreach ($this->get_permissions() as $p) {
            $grouped[$p['module']][] = $p;
        }
        return $grouped;
    }

    public function get_role_permission_ids(int $role_id): array {
        $rows = $this->db->select('permission_id')->where('role_id', $role_id)->get('role_permissions')->result_array();
        return array_map('intval', array_column($rows, 'permission_id'));
    }

    public function save_role_permissions(int $role_id, array $permission_ids): void {
        $this->db->where('role_id', $role_id)->delete('role_permissions');
        foreach ($permission_ids as $pid) {
            $pid = (int)$pid;
            if ($pid > 0) {
                $this->db->insert('role_permissions', ['role_id' => $role_id, 'permission_id' => $pid]);
            }
        }
    }

    public function save_role(array $data, ?int $id = null): int {
        if ($id) {
            unset($data['id']);
            $this->db->where('id', $id)->update('roles', $data);
            return $id;
        }
        if (empty($data['uuid'])) {
            $data['uuid'] = $this->_uuid();
        }
        $this->db->insert('roles', $data);
        return (int)$this->db->insert_id();
    }

    public function get_admins(): array {
        return $this->db->select('a.*, r.name as role_name')
                         ->from('admins a')
                         ->join('roles r', 'r.id = a.role_id', 'left')
                         ->where('a.deleted_at IS NULL', null, false)
                         ->order_by('a.name')
                         ->get()->result_array();
    }

    public function assign_admin_role(int $admin_id, ?int $role_id, ?int $vendor_id = null): bool {
        $data = ['role_id' => $role_id ?: null, 'vendor_id' => $vendor_id ?: null];
        if ($role_id) {
            $role = $this->get_role($role_id);
            if ($role && $role['slug'] === 'vendor') {
                // vendor role requires vendor_id
            } elseif ($role && in_array($role['slug'], ['superadmin', 'admin', 'staff'])) {
                $data['vendor_id'] = null;
            }
        }
        return (bool)$this->db->where('id', $admin_id)->update('admins', $data);
    }

    protected function _uuid(): string {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s-%s-%s-%s-%s', str_split(bin2hex($data), 4));
    }
}
