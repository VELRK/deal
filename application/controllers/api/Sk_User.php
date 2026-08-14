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
        if (isset($update['name'])) {
            $update['name'] = trim((string) $update['name']);
            if (mb_strlen($update['name']) > 100) {
                $update['name'] = mb_substr($update['name'], 0, 100);
            }
        }
        if (isset($update['phone']) && trim((string) $update['phone']) !== '') {
            $this->load->helper('sk_isms');
            $normalized = sk_isms_normalize_phone($update['phone'], $this->get_settings());
            if ($normalized === '') {
                return $this->error(sk_isms_phone_error());
            }
            $update['phone'] = $normalized;
        }
        if (!empty($data['password'])) {
            if (strlen($data['password']) < 6) return $this->error('Password must be at least 6 characters.');
            $update['password'] = $data['password'];
        }
        // Email: optional. Empty → keep current or leave null. Non-empty → unique.
        if (array_key_exists('email', $data)) {
            $this->Sk_User_model->ensure_otp_user_schema();
            $current = $this->Sk_User_model->get_by_id($this->user['user_id']);
            $curEmail = strtolower(trim((string) ($current['email'] ?? '')));
            $isPlaceholder = $curEmail === ''
                || strpos($curEmail, 'ph_') === 0
                || strpos($curEmail, '@shopkart.app') !== false
                || strpos($curEmail, '@2deal.app') !== false;
            $newEmail = strtolower(trim((string) $data['email']));
            if ($newEmail === '') {
                if ($isPlaceholder) {
                    $update['email'] = null;
                }
            } else {
                if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
                    return $this->error('Invalid email address.');
                }
                if ($this->Sk_User_model->email_exists($newEmail, (int) $this->user['user_id'])) {
                    return $this->error('This email is already in use.');
                }
                // Allow set/replace when current is empty/placeholder, or same account updating
                if ($isPlaceholder || $curEmail === $newEmail || $curEmail === '') {
                    $update['email'] = $newEmail;
                } elseif ($curEmail !== $newEmail) {
                    // Also allow changing a real email (unique)
                    $update['email'] = $newEmail;
                }
            }
        }
        $this->Sk_User_model->update($this->user['user_id'], $update);
        $user = $this->Sk_User_model->get_by_id($this->user['user_id']);
        unset($user['password'],$user['verify_token'],$user['reset_token'],$user['reset_expires']);
        if (array_key_exists('email', $user) && ($user['email'] === null || $user['email'] === '')) {
            $user['email'] = null;
        }
        $this->success($user, 'Profile updated.');
    }

    public function addresses() {
        $this->auth_required();
        $uid = (int) $this->user['user_id'];
        // New accounts that ordered before address-book save: recover from latest order
        $this->Sk_User_model->backfill_address_from_latest_order($uid);
        $addrs = $this->Sk_User_model->get_addresses($uid);
        $this->success($addrs);
    }

    public function save_address() {
        $this->auth_required();
        $data = $this->body();
        $required = ['full_name', 'phone', 'line1', 'city', 'state', 'pincode'];
        foreach ($required as $f) {
            if (empty($data[$f])) return $this->error("Field '$f' is required.");
        }
        $this->load->helper('sk_isms');
        $normalized = sk_isms_normalize_phone($data['phone'], $this->get_settings());
        if ($normalized === '') {
            return $this->error(sk_isms_phone_error());
        }
        $data['phone'] = $normalized;
        $this->Sk_User_model->ensure_address_schema();
        $data['user_id'] = $this->user['user_id'];
        $data['label']   = $data['label'] ?? 'Home';
        $data['country'] = $data['country'] ?? 'Malaysia';
        $data['company_name'] = trim($data['company_name'] ?? '') ?: null;
        $data['address_type'] = in_array(($data['address_type'] ?? 'shipping'), ['shipping', 'billing'], true)
            ? $data['address_type'] : 'shipping';
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
        $pending = count(array_filter($orders, fn($o) => in_array($o['status'] ?? '', ['pending', 'payment_attempt'], true)));
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
        $this->load->helper('sk_royalty');
        sk_royalty_ensure_schema();
        $this->success($this->Sk_Customer_wallet_model->get_checkout_info($this->user['user_id']));
    }

    public function royalty() {
        $this->auth_required();
        $this->load->helper('sk_royalty');
        sk_royalty_ensure_schema();
        $this->load->model('Sk_Royalty_model');
        $this->success($this->Sk_Royalty_model->get_info($this->user['user_id']));
    }

    public function royalty_transactions() {
        $this->auth_required();
        $this->load->helper('sk_royalty');
        sk_royalty_ensure_schema();
        $this->load->model('Sk_Royalty_model');
        $limit  = min(50, max(1, (int)($this->input->get('limit') ?: 20)));
        $offset = max(0, (int)($this->input->get('offset') ?: 0));
        $result = $this->Sk_Royalty_model->get_transactions($this->user['user_id'], $limit, $offset);
        $rows = sk_attach_api_dates($result['rows']);
        $this->success(['rows' => $rows, 'transactions' => $rows, 'total' => $result['total']]);
    }

    public function wallet_transactions() {
        $this->auth_required();
        $this->load->model('Sk_Customer_wallet_model');
        $limit  = min(50, max(1, (int)($this->input->get('limit') ?: 20)));
        $offset = max(0, (int)($this->input->get('offset') ?: 0));
        $result = $this->Sk_Customer_wallet_model->get_transactions($this->user['user_id'], $limit, $offset);
        $rows = sk_attach_api_dates($result['rows']);
        $this->success(['rows' => $rows, 'transactions' => $rows, 'total' => $result['total']]);
    }

    public function wallet_topup() {
        $this->auth_required();
        $this->load->model('Sk_Customer_wallet_model');
        if (!$this->Sk_Customer_wallet_model->is_enabled()) {
            return $this->error('Wallet is disabled.');
        }
        $data = $this->body();
        $amountRm = (float)($data['amount'] ?? 0);
        if ($amountRm <= 0) return $this->error('Enter a valid amount in RM.');
        if ($amountRm < 100) return $this->error('Minimum top-up is RM 100. Please enter RM 100 or more.');

        $settings = $this->get_settings();
        $ref = $this->Sk_Customer_wallet_model->create_topup_intent($this->user['user_id'], $amountRm);
        if (!$ref) return $this->error('Could not start top-up.');

        $gateway = $this->Sk_Customer_wallet_model->resolve_topup_gateway($settings);
        $points = $this->Sk_Customer_wallet_model->rm_to_points($amountRm);

        if ($gateway === 'razorpay') {
            $pay = $this->Sk_Customer_wallet_model->start_razorpay_topup(
                $this->user['user_id'],
                $amountRm,
                $ref,
                $settings
            );
            if (!empty($pay['error'])) return $this->error($pay['error']);

            return $this->success([
                'gateway'           => 'razorpay',
                'reference'         => $ref,
                'amount_rm'         => $amountRm,
                'points'            => $points,
                'razorpay_order_id' => $pay['razorpay_order_id'],
                'amount'            => $pay['amount'],
                'currency'          => $pay['currency'],
                'key_id'            => $pay['key_id'],
                'prefill'           => $pay['prefill'],
            ], 'Complete payment to add funds to your wallet.');
        }

        if ($gateway === 'toyyibpay') {
            $pay = $this->Sk_Customer_wallet_model->start_toyyibpay_topup($this->user['user_id'], $amountRm, $ref);
            if (!empty($pay['error'])) return $this->error($pay['error']);

            return $this->success([
                'gateway'     => 'toyyibpay',
                'reference'   => $ref,
                'amount_rm'   => $amountRm,
                'points'      => $points,
                'payment_url' => $pay['url'] ?? null,
                'bill_code'   => $pay['bill_code'] ?? null,
            ], 'Redirecting to payment gateway…');
        }

        if ($gateway === 'sandbox') {
            $pay = $this->Sk_Customer_wallet_model->start_toyyibpay_topup($this->user['user_id'], $amountRm, $ref);
            if (!empty($pay['error'])) return $this->error($pay['error']);
            return $this->success([
                'gateway'   => 'sandbox',
                'reference' => $ref,
                'amount_rm' => $amountRm,
                'points'    => $points,
                'credited'  => true,
                'balance'   => $pay['balance'] ?? null,
            ], 'Wallet topped up (dev sandbox — no payment gateway configured).');
        }

        return $this->error('Payment gateway is not configured. Please contact support.', 503);
    }

    /**
     * POST /shopkart-api/user/device-token
     * Body: { token, platform?: android|ios|web }
     */
    public function register_device_token() {
        $this->auth_required();
        $data = $this->body();
        $token = trim((string)($data['token'] ?? ''));
        $platform = strtolower(trim((string)($data['platform'] ?? 'android')));
        if ($token === '') {
            return $this->error('FCM token is required.');
        }
        $this->load->model('Sk_Notification_model');
        $this->Sk_Notification_model->upsert_token((int)$this->user['user_id'], $token, $platform);
        $this->success([
            'token'    => $token,
            'platform' => in_array($platform, ['android', 'ios', 'web'], true) ? $platform : 'android',
        ], 'Device token registered.');
    }

    /**
     * DELETE or POST /shopkart-api/user/device-token/remove
     * Body: { token }
     */
    public function unregister_device_token() {
        $this->auth_required();
        $data = $this->body();
        $token = trim((string)($data['token'] ?? ''));
        if ($token === '') {
            return $this->error('FCM token is required.');
        }
        $this->load->model('Sk_Notification_model');
        $this->Sk_Notification_model->delete_token($token, (int)$this->user['user_id']);
        $this->success([], 'Device token removed.');
    }
}
