<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Bank master for payout dropdowns (affiliates, etc.).
 */
class Sk_Bank_model extends CI_Model {

    protected $table = 'banks';

    public function __construct() {
        parent::__construct();
        $this->ensure_schema();
    }

    public function ensure_schema(): void {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;

        if (!$this->db->table_exists($this->table)) {
            $this->db->query("CREATE TABLE `{$this->table}` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `name` varchar(120) NOT NULL,
              `code` varchar(32) DEFAULT NULL,
              `status` tinyint(1) NOT NULL DEFAULT 1,
              `sort_order` int(11) NOT NULL DEFAULT 0,
              `created_at` datetime DEFAULT NULL,
              `updated_at` datetime DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `status` (`status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        }

        if ((int)$this->db->count_all($this->table) === 0) {
            $now = date('Y-m-d H:i:s');
            $seeds = [
                ['Maybank', 'MBB'],
                ['CIMB Bank', 'CIMB'],
                ['Public Bank', 'PBB'],
                ['RHB Bank', 'RHB'],
                ['Hong Leong Bank', 'HLB'],
                ['AmBank', 'AMB'],
                ['Bank Islam', 'BIMB'],
                ['Bank Rakyat', 'BKRM'],
                ['Alliance Bank', 'ABMB'],
                ['OCBC Bank', 'OCBC'],
                ['UOB Malaysia', 'UOB'],
                ['HSBC Bank Malaysia', 'HSBC'],
                ['Standard Chartered', 'SCB'],
                ['Affin Bank', 'AFFIN'],
            ];
            $i = 0;
            foreach ($seeds as $row) {
                $this->db->insert($this->table, [
                    'name'       => $row[0],
                    'code'       => $row[1],
                    'status'     => 1,
                    'sort_order' => $i++,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function get_all(bool $activeOnly = false): array {
        if ($activeOnly) {
            $this->db->where('status', 1);
        }
        return $this->db->order_by('sort_order', 'ASC')->order_by('name', 'ASC')->get($this->table)->result_array();
    }

    public function get_by_id(int $id): ?array {
        return $this->db->where('id', $id)->get($this->table)->row_array() ?: null;
    }

    public function create(array $data): int {
        $this->db->insert($this->table, [
            'name'       => trim($data['name'] ?? ''),
            'code'       => trim($data['code'] ?? '') ?: null,
            'status'     => isset($data['status']) ? (int)$data['status'] : 1,
            'sort_order' => (int)($data['sort_order'] ?? 0),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        return (int)$this->db->insert_id();
    }

    public function update_bank(int $id, array $data): bool {
        $update = [
            'name'       => trim($data['name'] ?? ''),
            'code'       => trim($data['code'] ?? '') ?: null,
            'status'     => (int)($data['status'] ?? 1),
            'sort_order' => (int)($data['sort_order'] ?? 0),
            'updated_at' => date('Y-m-d H:i:s'),
        ];
        return $this->db->where('id', $id)->update($this->table, $update);
    }

    public function delete(int $id): bool {
        return $this->db->where('id', $id)->delete($this->table);
    }
}
