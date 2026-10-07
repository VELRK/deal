<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Url_Redirect_model extends CI_Model {

    protected $table = 'url_redirects';

    public function table_exists(): bool {
        return $this->db->table_exists($this->table);
    }

    public function find_by_old_path(string $old_path): ?array {
        if (!$this->table_exists()) return null;
        $old_path = $this->normalize_path($old_path);
        $row = $this->db->where('old_path', $old_path)->get($this->table)->row_array();
        return $row ?: null;
    }

    public function record_change(string $entity_type, int $entity_id, string $old_path, string $new_path): void {
        if (!$this->table_exists()) return;

        $old_path = $this->normalize_path($old_path);
        $new_path = $this->normalize_path($new_path);
        if ($old_path === '' || $new_path === '' || $old_path === $new_path) return;

        // Keep prior history pointing at the latest canonical path
        $this->db->where('entity_type', $entity_type)
                 ->where('entity_id', $entity_id)
                 ->update($this->table, ['new_path' => $new_path]);

        $existing = $this->db->where('old_path', $old_path)->get($this->table)->row_array();
        if ($existing) {
            $this->db->where('id', $existing['id'])->update($this->table, [
                'entity_type' => $entity_type,
                'entity_id'   => $entity_id,
                'new_path'    => $new_path,
            ]);
            return;
        }

        $this->db->insert($this->table, [
            'entity_type' => $entity_type,
            'entity_id'   => $entity_id,
            'old_path'    => $old_path,
            'new_path'    => $new_path,
            'hits'        => 0,
            'created_at'  => date('Y-m-d H:i:s'),
        ]);
    }

    public function bump_hits(int $id): void {
        if (!$this->table_exists()) return;
        $this->db->set('hits', 'hits+1', false)->where('id', (int)$id)->update($this->table);
    }

    public function normalize_path(string $path): string {
        $path = trim($path);
        if ($path === '') return '';
        if (preg_match('#^https?://#i', $path)) {
            $parts = parse_url($path);
            $path = $parts['path'] ?? '/';
        }
        $path = '/' . ltrim($path, '/');
        if ($path !== '/' && substr($path, -1) === '/') {
            $path = rtrim($path, '/');
        }
        return $path;
    }

    public function product_path(string $slug): string {
        return '/product/' . ltrim($slug, '/');
    }

    public function blog_path(string $slug): string {
        return '/blog/' . ltrim($slug, '/');
    }
}
