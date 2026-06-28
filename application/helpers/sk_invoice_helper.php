<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Build structured invoice data from an order row (+ items).
 */
function sk_invoice_build(array $order, array $settings = [], ?array $sellerOverride = null): array {
    $CI =& get_instance();
    $currency = $settings['currency_symbol'] ?? '₹';
    $taxRate  = (float)($settings['tax_rate'] ?? 18);

    $seller = $sellerOverride ?: sk_invoice_resolve_seller($order, $settings);

    $items = [];
    foreach ($order['items'] ?? [] as $row) {
        $hsn = $row['hsn_code'] ?? null;
        if (!$hsn && !empty($row['product_id'])) {
            $p = $CI->db->select('hsn_code, tax_code')->where('id', (int)$row['product_id'])->get('products')->row_array();
            $hsn = $p['hsn_code'] ?? ($p['tax_code'] ?? '—');
        }
        $qty   = (int)($row['quantity'] ?? 1);
        $price = (float)($row['price'] ?? $row['unit_price'] ?? 0);
        $line  = (float)($row['subtotal'] ?? ($price * $qty));
        $items[] = [
            'name'     => $row['product_name'] ?? 'Product',
            'sku'      => $row['product_sku'] ?? ($row['sku'] ?? ''),
            'hsn'      => $hsn ?: '—',
            'qty'      => $qty,
            'price'    => $price,
            'subtotal' => $line,
        ];
    }

    $subtotal  = (float)($order['subtotal'] ?? 0);
    $discount  = (float)($order['discount'] ?? 0);
    $shipping  = (float)($order['shipping'] ?? 0);
    $tax       = (float)($order['tax'] ?? 0);
    $total     = (float)($order['total'] ?? 0);
    $taxable   = max(0, $subtotal - $discount);

    if ($taxable > 0 && $tax > 0) {
        $taxRate = round($tax / $taxable * 100, 2);
    }

    $sellerState = strtoupper(trim($seller['state_code'] ?? $seller['state'] ?? ''));
    $buyerState  = strtoupper(trim($order['shipping_state'] ?? ''));
    $sameState   = $sellerState && $buyerState && (stripos($buyerState, $sellerState) !== false || stripos($sellerState, $buyerState) !== false);

    $gst = ['cgst' => 0, 'sgst' => 0, 'igst' => 0, 'rate' => $taxRate];
    if ($sameState) {
        $gst['cgst'] = round($tax / 2, 2);
        $gst['sgst'] = round($tax / 2, 2);
    } else {
        $gst['igst'] = $tax;
    }

    $promoLabel = '';
    if (!empty($order['affiliate_promo'])) {
        $promoLabel = $order['affiliate_promo'] . ' (Affiliate)';
    } elseif (!empty($order['promo_code'])) {
        $promoLabel = $order['promo_code'];
    }

    $invoiceNo = sk_invoice_number($order, $seller);

    return [
        'invoice_no'   => $invoiceNo,
        'order_number' => $order['order_number'] ?? ('#' . ($order['id'] ?? '')),
        'order_id'     => (int)($order['id'] ?? 0),
        'invoice_date' => date('d M Y', strtotime($order['created_at'] ?? 'now')),
        'order_date'   => date('d M Y, h:i A', strtotime($order['created_at'] ?? 'now')),
        'currency'     => $currency,
        'seller'       => $seller,
        'buyer'        => [
            'name'    => $order['customer_name'] ?? $order['shipping_name'] ?? '',
            'email'   => $order['customer_email'] ?? '',
            'phone'   => $order['shipping_phone'] ?? '',
            'line1'   => $order['shipping_line1'] ?? '',
            'line2'   => $order['shipping_line2'] ?? '',
            'city'    => $order['shipping_city'] ?? '',
            'state'   => $order['shipping_state'] ?? '',
            'pincode' => $order['shipping_pincode'] ?? '',
            'country' => $order['shipping_country'] ?? 'India',
        ],
        'items'          => $items,
        'subtotal'       => $subtotal,
        'discount'       => $discount,
        'promo_code'     => $promoLabel,
        'shipping'       => $shipping,
        'tax'            => $tax,
        'taxable_amount' => $taxable,
        'gst'            => $gst,
        'total'          => $total,
        'payment_method' => strtoupper($order['payment_method'] ?? 'COD'),
        'payment_status' => ucfirst($order['payment_status'] ?? 'pending'),
        'order_status'   => ucfirst($order['status'] ?? 'pending'),
        'notes'          => $order['notes'] ?? '',
    ];
}

