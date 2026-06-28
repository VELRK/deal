<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Roles extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Role_model');
        $this->vendor_context->require_super_admin();
        $this->Sk_Role_model->seed_permissions();
    }

    public function index() {
        $data['title']       = 'Roles & Permissions';
        $data['roles']       = $this->Sk_Role_model->get_roles();
        $data['permissions'] = $this->Sk_Role_model->get_permissions_grouped();
        $data['admins']      = $this->Sk_Role_model->get_admins();
        $this->render('roles/index', $data);
    }

    public function permissions($role_id) {
        $role_id = (int)$role_id;
        $role = $this->Sk_Role_model->get_role($role_id);
        if (!$role) show_404();

        if ($this->input->method() === 'post') {
            $ids = $this->input->post('permissions') ?: [];
            $this->Sk_Role_model->save_role_permissions($role_id, $ids);
            $this->activity_log->log_admin('roles', 'update_permissions', $role_id, null, ['permissions' => $ids]);
            $this->session->set_flashdata('success', 'Permissions updated for ' . $role['name']);
            redirect('admin/roles');
        }

        $data['title']       = 'Permissions — ' . $role['name'];
        $data['role']        = $role;
        $data['permissions'] = $this->Sk_Role_model->get_permissions_grouped();
        $data['assigned']    = $this->Sk_Role_model->get_role_permission_ids($role_id);
        $this->render('roles/permissions', $data);
    }

    public function assign_admin() {
        $admin_id = (int)$this->input->post('admin_id');
        $role_id  = (int)$this->input->post('role_id') ?: null;
        $vendor_id = (int)$this->input->post('vendor_id') ?: null;

        $this->Sk_Role_model->assign_admin_role($admin_id, $role_id, $vendor_id);
        $this->activity_log->log_admin('roles', 'assign_admin', $admin_id, null, ['role_id' => $role_id, 'vendor_id' => $vendor_id]);
        $this->session->set_flashdata('success', 'Admin role updated.');
        redirect('admin/roles');
    }
}
