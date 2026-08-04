<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Notification_model extends CI_Model {

    public function ensure_schema(): void {
        $this->load->helper('sk_fcm');
        sk_fcm_ensure_schema();
    }

    public function list_notifications(int $limit = 25, int $offset = 0, ?string $status = null): array {
        $this->ensure_schema();
        if ($status && in_array($status, ['draft', 'sent', 'failed'], true)) {
            $this->db->where('status', $status);
        }
        $total = (int)$this->db->count_all_results('sk_notifications');

        if ($status && in_array($status, ['draft', 'sent', 'failed'], true)) {
            $this->db->where('status', $status);
        }
        $rows = $this->db->order_by('id', 'DESC')->limit($limit, $offset)->get('sk_notifications')->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    public function get(int $id): ?array {
        $this->ensure_schema();
        $row = $this->db->where('id', $id)->get('sk_notifications')->row_array();
        return $row ?: null;
    }

    public function create(array $data): int {
        $this->ensure_schema();
        $this->db->insert('sk_notifications', $data);
        return (int)$this->db->insert_id();
    }

    public function update_row(int $id, array $data): bool {
        $this->ensure_schema();
        $this->db->where('id', $id)->update('sk_notifications', $data);
        return $this->db->affected_rows() >= 0;
    }

    public function recent_sent(int $limit = 30): array {
        $this->ensure_schema();
        return $this->db->where('status', 'sent')
            ->order_by('sent_at', 'DESC')
            ->limit($limit)
            ->get('sk_notifications')
            ->result_array();
    }

    public function upsert_token(?int $userId, string $token, string $platform = 'android'): bool {
        $this->ensure_schema();
        $token = trim($token);
        if ($token === '') {
            return false;
        }
        $platform = in_array($platform, ['android', 'ios', 'web'], true) ? $platform : 'android';
        $now = date('Y-m-d H:i:s');
        $existing = $this->db->where('token', $token)->get('sk_device_tokens')->row_array();
        if ($existing) {
            $update = [
                'platform'   => $platform,
                'updated_at' => $now,
            ];
            if ($userId) {
                $update['user_id'] = $userId;
            }
            $this->db->where('id', $existing['id'])->update('sk_device_tokens', $update);
            return true;
        }
        $this->db->insert('sk_device_tokens', [
            'user_id'    => $userId,
            'token'      => $token,
            'platform'   => $platform,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        return true;
    }

    public function delete_token(string $token, ?int $userId = null): bool {
        $this->ensure_schema();
        $token = trim($token);
        if ($token === '') {
            return false;
        }
        $this->db->where('token', $token);
        if ($userId) {
            $this->db->group_start()
                ->where('user_id', $userId)
                ->or_where('user_id', null)
                ->group_end();
        }
        $this->db->delete('sk_device_tokens');
        return true;
    }

    /** @return array<int,array{token:string,user_id:?int}> */
    public function tokens_for_audience(string $audience, ?string $audienceValue): array {
        $this->ensure_schema();
        $audience = in_array($audience, ['all', 'user', 'token'], true) ? $audience : 'all';

        if ($audience === 'token') {
            $tok = trim((string)$audienceValue);
            return $tok !== '' ? [['token' => $tok, 'user_id' => null]] : [];
        }

        if ($audience === 'user') {
            $uid = (int)$audienceValue;
            if ($uid < 1) {
                return [];
            }
            $rows = $this->db->where('user_id', $uid)->get('sk_device_tokens')->result_array();
            return array_map(static function ($r) {
                return ['token' => $r['token'], 'user_id' => (int)$r['user_id']];
            }, $rows);
        }

        $rows = $this->db->get('sk_device_tokens')->result_array();
        return array_map(static function ($r) {
            return [
                'token'   => $r['token'],
                'user_id' => isset($r['user_id']) ? (int)$r['user_id'] : null,
            ];
        }, $rows);
    }

    public function token_count(): int {
        $this->ensure_schema();
        return (int)$this->db->count_all('sk_device_tokens');
    }

    public function logs_for(int $notificationId, int $limit = 50): array {
        $this->ensure_schema();
        return $this->db->where('notification_id', $notificationId)
            ->order_by('id', 'DESC')
            ->limit($limit)
            ->get('sk_notification_logs')
            ->result_array();
    }
}