/** Resolve seller details: single-vendor order uses vendor store, else platform settings. */
function sk_invoice_resolve_seller(array $order, array $settings): array {
    $CI =& get_instance();
    $vendorIds = [];

    foreach ($order['items'] ?? [] as $item) {
        if (empty($item['product_id'])) continue;
        $p = $CI->db->select('vendor_id')->where('id', (int)$item['product_id'])->get('products')->row_array();
        if (!empty($p['vendor_id'])) {
            $vendorIds[(int)$p['vendor_id']] = true;
        }
    }

    if (count($vendorIds) === 1) {
        $vid = (int)array_key_first($vendorIds);
        $CI->load->model('Sk_Vendor_model');
        $vendor = $CI->Sk_Vendor_model->get_by_id($vid);
        if ($vendor && !empty($vendor['store'])) {
            return sk_invoice_seller_from_vendor($vendor, $vendor['store'], $settings);
        }
    }

    return sk_invoice_seller_from_settings($settings);
}

function sk_invoice_seller_from_settings(array $settings): array {
    return [
        'name'            => $settings['company_legal_name'] ?? $settings['site_name'] ?? 'ShopKart',
        'logo'            => $settings['site_logo'] ?? '',
        'gstin'           => $settings['gstin'] ?? '',
        'pan'             => $settings['pan_no'] ?? '',
        'state_code'      => $settings['state_code'] ?? '',
        'email'           => $settings['site_email'] ?? '',
        'phone'           => $settings['site_phone'] ?? '',
        'address'         => $settings['site_address'] ?? '',
        'invoice_prefix'  => $settings['invoice_prefix'] ?? 'INV',
        'invoice_footer'  => $settings['invoice_footer'] ?? 'Thank you for your business.',
        'source'          => 'platform',
    ];
}

function sk_invoice_seller_from_vendor(array $vendor, array $store, array $settings = []): array {
    $addrParts = array_filter([
        $store['pickup_line1'] ?? '',
        $store['pickup_line2'] ?? '',
        trim(($store['pickup_city'] ?? '') . ', ' . ($store['pickup_state'] ?? '') . ' - ' . ($store['pickup_pincode'] ?? '')),
        $store['pickup_country'] ?? 'India',
    ]);

    return [
        'name'           => $store['store_name'] ?? $vendor['business_name'] ?? 'Vendor',
        'logo'           => $store['logo'] ?? ($settings['site_logo'] ?? ''),
        'gstin'          => $store['gst_vat'] ?? '',
        'pan'            => $store['pan_no'] ?? '',
        'state_code'     => $store['state_code'] ?? ($store['pickup_state'] ?? ''),
        'state'          => $store['pickup_state'] ?? '',
        'email'          => $store['contact_email'] ?? $vendor['email'] ?? '',
        'phone'          => $store['contact_phone'] ?? $vendor['phone'] ?? '',
        'address'        => implode("\n", $addrParts),
        'invoice_prefix' => $store['invoice_prefix'] ?? 'INV',
        'invoice_footer' => $store['invoice_footer'] ?? 'Thank you for shopping with us.',
        'source'         => 'vendor',
        'vendor_id'      => (int)$vendor['id'],
    ];
}

function sk_invoice_number(array $order, array $seller): string {
    $prefix = preg_replace('/[^A-Z0-9\-]/i', '', $seller['invoice_prefix'] ?? 'INV') ?: 'INV';
    $id     = (int)($order['id'] ?? 0);
    $date   = date('Ymd', strtotime($order['created_at'] ?? 'now'));
    return strtoupper($prefix) . '-' . $date . '-' . str_pad((string)$id, 5, '0', STR_PAD_LEFT);
}

