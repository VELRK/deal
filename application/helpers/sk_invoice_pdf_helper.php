<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Minimal PDF writer for tax invoices (no external deps).
 * Produces a downloadable application/pdf with invoice summary + line items.
 */

function sk_invoice_token_secret(): string {
    $CI =& get_instance();
    $key = (string)config_item('encryption_key');
    if ($key === '') {
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
        $key = (string)($settings['askeva_api_token'] ?? '') . (string)($settings['site_name'] ?? 'shopkart');
    }
    return hash('sha256', 'invoice|' . $key);
}

function sk_invoice_public_token(int $orderId, string $orderNumber): string {
    return substr(hash_hmac('sha256', $orderId . '|' . $orderNumber, sk_invoice_token_secret()), 0, 32);
}

function sk_invoice_verify_token(int $orderId, string $orderNumber, string $token): bool {
    $expected = sk_invoice_public_token($orderId, $orderNumber);
    return $token !== '' && hash_equals($expected, $token);
}

function sk_invoice_public_url(array $order): string {
    $id = (int)($order['id'] ?? $order['order_id'] ?? 0);
    $num = (string)($order['order_number'] ?? '');
    $token = sk_invoice_public_token($id, $num);
    return site_url('invoice/download/' . $id . '/' . $token);
}

function sk_invoice_pdf_escape(string $s): string {
    return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $s);
}

/** Sanitize text for Helvetica / WinAnsi PDF fonts. */
function sk_invoice_pdf_sanitize(string $s): string {
    $map = [
        '–' => '-', '—' => '-', '−' => '-',
        '‘' => "'", '’' => "'", '“' => '"', '”' => '"',
        '₹' => 'Rs.', '€' => 'EUR', '£' => 'GBP',
        '•' => '-', '…' => '...', "\xC2\xA0" => ' ',
    ];
    $s = strtr($s, $map);
    if (function_exists('iconv')) {
        $converted = @iconv('UTF-8', 'Windows-1252//TRANSLIT//IGNORE', $s);
        if ($converted !== false) {
            $s = $converted;
        }
    }
    // Keep printable latin + common WinAnsi
    $s = preg_replace('/[^\x20-\x7E\xA0-\xFF]/', '', $s);
    return trim((string)$s);
}

/** Approximate Helvetica string width in points. */
function sk_invoice_pdf_text_width(string $text, float $size): float {
    // Average glyph width ~0.5em for Helvetica
    return strlen($text) * $size * 0.5;
}

function sk_invoice_pdf_text(float $x, float $y, string $text, float $size = 10, string $font = 'F1'): string {
    $safe = sk_invoice_pdf_escape(sk_invoice_pdf_sanitize($text));
    return sprintf("BT /%s %.1f Tf %.2f %.2f Td (%s) Tj ET\n", $font, $size, $x, $y, $safe);
}

function sk_invoice_pdf_text_right(float $xRight, float $y, string $text, float $size = 10, string $font = 'F1'): string {
    $w = sk_invoice_pdf_text_width(sk_invoice_pdf_sanitize($text), $size);
    return sk_invoice_pdf_text($xRight - $w, $y, $text, $size, $font);
}

function sk_invoice_pdf_line(float $x1, float $y1, float $x2, float $y2, float $width = 0.6): string {
    return sprintf("%.2f w %.2f %.2f m %.2f %.2f l S\n", $width, $x1, $y1, $x2, $y2);
}

function sk_invoice_pdf_rect_fill(float $x, float $y, float $w, float $h, string $rgb = '0.94 0.96 0.99'): string {
    return sprintf("%s rg %.2f %.2f %.2f %.2f re f\n0 g\n", $rgb, $x, $y, $w, $h);
}

/**
 * Build a clean single/multi-page A4 PDF from invoice array (aligned columns).
 */
