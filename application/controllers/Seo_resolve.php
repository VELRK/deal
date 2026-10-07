<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Resolves product/blog SEO URLs:
 * - historical paths → HTTP 301 to current canonical
 * - legacy /product-detail/* and /blog-single/* → 301
 * - current canonical → SPA 200
 * - unknown entity → SPA with HTTP 404
 */
class Seo_resolve extends CI_Controller {

    public function handle($prefix = '', $segment = '') {
        $prefix  = strtolower(trim((string)$prefix));
        $segment = trim(rawurldecode((string)$segment));
        $segment = trim($segment, '/');

        if ($prefix === '' || $segment === '' || strpos($segment, '/') !== false) {
            return $this->serve_spa(404);
        }

        $this->load->model('Sk_Url_Redirect_model');
        $path = $this->Sk_Url_Redirect_model->normalize_path('/' . $prefix . '/' . $segment);

        // Saved history first
        $redirect = $this->Sk_Url_Redirect_model->find_by_old_path($path);
        if ($redirect && !empty($redirect['new_path']) && $redirect['new_path'] !== $path) {
            $this->Sk_Url_Redirect_model->bump_hits((int)$redirect['id']);
            return $this->redirect_permanent($redirect['new_path']);
        }

        if ($prefix === 'product-detail') {
            return $this->resolve_legacy_product($segment);
        }
        if ($prefix === 'blog-single') {
            return $this->resolve_legacy_blog($segment);
        }
        if ($prefix === 'product') {
            return $this->resolve_product($segment, $path);
        }
        if ($prefix === 'blog') {
            return $this->resolve_blog($segment, $path);
        }

        return $this->serve_spa(404);
    }

    protected function resolve_legacy_product(string $segment) {
        $this->load->model('Sk_Product_model');
        $product = ctype_digit($segment)
            ? $this->Sk_Product_model->get_by_id((int)$segment)
            : $this->Sk_Product_model->get_by_slug($segment);

        if ($product && !empty($product['slug'])) {
            $this->load->model('Sk_Url_Redirect_model');
            return $this->redirect_permanent($this->Sk_Url_Redirect_model->product_path($product['slug']));
        }
        return $this->serve_spa(404);
    }

    protected function resolve_legacy_blog(string $segment) {
        if (!$this->db->table_exists('blogs')) {
            return $this->serve_spa(404);
        }
        $row = $this->db->where('slug', $segment)->get('blogs')->row_array();
        if (!$row && ctype_digit($segment)) {
            $row = $this->db->where('id', (int)$segment)->get('blogs')->row_array();
        }
        if ($row && !empty($row['slug'])) {
            $this->load->model('Sk_Url_Redirect_model');
            return $this->redirect_permanent($this->Sk_Url_Redirect_model->blog_path($row['slug']));
        }
        return $this->serve_spa(404);
    }

    protected function resolve_product(string $segment, string $path) {
        $this->load->model('Sk_Product_model');
        $product = $this->Sk_Product_model->get_by_slug($segment);
        if ($product && ($product['status'] ?? '') === 'active') {
            $canonical = '/product/' . $product['slug'];
            if ($path !== $canonical) {
                return $this->redirect_permanent($canonical);
            }
            return $this->serve_spa(200);
        }
        // Inactive / missing — still try id lookup for old bookmarks
        if (ctype_digit($segment)) {
            $byId = $this->Sk_Product_model->get_by_id((int)$segment);
            if ($byId && !empty($byId['slug'])) {
                return $this->redirect_permanent('/product/' . $byId['slug']);
            }
        }
        return $this->serve_spa(404);
    }

    protected function resolve_blog(string $segment, string $path) {
        if (!$this->db->table_exists('blogs')) {
            return $this->serve_spa(404);
        }
        $row = $this->db
            ->where('slug', $segment)
            ->where('status', 1)
            ->get('blogs')
            ->row_array();
        if ($row) {
            $canonical = '/blog/' . $row['slug'];
            if ($path !== $canonical) {
                return $this->redirect_permanent($canonical);
            }
            return $this->serve_spa(200);
        }
        return $this->serve_spa(404);
    }

    protected function redirect_permanent(string $to_path) {
        $this->load->model('Sk_Url_Redirect_model');
        $to_path = $this->Sk_Url_Redirect_model->normalize_path($to_path);
        $target = rtrim(base_url(), '/') . $to_path;
        $qs = $_SERVER['QUERY_STRING'] ?? '';
        if ($qs !== '') {
            $target .= '?' . $qs;
        }
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Location: ' . $target, true, 301);
        exit;
    }

    protected function serve_spa(int $status = 200) {
        $spa = FCPATH . 'frontend' . DIRECTORY_SEPARATOR . 'index.html';
        if (!is_file($spa)) {
            show_404();
            return;
        }
        http_response_code($status);
        header('Content-Type: text/html; charset=UTF-8');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        readfile($spa);
        exit;
    }
}
