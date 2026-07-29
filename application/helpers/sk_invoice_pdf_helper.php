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

function sk_invoice_pdf_line(string $text, int $fontSize = 10): string {
    return "BT /F1 {$fontSize} Tf 40 {{Y}} Td (" . sk_invoice_pdf_escape($text) . ") Tj ET\n";
}

/**
 * Build a simple multi-page-capable single-page PDF from invoice array.
 */
function sk_invoice_build_pdf(array $invoice): string {
    $lines = [];
    $lines[] = 'TAX INVOICE';
    $lines[] = 'Invoice: ' . ($invoice['invoice_no'] ?? '');
    $lines[] = 'Order: ' . ($invoice['order_number'] ?? '');
    $lines[] = 'Date: ' . ($invoice['invoice_date'] ?? '');
    $lines[] = '';
    $seller = $invoice['seller']['name'] ?? '';
    $lines[] = 'From: ' . $seller;
    if (!empty($invoice['seller']['gstin'])) {
        $lines[] = 'Tax ID: ' . $invoice['seller']['gstin'];
    }
    $lines[] = '';
    $b = $invoice['buyer'] ?? [];
    $lines[] = 'Bill To: ' . ($b['name'] ?? $b['person'] ?? $b['company'] ?? '');
    if (!empty($b['phone'])) {
        $lines[] = 'Phone: ' . $b['phone'];
    }
    $addr = trim(($b['line1'] ?? '') . ' ' . ($b['city'] ?? '') . ' ' . ($b['pincode'] ?? ''));
    if ($addr !== '') {
        $lines[] = $addr;
    }
    $lines[] = '';
    $lines[] = str_pad('Item', 36) . str_pad('Qty', 6, ' ', STR_PAD_LEFT) . str_pad('Amount', 12, ' ', STR_PAD_LEFT);
    $lines[] = str_repeat('-', 54);
    $cur = $invoice['currency'] ?? 'RM';
    foreach (($invoice['items'] ?? []) as $item) {
        $name = mb_substr((string)($item['name'] ?? 'Item'), 0, 34);
        $qty = (string)(int)($item['qty'] ?? 1);
        $amt = number_format((float)($item['subtotal'] ?? 0), 2);
        $lines[] = str_pad($name, 36) . str_pad($qty, 6, ' ', STR_PAD_LEFT) . str_pad($amt, 12, ' ', STR_PAD_LEFT);
    }
    $lines[] = str_repeat('-', 54);
    $lines[] = 'Subtotal: ' . $cur . number_format((float)($invoice['subtotal'] ?? 0), 2);
    if (!empty($invoice['discount'])) {
        $lines[] = 'Discount: -' . $cur . number_format((float)$invoice['discount'], 2);
    }
    if (!empty($invoice['tax'])) {
        $lines[] = 'Tax: ' . $cur . number_format((float)$invoice['tax'], 2);
    }
    if (isset($invoice['shipping'])) {
        $lines[] = 'Shipping: ' . (((float)$invoice['shipping'] == 0) ? 'Free' : $cur . number_format((float)$invoice['shipping'], 2));
    }
    $lines[] = 'TOTAL: ' . $cur . number_format((float)($invoice['total'] ?? 0), 2);
    $lines[] = '';
    $lines[] = 'Payment: ' . ($invoice['payment_method'] ?? '') . ' / ' . ($invoice['payment_status'] ?? '');
    $lines[] = 'This is a computer-generated tax invoice.';

    // PDF content stream
    $y = 800;
    $content = "BT\n/F1 11 Tf\n50 {$y} Td\n14 TL\n";
    $first = true;
    foreach ($lines as $line) {
        $safe = sk_invoice_pdf_escape($line);
        if ($first) {
            $content .= "({$safe}) Tj\n";
            $first = false;
        } else {
            $content .= "T*\n({$safe}) Tj\n";
        }
    }
    $content .= "ET";

    $len = strlen($content);
    $objects = [];
    $objects[] = "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n";
    $objects[] = "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n";
    $objects[] = "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n";
    $objects[] = "4 0 obj<< /Length {$len} >>stream\n{$content}\nendstream endobj\n";
    $objects[] = "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n";

    $pdf = "%PDF-1.4\n";
    $offsets = [0];
    foreach ($objects as $obj) {
        $offsets[] = strlen($pdf);
        $pdf .= $obj;
    }
    $xref = strlen($pdf);
    $count = count($objects) + 1;
    $pdf .= "xref\n0 {$count}\n";
    $pdf .= "0000000000 65535 f \n";
    for ($i = 1; $i < $count; $i++) {
        $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
    }
    $pdf .= "trailer<< /Size {$count} /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";
    return $pdf;
}
