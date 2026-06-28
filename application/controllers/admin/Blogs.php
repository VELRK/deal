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
        $slug  = $this->_make_slug($title);

        // ensure slug is unique
        $check = $this->db->where('slug', $slug)->get('blogs')->row();
        if ($check) $slug = $slug . '-' . time();

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
            'status'        => 1,
            'image'         => $image,
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ];

        if (!$data['title']) {
            return $this->json(['success' => false, 'message' => 'Title is required.']);
        }

        $this->db->insert('blogs', $data);
        $this->json(['success' => true, 'id' => $this->db->insert_id()]);
    }

    public function edit($id) {
        $row = $this->db->where('id', $id)->get('blogs')->row_array();
        if (!$row) return $this->json(['success' => false, 'message' => 'Not found'], 404);
        $this->json(['success' => true, 'data' => $row]);
    }

    public function update($id) {
        $row = $this->db->where('id', $id)->get('blogs')->row_array();
        if (!$row) return $this->json(['success' => false, 'message' => 'Not found'], 404);

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
            'updated_at'    => date('Y-m-d H:i:s'),
        ];

        if (!$update['title']) {
            return $this->json(['success' => false, 'message' => 'Title is required.']);
        }

        if (!empty($_FILES['image']['name'])) {
            $new_image = $this->upload_file('image', 'blogs');
            if ($new_image) $update['image'] = $new_image;
        }

        $this->db->where('id', $id)->update('blogs', $update);
        $this->json(['success' => true]);
    }

    public function toggle($id) {
        $row = $this->db->where('id', $id)->get('blogs')->row_array();
        if (!$row) return $this->json(['success' => false], 404);
        $new = $row['status'] ? 0 : 1;
        $this->db->where('id', $id)->update('blogs', ['status' => $new]);
        $this->json(['success' => true, 'status' => $new]);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete('blogs');
        $this->json(['success' => true]);
    }

    private function _make_slug($str) {
        $str = strtolower(trim($str));
        $str = preg_replace('/[^a-z0-9\s-]/', '', $str);
        $str = preg_replace('/[\s-]+/', '-', $str);
        return trim($str, '-');
    }
}
