<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Blogs extends Sk_Base {

    public function index() {
        $data['title'] = 'Blogs';
        $data['blogs'] = $this->db
            ->order_by('created_at', 'DESC')
            ->get('blogs')
            ->result_array();
        $data['extra_js'] = $this->load->view('admin/blogs/_quill_scripts', [], true);
        $this->render('blogs/list', $data);
    }

    public function store() {
        $title = $this->input->post('title', TRUE);
        $this->load->model('Sk_Seo_model');
        $slugInput = $this->Sk_Seo_model->sanitize_slug((string)$this->input->post('slug', TRUE));
        $slug = $this->_unique_blog_slug($slugInput !== '' ? $slugInput : $this->_make_slug($title));

        $image = null;
        if (!empty($_FILES['image']['name'])) {
            $image = $this->upload_file('image', 'blogs');
            if (!$image) {
                return $this->json(['success' => false, 'message' => 'Image upload failed: ' . $this->upload->display_errors('', '')]);
            }
        }

        $data = [
            'title'         => $title,
            'slug'          => $slug,
            'excerpt'       => $this->input->post('excerpt'),
            'content'       => $this->input->post('content'),
            'author'        => $this->input->post('author', TRUE) ?: 'Admin',
            'tags'          => $this->input->post('tags', TRUE),
            'meta_title'    => $this->input->post('meta_title', TRUE),
            'meta_desc'     => $this->input->post('meta_desc'),
            'meta_keywords' => $this->input->post('meta_keywords', TRUE),
            'og_image'      => $this->input->post('og_image', TRUE),
            'faq_json'      => $this->Sk_Seo_model->faqs_from_post(
                $this->input->post('faq_question'),
                $this->input->post('faq_answer')
            ),
            'status'        => 1,
            'image'         => $image,
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ];

        if (!$data['title']) {
            return $this->json(['success' => false, 'message' => 'Title is required.']);
        }

        $this->db->insert('blogs', $data);
        $this->_clear_blog_api_cache();
        $this->json(['success' => true, 'id' => $this->db->insert_id()]);
    }

    public function edit($id) {
        $row = $this->db->where('id', $id)->get('blogs')->row_array();
        if (!$row) return $this->json(['success' => false, 'message' => 'Not found'], 404);
        $this->load->model('Sk_Seo_model');
        $row['faqs'] = $this->Sk_Seo_model->normalize_faqs($row['faq_json'] ?? []);
        $this->json(['success' => true, 'data' => $row]);
    }

    public function update($id) {
        $row = $this->db->where('id', $id)->get('blogs')->row_array();
        if (!$row) return $this->json(['success' => false, 'message' => 'Not found'], 404);

        $this->load->model('Sk_Seo_model');
        $this->load->model('Sk_Url_Redirect_model');

        $update = [
            'title'         => $this->input->post('title', TRUE),
            'excerpt'       => $this->input->post('excerpt'),
            'content'       => $this->input->post('content'),
            'author'        => $this->input->post('author', TRUE) ?: 'Admin',
            'tags'          => $this->input->post('tags', TRUE),
            'meta_title'    => $this->input->post('meta_title', TRUE),
            'meta_desc'     => $this->input->post('meta_desc'),
            'meta_keywords' => $this->input->post('meta_keywords', TRUE),
            'og_image'      => $this->input->post('og_image', TRUE),
            'faq_json'      => $this->Sk_Seo_model->faqs_from_post(
                $this->input->post('faq_question'),
                $this->input->post('faq_answer')
            ),
            'updated_at'    => date('Y-m-d H:i:s'),
        ];

        if (!$update['title']) {
            return $this->json(['success' => false, 'message' => 'Title is required.']);
        }

        $slugInput = $this->Sk_Seo_model->sanitize_slug((string)$this->input->post('slug', TRUE));
        if ($slugInput !== '') {
            $newSlug = $this->_unique_blog_slug($slugInput, (int)$id);
            $update['slug'] = $newSlug;
            $oldSlug = (string)($row['slug'] ?? '');
            if ($oldSlug !== '' && $newSlug !== $oldSlug) {
                $this->Sk_Url_Redirect_model->record_change(
                    'blog',
                    (int)$id,
                    $this->Sk_Url_Redirect_model->blog_path($oldSlug),
                    $this->Sk_Url_Redirect_model->blog_path($newSlug)
                );
            }
        }

        if (!empty($_FILES['image']['name'])) {
            $new_image = $this->upload_file('image', 'blogs');
            if ($new_image) $update['image'] = $new_image;
        }

        $this->db->where('id', $id)->update('blogs', $update);
        $this->_clear_blog_api_cache((string)($row['slug'] ?? ''), (string)($update['slug'] ?? $row['slug'] ?? ''));
        $this->json(['success' => true]);
    }

    public function toggle($id) {
        $row = $this->db->where('id', $id)->get('blogs')->row_array();
        if (!$row) return $this->json(['success' => false], 404);
        $new = $row['status'] ? 0 : 1;
        $this->db->where('id', $id)->update('blogs', ['status' => $new]);
        $this->_clear_blog_api_cache((string)($row['slug'] ?? ''));
        $this->json(['success' => true, 'status' => $new]);
    }

    public function delete($id) {
        $row = $this->db->where('id', $id)->get('blogs')->row_array();
        $this->db->where('id', $id)->delete('blogs');
        $this->_clear_blog_api_cache((string)($row['slug'] ?? ''));
        $this->json(['success' => true]);
    }

    private function _make_slug($str) {
        $str = strtolower(trim($str));
        $str = preg_replace('/[^a-z0-9\s-]/', '', $str);
        $str = preg_replace('/[\s-]+/', '-', $str);
        return trim($str, '-');
    }

    private function _unique_blog_slug(string $base, $exclude_id = null): string {
        $base = $this->_make_slug($base);
        if ($base === '') $base = 'blog';
        $slug = $base;
        $i = 1;
        while (true) {
            $this->db->where('slug', $slug);
            if ($exclude_id) $this->db->where('id !=', (int)$exclude_id);
            if ($this->db->count_all_results('blogs') === 0) break;
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }

    private function _clear_blog_api_cache(string ...$slugs): void {
        $dir = APPPATH . 'cache/api/';
        if (!is_dir($dir)) return;
        $file = $dir . 'blogs_list.json';
        if (is_file($file)) @unlink($file);
        foreach ($slugs as $slug) {
            if ($slug === '') continue;
            $key = 'blog_' . preg_replace('/[^a-z0-9_]/', '_', $slug);
            $path = $dir . preg_replace('/[^a-z0-9_-]/', '_', strtolower($key)) . '.json';
            if (is_file($path)) @unlink($path);
        }
        foreach (glob($dir . 'blog_*.json') as $f) {
            // Only clear specific keys when slugs provided; otherwise leave others
        }
        if (!$slugs) {
            foreach (glob($dir . 'blog_*.json') as $f) @unlink($f);
        }
    }
}