function sk_invoice_build_pdf(array $invoice): string {
    $pageW = 595.28;
    $pageH = 841.89;
    $marginL = 40;
    $marginR = 40;
    $contentW = $pageW - $marginL - $marginR;
    $rightX = $pageW - $marginR;

    // Column layout for items table
    $colItem = $marginL;
    $colQty  = $marginL + 320;
    $colRate = $marginL + 380;
    $colAmt  = $rightX;

    $cur = sk_invoice_pdf_sanitize((string)($invoice['currency'] ?? 'RM'));
    $seller = $invoice['seller'] ?? [];
    $buyer  = $invoice['buyer'] ?? [];

    $pages = [];
    $ops = '';
    $y = $pageH - 48;

    $flushPage = function () use (&$pages, &$ops) {
        $pages[] = $ops;
        $ops = '';
    };

    $ensureSpace = function (float $need) use (&$y, &$ops, $flushPage, $pageH, $marginL) {
        if ($y - $need < 50) {
            $flushPage();
            $y = $pageH - 48;
            $ops .= sk_invoice_pdf_text($marginL, $y, 'TAX INVOICE (continued)', 11, 'F2');
            $y -= 22;
        }
    };

    // Header bar
    $ops .= sk_invoice_pdf_rect_fill($marginL - 8, $y - 8, $contentW + 16, 36, '0.06 0.09 0.16');
    $ops .= "1 1 1 rg\n";
    $ops .= sk_invoice_pdf_text($marginL, $y + 4, 'TAX INVOICE', 16, 'F2');
    $ops .= "0 g\n";
    $y -= 42;

    // Seller (left) + meta (right)
    $metaY = $y;
    $ops .= sk_invoice_pdf_text($marginL, $y, (string)($seller['name'] ?? 'Seller'), 12, 'F2');
    $ops .= sk_invoice_pdf_text_right($rightX, $metaY, 'Invoice: ' . (string)($invoice['invoice_no'] ?? ''), 10, 'F2');
    $y -= 14;
    $metaY -= 14;

    if (!empty($seller['gstin'])) {
        $ops .= sk_invoice_pdf_text($marginL, $y, 'Tax ID: ' . (string)$seller['gstin'], 9);
        $y -= 13;
    }
    $ops .= sk_invoice_pdf_text_right($rightX, $metaY, 'Order: ' . (string)($invoice['order_number'] ?? ''), 9);
    $metaY -= 13;
    $ops .= sk_invoice_pdf_text_right($rightX, $metaY, 'Date: ' . (string)($invoice['invoice_date'] ?? ''), 9);

    if (!empty($seller['address'])) {
        foreach (preg_split("/\r\n|\n|\r/", (string)$seller['address']) as $addrLine) {
            $addrLine = trim($addrLine);
            if ($addrLine === '') continue;
            $ops .= sk_invoice_pdf_text($marginL, $y, $addrLine, 8);
            $y -= 11;
        }
    }
    $y = min($y, $metaY) - 10;
    $ops .= sk_invoice_pdf_line($marginL, $y, $rightX, $y, 1);
    $y -= 18;

    // Bill to
    $ops .= sk_invoice_pdf_text($marginL, $y, 'BILL TO', 9, 'F2');
    $y -= 13;
    $buyerName = (string)($buyer['name'] ?? $buyer['person'] ?? $buyer['company'] ?? 'Customer');
    $ops .= sk_invoice_pdf_text($marginL, $y, $buyerName, 11, 'F2');
    $y -= 13;
    if (!empty($buyer['phone'])) {
        $ops .= sk_invoice_pdf_text($marginL, $y, 'Phone: ' . (string)$buyer['phone'], 9);
        $y -= 12;
    }
    $addrParts = array_filter([
        trim((string)($buyer['line1'] ?? '')),
        trim((string)($buyer['line2'] ?? '')),
        trim(implode(', ', array_filter([(string)($buyer['city'] ?? ''), (string)($buyer['state'] ?? '')]))),
        trim((string)($buyer['pincode'] ?? '') . (!empty($buyer['country']) ? ' ' . $buyer['country'] : '')),
    ]);
    foreach ($addrParts as $part) {
        $ops .= sk_invoice_pdf_text($marginL, $y, $part, 9);
        $y -= 12;
    }
    $y -= 8;

    // Table header
    $ensureSpace(40);
    $ops .= sk_invoice_pdf_rect_fill($marginL - 2, $y - 4, $contentW + 4, 18, '0.94 0.96 0.99');
    $ops .= sk_invoice_pdf_text($colItem, $y, 'Item', 9, 'F2');
    $ops .= sk_invoice_pdf_text_right($colQty + 20, $y, 'Qty', 9, 'F2');
    $ops .= sk_invoice_pdf_text_right($colRate + 30, $y, 'Rate', 9, 'F2');
    $ops .= sk_invoice_pdf_text_right($colAmt, $y, 'Amount', 9, 'F2');
    $y -= 8;
    $ops .= sk_invoice_pdf_line($marginL, $y, $rightX, $y, 0.8);
    $y -= 16;

    $items = $invoice['items'] ?? [];
    if (!$items) {
        $ops .= sk_invoice_pdf_text($colItem, $y, 'No items', 9);
        $y -= 14;
    }

    foreach ($items as $item) {
        $ensureSpace(28);
        $name = sk_invoice_pdf_sanitize((string)($item['name'] ?? 'Item'));
        $maxChars = 48;
        $line1 = substr($name, 0, $maxChars);
        $line2 = strlen($name) > $maxChars ? substr($name, $maxChars, $maxChars) : '';

        $qty  = (string)(int)($item['qty'] ?? $item['quantity'] ?? 1);
        $rate = number_format((float)($item['price'] ?? $item['rate'] ?? 0), 2);
        $amt  = number_format((float)($item['subtotal'] ?? 0), 2);

        $ops .= sk_invoice_pdf_text($colItem, $y, $line1, 9);
        $ops .= sk_invoice_pdf_text_right($colQty + 20, $y, $qty, 9);
        $ops .= sk_invoice_pdf_text_right($colRate + 30, $y, $rate, 9);
        $ops .= sk_invoice_pdf_text_right($colAmt, $y, $amt, 9);
        $y -= 13;
        if ($line2 !== '') {
            $ops .= sk_invoice_pdf_text($colItem, $y, $line2, 8);
            $y -= 12;
        }
    }

    $y -= 4;
    $ops .= sk_invoice_pdf_line($marginL, $y, $rightX, $y, 0.8);
    $y -= 18;

    // Totals block (right aligned labels + values)
    $ensureSpace(90);
    $row = function (string $label, string $value, bool $bold = false) use (&$ops, &$y, $rightX) {
        $font = $bold ? 'F2' : 'F1';
        $size = $bold ? 11 : 10;
        $ops .= sk_invoice_pdf_text($rightX - 180, $y, $label, $size, $font);
        $ops .= sk_invoice_pdf_text_right($rightX, $y, $value, $size, $font);
        $y -= 14;
    };

    $row('Subtotal', $cur . ' ' . number_format((float)($invoice['subtotal'] ?? 0), 2));
    if (!empty($invoice['discount'])) {
        $row('Discount', '- ' . $cur . ' ' . number_format((float)$invoice['discount'], 2));
    }
    if (!empty($invoice['tax'])) {
        $row('Tax', $cur . ' ' . number_format((float)$invoice['tax'], 2));
    }
    if (isset($invoice['shipping'])) {
        $ship = ((float)$invoice['shipping'] == 0)
            ? 'Free'
            : ($cur . ' ' . number_format((float)$invoice['shipping'], 2));
        $row('Shipping', $ship);
    }
    $y -= 2;
    $ops .= sk_invoice_pdf_line($rightX - 180, $y + 8, $rightX, $y + 8, 1);
    $row('TOTAL', $cur . ' ' . number_format((float)($invoice['total'] ?? 0), 2), true);

    $y -= 10;
    $ops .= sk_invoice_pdf_text($marginL, $y, 'Payment: ' . (string)($invoice['payment_method'] ?? '') . ' / ' . (string)($invoice['payment_status'] ?? ''), 9);
    $y -= 14;
    $ops .= sk_invoice_pdf_text($marginL, $y, 'This is a computer-generated tax invoice.', 8);
    if (!empty($seller['invoice_footer'])) {
        $y -= 12;
        $ops .= sk_invoice_pdf_text($marginL, $y, (string)$seller['invoice_footer'], 8);
    }

    $flushPage();

    // Build PDF objects (multi-page)
    $fontRegular = "6 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>endobj\n";
    $fontBold    = "7 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>endobj\n";

    $pageCount = count($pages);
    $objects = [];
    $objects[1] = "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n";

    $kids = [];
    $nextObj = 8; // 3.. content streams start after fonts; we'll assign page objs dynamically
    // Layout: 1 catalog, 2 pages, 6 F1, 7 F2, then for each page: pageObj + contentObj
    $pageObjs = [];
    $contentObjs = [];
    $objNum = 8;
    foreach ($pages as $i => $content) {
        $pageObjs[$i] = $objNum++;
        $contentObjs[$i] = $objNum++;
        $kids[] = $pageObjs[$i] . ' 0 R';
    }

    $objects[2] = '2 0 obj<< /Type /Pages /Kids [' . implode(' ', $kids) . '] /Count ' . $pageCount . " >>endobj\n";
    $objects[6] = $fontRegular;
    $objects[7] = $fontBold;

    foreach ($pages as $i => $content) {
        $len = strlen($content);
        $pObj = $pageObjs[$i];
        $cObj = $contentObjs[$i];
        $objects[$pObj] = "{$pObj} 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {$pageW} {$pageH}] /Contents {$cObj} 0 R /Resources << /Font << /F1 6 0 R /F2 7 0 R >> >> >>endobj\n";
        $objects[$cObj] = "{$cObj} 0 obj<< /Length {$len} >>stream\n{$content}\nendstream endobj\n";
    }

    ksort($objects);
    $pdf = "%PDF-1.4\n";
    $offsets = [0];
    $maxObj = max(array_keys($objects));
    for ($i = 1; $i <= $maxObj; $i++) {
        if (!isset($objects[$i])) {
            // placeholder for unused numbers (3-5 unused)
            $objects[$i] = "{$i} 0 obj<< >>endobj\n";
        }
        $offsets[$i] = strlen($pdf);
        $pdf .= $objects[$i];
    }
    $xref = strlen($pdf);
    $count = $maxObj + 1;
    $pdf .= "xref\n0 {$count}\n";
    $pdf .= "0000000000 65535 f \n";
    for ($i = 1; $i <= $maxObj; $i++) {
        $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
    }
    $pdf .= "trailer<< /Size {$count} /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";
    return $pdf;
}
