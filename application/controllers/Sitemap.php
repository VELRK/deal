<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Public XML sitemap for crawlers (PageSpeed / Google Search).
 */
class Sitemap extends CI_Controller {

    public function index() {
        $this->load->database();
        $this->load->model('Sk_Url_Redirect_model');
        $base = rtrim(base_url(), '/');
        $urls = [];

        $urls[] = ['loc' => $base . '/', 'changefreq' => 'daily', 'priority' => '1.0'];
        foreach (['/shop-default', '/about', '/contact', '/blog', '/affiliate'] as $path) {
            $urls[] = ['loc' => $base . $path, 'changefreq' => 'weekly', 'priority' => '0.7'];
        }

        if ($this->db->table_exists('categories')) {
            $cats = $this->db->select('id, slug, updated_at, created_at')
                ->where('status', 1)
                ->order_by('sort_order', 'ASC')
                ->get('categories')
                ->result_array();
            foreach ($cats as $c) {
                $slug = trim((string)($c['slug'] ?? ''));
                if ($slug === '') {
                    continue;
                }
                $last = $c['updated_at'] ?: $c['created_at'];
                $urls[] = [
                    'loc' => $base . $this->Sk_Url_Redirect_model->collection_path($slug),
                    'lastmod' => $last ? date('Y-m-d', strtotime($last)) : null,
                    'changefreq' => 'weekly',
                    'priority' => '0.75',
                ];
            }
        }

        if ($this->db->table_exists('subcategories') && $this->db->table_exists('categories')) {
            $subs = $this->db->select('s.slug as sub_slug, c.slug as cat_slug, s.updated_at, s.created_at')
                ->from('subcategories s')
                ->join('categories c', 'c.id = s.category_id')
                ->where('s.status', 1)
                ->where('c.status', 1)
                ->order_by('c.sort_order', 'ASC')
                ->order_by('s.sort_order', 'ASC')
                ->get()
                ->result_array();
            foreach ($subs as $s) {
                $catSlug = trim((string)($s['cat_slug'] ?? ''));
                $subSlug = trim((string)($s['sub_slug'] ?? ''));
                if ($catSlug === '' || $subSlug === '') {
                    continue;
                }
                $last = $s['updated_at'] ?: $s['created_at'];
                $urls[] = [
                    'loc' => $base . $this->Sk_Url_Redirect_model->subcategory_path($catSlug, $subSlug),
                    'lastmod' => $last ? date('Y-m-d', strtotime($last)) : null,
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            }
        }

        if ($this->db->table_exists('products')) {
            $products = $this->db->select('slug, updated_at, created_at')
                ->where('status', 'active')
                ->order_by('id', 'DESC')
                ->limit(2000)
                ->get('products')
                ->result_array();
            foreach ($products as $p) {
                $slug = trim((string)($p['slug'] ?? ''));
                if ($slug === '') {
                    continue;
                }
                $last = $p['updated_at'] ?: $p['created_at'];
                $urls[] = [
                    'loc' => $base . $this->Sk_Url_Redirect_model->product_path($slug),
                    'lastmod' => $last ? date('Y-m-d', strtotime($last)) : null,
                    'changefreq' => 'weekly',
                    'priority' => '0.8',
                ];
            }
        }

        if ($this->db->table_exists('blogs')) {
            $blogs = $this->db->select('slug, updated_at, created_at')
                ->where('status', 1)
                ->order_by('id', 'DESC')
                ->limit(500)
                ->get('blogs')
                ->result_array();
            foreach ($blogs as $b) {
                $slug = trim((string)($b['slug'] ?? ''));
                if ($slug === '') {
                    continue;
                }
                $last = $b['updated_at'] ?: $b['created_at'];
                $urls[] = [
                    'loc' => $base . '/blog/' . rawurlencode($slug),
                    'lastmod' => $last ? date('Y-m-d', strtotime($last)) : null,
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ];
            }
        }

        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600');
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $u) {
            echo "  <url>\n";
            echo '    <loc>' . htmlspecialchars($u['loc'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</loc>\n";
            if (!empty($u['lastmod'])) {
                echo '    <lastmod>' . htmlspecialchars($u['lastmod'], ENT_XML1, 'UTF-8') . "</lastmod>\n";
            }
            if (!empty($u['changefreq'])) {
                echo '    <changefreq>' . $u['changefreq'] . "</changefreq>\n";
            }
            if (!empty($u['priority'])) {
                echo '    <priority>' . $u['priority'] . "</priority>\n";
            }
            echo "  </url>\n";
        }
        echo '</urlset>';
        exit;
    }
}
