<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_User extends Sk_Base_Api {

    public function profile() {
        $this->auth_required();
        $user = $this->Sk_User_model->get_by_id($this->user['user_id']);
        unset($user['password'], $user['verify_token'], $user['reset_token'], $user['reset_expires']);
        $this->success($user);
    }

    public function update_profile() {
        $this->auth_required();
        $data = $this->body();
        $allowed = ['name', 'phone'];
        $update  = [];
        foreach ($allowed as $f) { if (isset($data[$f])) $update[$f] = $data[$f]; }
        if (!empty($data['password'])) {
            if (strlen($data['password']) < 6) return $this->error('Password must be at least 6 characters.');
            $update['password'] = $data['password'];
        }
        // Allow email update only when current email is a placeholder (OTP-only accounts)
        if (!empty($data['email'])) {
            $current = $this->Sk_User_model->get_by_id($this->user['user_id']);
            if (strpos($current['email'], '@shopkart.app') !== false) {
                $newEmail = trim($data['email']);
                if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
                    return $this->error('Invalid email address.');
                }
                if ($this->Sk_User_model->get_by_email($newEmail)) {
                    return $this->error('This email is already in use.');
                }
                $update['email'] = $newEmail;
            }
        }
        $this->Sk_User_model->update($this->user['user_id'], $update);
        $user = $this->Sk_User_model->get_by_id($this->user['user_id']);
        unset($user['password'],$user['verify_token'],$user['reset_token'],$user['reset_expires']);
        $this->success($user, 'Profile updated.');
    }

    public function addresses() {
        $this->auth_required();
        $addrs = $this->Sk_User_model->get_addresses($this->user['user_id']);
        $this->success($addrs);
    }

    public function save_address() {
        $this->auth_required();
        $data = $this->body();
        $required = ['full_name', 'phone', 'line1', 'city', 'state', 'pincode'];
        foreach ($required as $f) {
            if (empty($data[$f])) return $this->error("Field '$f' is required.");
        }
        $data['user_id'] = $this->user['user_id'];
        $data['label']   = $data['label'] ?? 'Home';
        $id = $this->Sk_User_model->save_address($data);
        $addrs = $this->Sk_User_model->get_addresses($this->user['user_id']);
        $this->success(['id' => $id, 'addresses' => $addrs], 'Address saved.');
    }

    public function delete_address($id) {
        $this->auth_required();
        $this->Sk_User_model->delete_address((int)$id, $this->user['user_id']);
        $addrs = $this->Sk_User_model->get_addresses($this->user['user_id']);
        $this->success(['addresses' => $addrs], 'Address deleted.');
    }

    public function wishlist() {
        $this->auth_required();
        $items = $this->Sk_User_model->get_wishlist($this->user['user_id']);
        $this->success($items);
    }

    public function wishlist_toggle() {
        $this->auth_required();
        $data       = $this->body();
        $product_id = (int)($data['product_id'] ?? 0);
        if (!$product_id) return $this->error('product_id required.');
        $action = $this->Sk_User_model->wishlist_toggle($this->user['user_id'], $product_id);
        $this->success(['action' => $action], $action === 'added' ? 'Added to wishlist.' : 'Removed from wishlist.');
    }

    public function dashboard() {
        $this->auth_required();
        $uid    = $this->user['user_id'];
        $orders = $this->Sk_Order_model->get_user_orders($uid, 200, 0);
        $addrs  = $this->Sk_User_model->get_addresses($uid);

        $total   = count($orders);
        $pending = count(array_filter($orders, fn($o) => $o['status'] === 'pending'));
        $delivered = count(array_filter($orders, fn($o) => $o['status'] === 'delivered'));
        $spent   = array_sum(array_column(
            array_filter($orders, fn($o) => in_array($o['payment_status'] ?? '', ['paid','captured'])),
            'total'
        ));

        $recent = array_slice($orders, 0, 5);
        foreach ($recent as &$o) {
            $o['items'] = $this->Sk_Order_model->get_items($o['id']);
        }

        $this->success([
            'stats'         => [
                'total_orders' => $total,
                'pending'      => $pending,
                'delivered'    => $delivered,
                'total_spent'  => round((float)$spent, 2),
                'addresses'    => count($addrs),
            ],
            'recent_orders' => $recent,
        ]);
    }

    public function change_password() {
        $this->auth_required();
        $data    = $this->body();
        $current = $data['current_password'] ?? '';
        $new_pw  = $data['new_password']     ?? '';
        $confirm = $data['confirm_password'] ?? '';

        if (!$current || !$new_pw || !$confirm) return $this->error('All fields are required.');
        if (strlen($new_pw) < 6) return $this->error('New password must be at least 6 characters.');
        if ($new_pw !== $confirm) return $this->error('New passwords do not match.');

        $user = $this->Sk_User_model->get_by_id($this->user['user_id']);
        if (!$this->Sk_User_model->verify_password($current, $user['password'])) {
            return $this->error('Current password is incorrect.', 401);
        }

        $this->Sk_User_model->update($this->user['user_id'], ['password' => $new_pw]);
        $this->success([], 'Password changed successfully.');
    }

    public function newsletter() {
        $data  = $this->body();
        $email = trim($data['email'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) return $this->error('Invalid email.');
        $exists = $this->db->where('email', $email)->count_all_results('newsletter');
        if (!$exists) $this->db->insert('newsletter', ['email' => $email, 'created_at' => date('Y-m-d H:i:s')]);
        $this->success([], 'Subscribed successfully!');
    }

    public function wallet() {
        $this->auth_required();
        $this->load->model('Sk_Customer_wallet_model');
        $this->success($this->Sk_Customer_wallet_model->get_checkout_info($this->user['user_id']));
    }
}
