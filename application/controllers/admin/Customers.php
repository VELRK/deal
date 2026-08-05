<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Customers extends Sk_Base {

    public function index() {
        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 15;
        $offset = ($page - 1) * $limit;
        $search = $this->input->get('search', TRUE);

        $data['title']     = 'Customers - 2DEAL Admin';
        $data['customers'] = $this->Sk_User_model->get_all_admin($limit, $offset, $search);
        $data['total']     = $this->Sk_User_model->count_admin($search);
        $data['page']      = $page;
        $data['limit']     = $limit;
        $data['search']    = $search;
        $this->render('customers/list', $data);
    }

    public function view($id) {
        $data['title']    = 'Customer Detail';
        $data['customer'] = $this->Sk_User_model->get_by_id($id);
        if (!$data['customer']) show_404();
        $data['orders']   = $this->Sk_Order_model->get_user_orders($id);
        $this->render('customers/view', $data);
    }

    public function edit($id) {
        $customer = $this->Sk_User_model->get_by_id($id);
        if (!$customer) show_404();
        $data['title']    = 'Edit Customer';
        $data['customer'] = $customer;
        $this->render('customers/edit', $data);
    }

    public function update($id) {
        $customer = $this->Sk_User_model->get_by_id($id);
        if (!$customer) show_404();

        $name  = trim((string)$this->input->post('name', TRUE));
        $email = trim((string)$this->input->post('email', TRUE));
        $phone = trim((string)$this->input->post('phone', TRUE));
        $status = $this->input->post('status') ? 1 : 0;
        $password = (string)$this->input->post('password', FALSE);

        if ($name === '') {
            $this->session->set_flashdata('error', 'Name is required.');
            redirect('shopkart/customers/edit/' . (int)$id);
            return;
        }
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->session->set_flashdata('error', 'A valid email is required.');
            redirect('shopkart/customers/edit/' . (int)$id);
            return;
        }

        $otherEmail = $this->Sk_User_model->get_by_email($email);
        if ($otherEmail && (int)$otherEmail['id'] !== (int)$id) {
            $this->session->set_flashdata('error', 'This email is already used by another customer.');
            redirect('shopkart/customers/edit/' . (int)$id);
            return;
        }

        if ($phone !== '') {
            $this->load->helper('sk_isms');
            $settings = $this->Sk_Admin_model->get_settings();
            $normalized = sk_isms_normalize_phone($phone, $settings);
            if (!$normalized) {
                $this->session->set_flashdata('error', sk_isms_phone_error());
                redirect('shopkart/customers/edit/' . (int)$id);
                return;
            }
            $phone = $normalized;
            $otherPhone = $this->Sk_User_model->get_by_phone($phone);
            if ($otherPhone && (int)$otherPhone['id'] !== (int)$id) {
                $this->session->set_flashdata('error', 'This phone is already used by another customer.');
                redirect('shopkart/customers/edit/' . (int)$id);
                return;
            }
        } else {
            $phone = null;
        }

        if ($password !== '' && strlen($password) < 6) {
            $this->session->set_flashdata('error', 'Password must be at least 6 characters.');
            redirect('shopkart/customers/edit/' . (int)$id);
            return;
        }

        $update = [
            'name'   => $name,
            'email'  => $email,
            'phone'  => $phone,
            'status' => $status,
        ];
        if ($password !== '') {
            $update['password'] = $password;
        }

        $this->Sk_User_model->update($id, $update);
        $this->session->set_flashdata('success', 'Customer updated successfully.');
        redirect('shopkart/customers/view/' . (int)$id);
    }

    public function toggle($id) {
        $user = $this->Sk_User_model->get_by_id($id);
        $new  = $user['status'] ? 0 : 1;
        $this->Sk_User_model->update($id, ['status' => $new]);
        $this->json(['success' => true, 'status' => $new]);
    }

    public function delete($id) {
        $id = (int)$id;
        $customer = $this->Sk_User_model->get_by_id($id);
        if (!$customer) {
            return $this->json(['success' => false, 'message' => 'Customer not found.'], 404);
        }

        $result = $this->Sk_User_model->hard_delete($id);
        if (!$result['ok']) {
            return $this->json(['success' => false, 'message' => $result['message']]);
        }

        $this->activity_log->log_admin('customers', 'hard_delete', $id, [
            'name'  => $customer['name'],
            'email' => $customer['email'],
        ]);
        $this->json(['success' => true, 'message' => $result['message']]);
    }
}
