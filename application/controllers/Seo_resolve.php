<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Resolves SEO URLs:
 * - /products/{slug} (canonical) + legacy /product/* and /product-detail/*
 * - /collections/{category-slug}
 * - /{category-slug}/{subcategory-slug} via nest()
 * - /blog/{slug} + legacy /blog-single/*
 * - historical url_redirects → HTTP 301
 */
class Seo_resolve extends CI_Controller {

    public function handle($prefix = '', $segment = '') {
        $prefix  = strtolower(trim((string)$prefix));
        $segment = trim(rawurldecode((string)$segment), '/');

        if ($prefix === '' || $segment === '' || strpos($segment, '/') !== false) {
            return $this->serve_spa(404);
        }

        $this->load->model('Sk_Url_Redirect_model');
        $path = $this->Sk_Url_Redirect_model->normalize_path('/' . $prefix . '/' . $segment);

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
        if ($prefix === 'product' || $prefix === 'products') {
            return $this->resolve_product($segment, $path, $prefix);
        }
        if ($prefix === 'collections') {
            return $this->resolve_collection($segment, $path);
        }
        if ($prefix === 'blog') {
            return $this->resolve_blog($segment, $path);
        }

        return $this->serve_spa(404);
    }

    /** Route: /{categorySlug}/{subSlug} */
    public function nest($categorySlug = '', $subSlug = '') {
        return $this->resolve_subcategory(
            trim(rawurldecode((string)$categorySlug), '/'),
            trim(rawurldecode((string)$subSlug), '/')
        );
    }

    protected function resolve_legacy_product(string $segment) {
        $this->load->model(['Sk_Product_model', 'Sk_Url_Redirect_model']);
        $product = ctype_digit($segment)
            ? $this->Sk_Product_model->get_by_id((int)$segment)
            : $this->Sk_Product_model->get_by_slug($segment);

        if ($product && !empty($product['slug'])) {
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

    protected function resolve_product(string $segment, string $path, string $prefix) {
        $this->load->model(['Sk_Product_model', 'Sk_Url_Redirect_model']);
        $product = $this->Sk_Product_model->get_by_slug($segment);
        if ($product && ($product['status'] ?? '') === 'active') {
            $canonical = $this->Sk_Url_Redirect_model->product_path($product['slug']);
            if ($prefix === 'product' || $path !== $canonical) {
                return $this->redirect_permanent($canonical);
            }
            return $this->serve_spa(200, $product, 'product');
        }
        if (ctype_digit($segment)) {
            $byId = $this->Sk_Product_model->get_by_id((int)$segment);
            if ($byId && !empty($byId['slug'])) {
                return $this->redirect_permanent($this->Sk_Url_Redirect_model->product_path($byId['slug']));
            }
        }
        return $this->serve_spa(404);
    }

    protected function resolve_collection(string $segment, string $path) {
        $this->load->model('Sk_Url_Redirect_model');
        $cat = $this->db->where('slug', $segment)->where('status', 1)->get('categories')->row_array();
        if (!$cat) {
            return $this->serve_spa(404);
        }
        $canonical = $this->Sk_Url_Redirect_model->collection_path($cat['slug']);
        if ($path !== $canonical) {
            return $this->redirect_permanent($canonical);
        }
        return $this->serve_spa(200, $cat, 'collection');
    }

    protected function resolve_subcategory(string $catSlug, string $subSlug) {
        $this->load->model('Sk_Url_Redirect_model');
        if ($catSlug === '' || $subSlug === '') {
            return $this->serve_spa(404);
        }

        $reserved = [
            'admin', 'shopkart-api', 'invoice', 'frontend', 'assets', 'uploads',
            'product', 'products', 'product-detail', 'collections', 'blog', 'blog-single',
            'shop-default', 'account', 'account-orders', 'checkout', 'view-cart',
            'wishlist', 'compare', 'contact', 'about', 'affiliate', 'sitemap',
            'api', 'home', 'login', 'register', 'search-result',
        ];
        if (in_array(strtolower($catSlug), $reserved, true)) {
            return $this->serve_spa(404);
        }

        $path = $this->Sk_Url_Redirect_model->normalize_path('/' . $catSlug . '/' . $subSlug);
        $redirect = $this->Sk_Url_Redirect_model->find_by_old_path($path);
        if ($redirect && !empty($redirect['new_path']) && $redirect['new_path'] !== $path) {
            $this->Sk_Url_Redirect_model->bump_hits((int)$redirect['id']);
            return $this->redirect_permanent($redirect['new_path']);
        }

        $cat = $this->db->where('slug', $catSlug)->where('status', 1)->get('categories')->row_array();
        if (!$cat) {
            return $this->serve_spa(404);
        }
        $sub = $this->db->where('slug', $subSlug)
            ->where('category_id', (int)$cat['id'])
            ->where('status', 1)
            ->get('subcategories')
            ->row_array();
        if (!$sub) {
            return $this->serve_spa(404);
        }

        $canonical = $this->Sk_Url_Redirect_model->subcategory_path($cat['slug'], $sub['slug']);
        if ($path !== $canonical) {
            return $this->redirect_permanent($canonical);
        }

        $entity = array_merge($sub, [
            'category_slug' => $cat['slug'],
            'category_name' => $cat['name'],
        ]);
        return $this->serve_spa(200, $entity, 'subcategory');
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
            return $this->serve_spa(200, $row, 'blog');
        }
        return $this->serve_spa(404);
    }

    protected function redirect_permanent(string $to_path) {
        $this->load->model('Sk_Url_Redirect_model');
        $to_path = $this->Sk_Url_Redirect_model->normalize_path($to_path);
        $target = rtrim(base_url(), '/') . $to_path;
        $qs = $_SERVER['QUERY_STRING'] ?? '';
        if ($qs !== '' && !preg_match('/(?:category_id|subcategory_id)=/', $qs)) {
            $target .= '?' . $qs;
        }
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Location: ' . $target, true, 301);
        exit;
    }

    protected function serve_spa(int $status = 200, ?array $entity = null, string $type = '') {
        $this->load->helper('sk_seo_html');
        $seo = [];
        if ($status === 200 && $entity && ($type === 'product' || $type === 'blog')) {
            $this->load->model('Sk_Seo_model');
            $seo = sk_seo_html_from_entity($entity, $type, $this->Sk_Seo_model->get_global_seo());
        } elseif ($status === 200 && $entity && ($type === 'collection' || $type === 'subcategory')) {
            $name = (string)($entity['name'] ?? 'Shop');
            $seo = [
                'title' => $name . ' | 2Deal',
                'description' => trim((string)($entity['description'] ?? $entity['meta_desc'] ?? '')) ?: ('Shop ' . $name . ' at 2Deal.'),
                'robots' => 'index,follow',
            ];
        } elseif ($status === 404) {
            $seo = [
                'title' => 'Page not found',
                'robots' => 'noindex,follow',
            ];
        }
        sk_seo_html_serve($seo, $status);
    }
}
