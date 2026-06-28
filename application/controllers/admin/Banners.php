<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Banners extends Sk_Base {

    public function index() {
        $data['title']         = 'Banners';
        $data['hero_banners']  = $this->db->where('type','hero')->order_by('sort_order','ASC')->get('sk_banners')->result_array();
        $data['offer_banners'] = $this->db->where('type','offer')->order_by('sort_order','ASC')->get('sk_banners')->result_array();
        $this->render('banners/list', $data);
    }

    public function store() {
        $type     = in_array($this->input->post('type'), ['hero','offer']) ? $this->input->post('type') : 'hero';
        $title    = $this->input->post('title', TRUE);
        $subtitle = $this->input->post('subtitle', TRUE);
        $cta_text = $this->input->post('cta_text', TRUE);
        $cta_link = $this->input->post('cta_link', TRUE);
        $sort     = (int) $this->input->post('sort_order');

        if (!$title) return $this->json(['success' => false, 'message' => 'Title is required.']);

        $image = $this->upload_file('image', 'banners');
        if (!$image) return $this->json(['success' => false, 'message' => $this->_upload_error()]);

        $this->db->insert('sk_banners', [
            'type'       => $type,
            'title'      => $title,
            'subtitle'   => $subtitle,
            'cta_text'   => $cta_text ?: 'Shop Now',
            'cta_link'   => $cta_link ?: '/shop-default',
            'image'      => $image,
            'sort_order' => $sort,
            'status'     => 1,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        $this->json(['success' => true, 'id' => $this->db->insert_id()]);
    }

    public function edit($id) {
        $banner = $this->db->where('id', $id)->get('sk_banners')->row_array();
        if (!$banner) return $this->json(['success' => false, 'message' => 'Not found'], 404);
        $this->json(['success' => true, 'data' => $banner]);
    }

    public function update($id) {
        $banner = $this->db->where('id', $id)->get('sk_banners')->row_array();
        if (!$banner) return $this->json(['success' => false, 'message' => 'Not found'], 404);

        $title = $this->input->post('title', TRUE);
        if (!$title) return $this->json(['success' => false, 'message' => 'Title is required.']);

        $update = [
            'title'      => $title,
            'subtitle'   => $this->input->post('subtitle', TRUE),
            'cta_text'   => $this->input->post('cta_text', TRUE) ?: 'Shop Now',
            'cta_link'   => $this->input->post('cta_link', TRUE) ?: '/shop-default',
            'sort_order' => (int) $this->input->post('sort_order'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        if (!empty($_FILES['image']['name'])) {
            $new_image = $this->upload_file('image', 'banners');
            if (!$new_image) return $this->json(['success' => false, 'message' => $this->_upload_error()]);
            $update['image'] = $new_image;
        }

        $this->db->where('id', $id)->update('sk_banners', $update);
        $this->json(['success' => true]);
    }

    public function toggle($id) {
        $banner = $this->db->where('id', $id)->get('sk_banners')->row_array();
        if (!$banner) return $this->json(['success' => false], 404);
        $new = $banner['status'] ? 0 : 1;
        $this->db->where('id', $id)->update('sk_banners', ['status' => $new]);
        $this->json(['success' => true, 'status' => $new]);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete('sk_banners');
        $this->json(['success' => true]);
    }

    private function _upload_error() {
        $raw = $this->upload->display_errors('', '');
        if (stripos($raw, 'type') !== false || stripos($raw, 'allowed') !== false) {
            return 'Invalid file type. Allowed types: JPG, PNG, GIF, WebP.';
        }
        if (stripos($raw, 'size') !== false || stripos($raw, 'exceed') !== false) {
            return 'Image file size must be less than 2MB.';
        }
        return $raw ?: 'Image upload failed. Please try again.';
    }
}
