<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Blog extends Sk_Base_Api {

    public function index() {
        $cached = $this->get_cache('blogs_list', 60);
        if ($cached !== null) return $this->success($cached);

        if (!$this->db->table_exists('blogs')) {
            return $this->success([]);
        }

        $rows = $this->db
            ->select('id, title, slug, excerpt, author, tags, image, created_at')
            ->where('status', 1)
            ->order_by('created_at', 'DESC')
            ->get('blogs')
            ->result_array();

        $base = base_url();
        foreach ($rows as &$r) {
            $r['image_url'] = $r['image'] ? $base . $r['image'] : null;
            $r['date']      = date('d M Y', strtotime($r['created_at']));
        }
        unset($r);

        $this->set_cache('blogs_list', $rows);
        $this->success($rows);
    }

    public function show($slug) {
        if (!$this->db->table_exists('blogs')) {
            return $this->error('Blog post not found', 404);
        }

        $key    = 'blog_' . preg_replace('/[^a-z0-9_]/', '_', $slug);
        $cached = $this->get_cache($key, 60);
        if ($cached !== null) return $this->success($cached);

        $row = $this->db
            ->where('slug', $slug)
            ->where('status', 1)
            ->get('blogs')
            ->row_array();

        if (!$row) return $this->error('Blog post not found', 404);

        $base            = base_url();
        $row['image_url'] = $row['image'] ? $base . $row['image'] : null;
        $row['date']      = date('d M Y', strtotime($row['created_at']));

        $this->load->model('Sk_Seo_model');
        $row['seo'] = $this->Sk_Seo_model->format_entity($row, 'blog', $this->Sk_Seo_model->get_global_seo());

        $this->set_cache($key, $row);
        $this->success($row);
    }
}
