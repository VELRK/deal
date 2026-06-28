<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Store_model extends CI_Model {

    protected $table = 'vendor_stores';

    public function get_by_vendor(int $vendor_id): ?array {
        $store = $this->db->where('vendor_id', $vendor_id)->get($this->table)->row_array();
        return $store ? $this->decode_json_fields($store) : null;
    }

    public function update_store(int $vendor_id, array $data): bool {
        foreach (['delivery_settings', 'store_timings', 'holiday_settings', 'social_links'] as $jsonField) {
            if (isset($data[$jsonField]) && is_array($data[$jsonField])) {
                $data[$jsonField] = json_encode($data[$jsonField]);
            }
        }
        $data['updated_at'] = date('Y-m-d H:i:s');

        $exists = $this->db->where('vendor_id', $vendor_id)->count_all_results($this->table);
        if ($exists) {
            return (bool)$this->db->where('vendor_id', $vendor_id)->update($this->table, $data);
        }
        $data['vendor_id'] = $vendor_id;
        return (bool)$this->db->insert($this->table, $data);
    }

    public function decode_json_fields(array $store): array {
        foreach (['delivery_settings', 'store_timings', 'holiday_settings', 'social_links'] as $field) {
            if (!empty($store[$field]) && is_string($store[$field])) {
                $decoded = json_decode($store[$field], true);
                $store[$field] = is_array($decoded) ? $decoded : [];
            } elseif (empty($store[$field])) {
                $store[$field] = [];
            }
        }
        return $store;
    }

    public function default_timings(): array {
        $days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
        $timings = [];
        foreach ($days as $day) {
            $timings[$day] = ['open' => '09:00', 'close' => '18:00', 'closed' => ($day === 'sunday')];
        }
        return $timings;
    }
}
