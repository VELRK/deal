<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Write SEO tags into the SPA shell before it is sent.
 * View Source then includes description, keywords, canonical, and OG image.
 */
function sk_seo_html_serve(array $seo, int $status = 200): void {
    $spa = FCPATH . 'frontend' . DIRECTORY_SEPARATOR . 'index.html';
    if (!is_file($spa)) {
        show_404();
        return;
    }

    $html = file_get_contents($spa);
    if ($html === false) {
        show_404();
        return;
    }

    $html = sk_seo_html_apply($html, $seo);
    http_response_code($status);
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    echo $html;
    exit;
}

function sk_seo_html_apply(string $html, array $seo): string {
    $title = trim((string)($seo['title'] ?? ''));
    if ($title !== '') {
        $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
        $replaced = preg_replace('/<title>.*?<\/title>/is', '<title>' . $safeTitle . '</title>', $html, 1);
        if (is_string($replaced)) {
            $html = $replaced;
        }
    }

    $block = sk_seo_html_tags($seo);
    if ($block === '') {
        return $html;
    }

    $injected = preg_replace('/<\/head>/i', $block . "\n</head>", $html, 1);
    return is_string($injected) ? $injected : $html;
}

function sk_seo_html_tags(array $seo): string {
    $esc = static function (string $value): string {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    };

    $title = trim((string)($seo['title'] ?? ''));
    $description = trim((string)($seo['description'] ?? ''));
    $keywords = trim((string)($seo['keywords'] ?? ''));
    $robots = trim((string)($seo['robots'] ?? ''));
    $canonical = trim((string)($seo['canonical'] ?? ''));
    $image = trim((string)($seo['og_image'] ?? ''));
    $type = trim((string)($seo['og_type'] ?? 'website')) ?: 'website';

    $lines = ['  <!-- seo -->'];
    if ($description !== '') {
        $lines[] = '  <meta name="description" content="' . $esc($description) . '" />';
    }
    if ($keywords !== '') {
        $lines[] = '  <meta name="keywords" content="' . $esc($keywords) . '" />';
    }
    if ($robots !== '') {
        $lines[] = '  <meta name="robots" content="' . $esc($robots) . '" />';
    }
    if ($canonical !== '') {
        $lines[] = '  <link rel="canonical" href="' . $esc($canonical) . '" />';
        $lines[] = '  <meta property="og:url" content="' . $esc($canonical) . '" />';
    }
    if ($title !== '') {
        $lines[] = '  <meta property="og:title" content="' . $esc($title) . '" />';
        $lines[] = '  <meta name="twitter:title" content="' . $esc($title) . '" />';
    }
    if ($description !== '') {
        $lines[] = '  <meta property="og:description" content="' . $esc($description) . '" />';
        $lines[] = '  <meta name="twitter:description" content="' . $esc($description) . '" />';
    }
    $lines[] = '  <meta property="og:type" content="' . $esc($type) . '" />';
    if ($image !== '') {
        $lines[] = '  <meta property="og:image" content="' . $esc($image) . '" />';
        $lines[] = '  <meta name="twitter:image" content="' . $esc($image) . '" />';
        $lines[] = '  <meta name="twitter:card" content="summary_large_image" />';
    } elseif ($title !== '' || $description !== '') {
        $lines[] = '  <meta name="twitter:card" content="summary" />';
    }

    $faq = sk_seo_html_faq_script($seo['faqs'] ?? []);
    if ($faq !== '') {
        $lines[] = $faq;
    }

    if (count($lines) === 1) {
        return '';
    }
    return implode("\n", $lines);
}

function sk_seo_html_faq_script($faqs): string {
    if (!is_array($faqs) || !$faqs) {
        return '';
    }

    $main = [];
    foreach ($faqs as $faq) {
        if (!is_array($faq)) {
            continue;
        }
        $question = sk_seo_html_plain((string)($faq['question'] ?? ''));
        $answer = sk_seo_html_plain((string)($faq['answer'] ?? ''));
        if ($question === '' || $answer === '') {
            continue;
        }
        $main[] = [
            '@type' => 'Question',
            'name' => $question,
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => $answer,
            ],
        ];
    }
    if (!$main) {
        return '';
    }

    $json = json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'FAQPage',
        'mainEntity' => $main,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
    if ($json === false) {
        return '';
    }

    return '  <script type="application/ld+json" data-page-meta-faq="1">' . $json . '</script>';
}

function sk_seo_html_plain(string $value): string {
    $text = trim(preg_replace('/\s+/', ' ', strip_tags($value)) ?? '');
    return $text;
}

/** Home, product, or blog payload for sk_seo_html_serve(). */
function sk_seo_html_from_entity(array $row, string $type, array $globals = []): array {
    $CI =& get_instance();
    $CI->load->model('Sk_Seo_model');
    $formatted = $CI->Sk_Seo_model->format_entity($row, $type, $globals);

    return [
        'title' => $formatted['meta_title'] ?? '',
        'description' => $formatted['meta_description'] ?? '',
        'keywords' => $formatted['meta_keywords'] ?? '',
        'robots' => $formatted['robots'] ?? 'index,follow',
        'canonical' => $formatted['canonical_url'] ?? '',
        'og_image' => $formatted['og_image'] ?? '',
        'og_type' => $type === 'blog' ? 'article' : 'product',
        'faqs' => $formatted['faqs'] ?? [],
    ];
}

function sk_seo_html_from_home(): array {
    $CI =& get_instance();
    $CI->load->model('Sk_Seo_model');
    $globals = $CI->Sk_Seo_model->get_global_seo();
    $page = $CI->Sk_Seo_model->get_page_by_key('home');
    $formatted = $page ? $CI->Sk_Seo_model->format_page($page, $globals) : [];

    $site = trim((string)($globals['site_name'] ?? '')) ?: '2Deal';
    $canonical = trim((string)($formatted['canonical_url'] ?? ''));
    if ($canonical === '') {
        $canonical = rtrim(base_url(), '/') . '/';
    } elseif (!preg_match('#^https?://#i', $canonical)) {
        $canonical = rtrim(base_url(), '/') . '/' . ltrim($canonical, '/');
    }

    $image = trim((string)($formatted['og_image'] ?? ''));
    if ($image === '') {
        $image = trim((string)($globals['og_image'] ?? ''));
    }

    return [
        'title' => $site,
        'description' => trim((string)($formatted['meta_description'] ?? '')) ?: trim((string)($globals['meta_description'] ?? '')),
        'keywords' => trim((string)($formatted['meta_keywords'] ?? '')) ?: trim((string)($globals['meta_keywords'] ?? '')),
        'robots' => trim((string)($formatted['robots'] ?? '')) ?: 'index,follow',
        'canonical' => $canonical,
        'og_image' => $image,
        'og_type' => 'website',
    ];
}