/** Render printable / emailable invoice HTML. */
function sk_invoice_render_html(array $invoice, bool $forEmail = false): string {
    $s = $invoice['seller'];
    $b = $invoice['buyer'];
    $cur = htmlspecialchars($invoice['currency']);
    $logoHtml = '';
    if (!empty($s['logo'])) {
        $logoUrl = strpos($s['logo'], 'http') === 0 ? $s['logo'] : base_url($s['logo']);
        $logoHtml = "<img src='" . htmlspecialchars($logoUrl) . "' alt='Logo' style='max-height:56px;max-width:180px;object-fit:contain;'>";
    }

    $itemsRows = '';
    foreach ($invoice['items'] as $i => $item) {
        $itemsRows .= '<tr>'
            . '<td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">' . ($i + 1) . '</td>'
            . '<td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;"><strong>' . htmlspecialchars($item['name']) . '</strong>'
            . ($item['sku'] ? '<br><small style="color:#64748b;">SKU: ' . htmlspecialchars($item['sku']) . '</small>' : '') . '</td>'
            . '<td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:center;">' . htmlspecialchars($item['hsn']) . '</td>'
            . '<td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:center;">' . (int)$item['qty'] . '</td>'
            . '<td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;">' . $cur . number_format($item['price'], 2) . '</td>'
            . '<td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">' . $cur . number_format($item['subtotal'], 2) . '</td>'
            . '</tr>';
    }

    $discountRow = '';
    if ($invoice['discount'] > 0) {
        $label = $invoice['promo_code'] ? 'Discount (' . htmlspecialchars($invoice['promo_code']) . ')' : 'Discount';
        $discountRow = "<tr><td colspan='5' style='padding:8px;text-align:right;color:#16a34a;'>{$label}</td>"
            . "<td style='padding:8px;text-align:right;color:#16a34a;'>-{$cur}" . number_format($invoice['discount'], 2) . '</td></tr>';
    }

    $gstRows = '';
    $g = $invoice['gst'];
    if ($g['cgst'] > 0) {
        $half = round($g['rate'] / 2, 2);
        $gstRows .= "<tr><td colspan='5' style='padding:6px 8px;text-align:right;color:#64748b;'>CGST @ {$half}%</td>"
            . "<td style='padding:6px 8px;text-align:right;'>{$cur}" . number_format($g['cgst'], 2) . '</td></tr>';
        $gstRows .= "<tr><td colspan='5' style='padding:6px 8px;text-align:right;color:#64748b;'>SGST @ {$half}%</td>"
            . "<td style='padding:6px 8px;text-align:right;'>{$cur}" . number_format($g['sgst'], 2) . '</td></tr>';
    } elseif ($g['igst'] > 0) {
        $gstRows .= "<tr><td colspan='5' style='padding:6px 8px;text-align:right;color:#64748b;'>IGST @ {$g['rate']}%</td>"
            . "<td style='padding:6px 8px;text-align:right;'>{$cur}" . number_format($g['igst'], 2) . '</td></tr>';
    }

    $shipLabel = $invoice['shipping'] == 0 ? '<span style="color:#16a34a;">Free</span>' : $cur . number_format($invoice['shipping'], 2);

    $sellerMeta = array_filter([
        $s['gstin'] ? 'GSTIN: ' . htmlspecialchars($s['gstin']) : '',
        $s['pan'] ? 'PAN: ' . htmlspecialchars($s['pan']) : '',
        $s['email'] ? htmlspecialchars($s['email']) : '',
        $s['phone'] ? htmlspecialchars($s['phone']) : '',
    ]);
    $sellerMetaHtml = implode(' &nbsp;|&nbsp; ', $sellerMeta);

    $buyerAddr = array_filter([
        htmlspecialchars($b['name']),
        htmlspecialchars($b['phone']),
        htmlspecialchars($b['line1']),
        htmlspecialchars($b['line2']),
        htmlspecialchars(trim($b['city'] . ', ' . $b['state'] . ' - ' . $b['pincode'])),
        htmlspecialchars($b['country']),
    ]);
    $buyerAddrHtml = implode('<br>', $buyerAddr);

    $printBtns = $forEmail ? '' : "
    <div class='no-print' style='text-align:center;padding:12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;'>
      <button onclick='window.print()' style='background:#f59e0b;color:#fff;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-weight:600;'>Print / Save PDF</button>
      <button onclick='window.close()' style='background:#64748b;color:#fff;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;margin-left:8px;'>Close</button>
    </div>";

    $invoiceUrl = site_url('admin/orders/invoice/' . $invoice['order_id']);

    return "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
<title>Tax Invoice – {$invoice['invoice_no']}</title>
<style>
  body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1e293b;background:#f1f5f9;}
  .wrap{max-width:820px;margin:20px auto;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.08);border-radius:8px;overflow:hidden;}
  @media print{.no-print{display:none!important}body{background:#fff}.wrap{box-shadow:none;margin:0;max-width:100%}}
</style></head><body>
{$printBtns}
<div class='wrap'>
  <div style='background:#0f172a;color:#fff;padding:28px 32px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;'>
    <div>{$logoHtml}<div style='margin-top:10px;font-size:18px;font-weight:700;'>" . htmlspecialchars($s['name']) . "</div>"
    . ($sellerMetaHtml ? "<div style='margin-top:6px;font-size:12px;color:#94a3b8;'>{$sellerMetaHtml}</div>" : '')
    . (!empty($s['address']) ? "<div style='margin-top:8px;font-size:12px;color:#cbd5e1;line-height:1.6;white-space:pre-line;'>" . htmlspecialchars($s['address']) . '</div>' : '')
    . "</div>
    <div style='text-align:right;'>
      <div style='font-size:26px;font-weight:700;letter-spacing:1px;'>TAX INVOICE</div>
      <div style='margin-top:12px;font-size:13px;color:#94a3b8;'>Invoice No.</div>
      <div style='font-size:16px;font-weight:700;'>" . htmlspecialchars($invoice['invoice_no']) . "</div>
      <div style='margin-top:8px;font-size:13px;color:#94a3b8;'>Order: " . htmlspecialchars($invoice['order_number']) . "</div>
      <div style='font-size:13px;color:#cbd5e1;'>" . htmlspecialchars($invoice['invoice_date']) . "</div>
    </div>
  </div>

  <div style='padding:28px 32px;'>
    <div style='display:flex;gap:24px;flex-wrap:wrap;margin-bottom:24px;'>
      <div style='flex:1;min-width:240px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;'>
        <div style='font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;margin-bottom:8px;font-weight:700;'>Bill To / Ship To</div>
        <div style='line-height:1.7;font-size:13px;'>{$buyerAddrHtml}</div>
      </div>
      <div style='flex:1;min-width:200px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;'>
        <div style='font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;margin-bottom:8px;font-weight:700;'>Payment Details</div>
        <div style='line-height:1.8;font-size:13px;'>
          <div><strong>Method:</strong> " . htmlspecialchars($invoice['payment_method']) . "</div>
          <div><strong>Status:</strong> " . htmlspecialchars($invoice['payment_status']) . "</div>
          <div><strong>Order Status:</strong> " . htmlspecialchars($invoice['order_status']) . "</div>
          <div><strong>Date:</strong> " . htmlspecialchars($invoice['order_date']) . "</div>
        </div>
      </div>
    </div>

    <table width='100%' style='border-collapse:collapse;margin-bottom:8px;'>
      <thead>
        <tr style='background:#0f172a;color:#fff;'>
          <th style='padding:10px 8px;text-align:left;font-size:12px;'>#</th>
          <th style='padding:10px 8px;text-align:left;font-size:12px;'>Item</th>
          <th style='padding:10px 8px;text-align:center;font-size:12px;'>HSN</th>
          <th style='padding:10px 8px;text-align:center;font-size:12px;'>Qty</th>
          <th style='padding:10px 8px;text-align:right;font-size:12px;'>Rate</th>
          <th style='padding:10px 8px;text-align:right;font-size:12px;'>Amount</th>
        </tr>
      </thead>
      <tbody>{$itemsRows}</tbody>
      <tfoot>
        <tr><td colspan='5' style='padding:8px;text-align:right;color:#64748b;'>Subtotal</td>
            <td style='padding:8px;text-align:right;'>{$cur}" . number_format($invoice['subtotal'], 2) . "</td></tr>
        {$discountRow}
        <tr><td colspan='5' style='padding:8px;text-align:right;color:#64748b;'>Taxable Value</td>
            <td style='padding:8px;text-align:right;'>{$cur}" . number_format($invoice['taxable_amount'], 2) . "</td></tr>
        {$gstRows}
        <tr><td colspan='5' style='padding:8px;text-align:right;color:#64748b;'>Shipping</td>
            <td style='padding:8px;text-align:right;'>{$shipLabel}</td></tr>
        <tr style='background:#f8fafc;'>
          <td colspan='5' style='padding:14px 8px;text-align:right;font-size:16px;font-weight:700;border-top:2px solid #0f172a;'>Grand Total</td>
          <td style='padding:14px 8px;text-align:right;font-size:16px;font-weight:700;border-top:2px solid #0f172a;'>{$cur}" . number_format($invoice['total'], 2) . "</td></tr>
      </tfoot>
    </table>

    " . ($invoice['notes'] ? "<div style='margin-top:16px;padding:12px;background:#fffbeb;border-radius:6px;font-size:12px;color:#92400e;'><strong>Note:</strong> " . htmlspecialchars($invoice['notes']) . '</div>' : '') . "

    <div style='margin-top:28px;padding-top:16px;border-top:1px dashed #cbd5e1;text-align:center;font-size:12px;color:#64748b;line-height:1.6;'>
      " . htmlspecialchars($s['invoice_footer'] ?? '') . "
      " . ($forEmail ? "<p style='margin-top:12px;'><a href='{$invoiceUrl}' style='color:#3b82f6;'>View &amp; print invoice online</a></p>" : '') . "
      <p style='margin:8px 0 0;font-size:11px;color:#94a3b8;'>This is a computer-generated tax invoice.</p>
    </div>
  </div>
</div>
</body></html>";
}

/** Send tax invoice email to customer for an order. */
function sk_mail_order_invoice(array $order, array $settings = []): bool {
    if (empty($settings)) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }

    $to_email = $order['customer_email'] ?? '';
    $to_name  = $order['customer_name'] ?? ($order['shipping_name'] ?? 'Customer');
    if (empty($to_email)) return false;

    $invoice = sk_invoice_build($order, $settings);
    $subject = 'Tax Invoice ' . $invoice['invoice_no'] . ' – Order ' . $invoice['order_number'];
    $body    = sk_invoice_render_html($invoice, true);

    $CI =& get_instance();
    $CI->load->helper('sk_mailer');
    $sent = sk_send_mail($to_email, $to_name, $subject, $body);

    if ($sent && !empty($order['id'])) {
        $CI->db->where('id', (int)$order['id'])->update('orders', [
            'invoice_emailed_at' => date('Y-m-d H:i:s'),
        ]);
    }

    return $sent;
}

/** Ensure vendor_stores has invoice columns. */
function sk_invoice_ensure_vendor_schema(): void {
    $CI =& get_instance();
    if (!$CI->db->table_exists('vendor_stores')) return;

    $cols = [
        'invoice_prefix' => "VARCHAR(20) DEFAULT 'INV'",
        'invoice_footer' => 'TEXT DEFAULT NULL',
        'pan_no'         => 'VARCHAR(20) DEFAULT NULL',
        'state_code'     => 'VARCHAR(10) DEFAULT NULL',
    ];
    foreach ($cols as $col => $def) {
        if (!$CI->db->field_exists($col, 'vendor_stores')) {
            $CI->db->query("ALTER TABLE `vendor_stores` ADD COLUMN `{$col}` {$def}");
        }
    }

    if (!$CI->db->field_exists('invoice_emailed_at', 'orders')) {
        $CI->db->query('ALTER TABLE `orders` ADD COLUMN `invoice_emailed_at` DATETIME DEFAULT NULL AFTER `updated_at`');
    }
}
