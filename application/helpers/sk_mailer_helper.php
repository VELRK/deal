<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Send an email using SMTP settings stored in the settings table.
 * Returns true on success, false on failure.
 */
function sk_send_mail($to_email, $to_name, $subject, $html_body) {
    if (empty($to_email) || strpos($to_email, '@shopkart.app') !== false) {
        return false; // Skip placeholder emails
    }

    $CI =& get_instance();
    $CI->load->library('email');
    $settings = $CI->Sk_Admin_model->get_settings();

    $smtp_host = $settings['smtp_host'] ?? '';
    $smtp_user = $settings['smtp_user'] ?? '';
    $smtp_pass = $settings['smtp_pass'] ?? '';
    $smtp_port = $settings['smtp_port'] ?? 587;
    $from_email = $settings['site_email'] ?? $smtp_user;
    $from_name  = $settings['smtp_from_name'] ?? ($settings['site_name'] ?? 'ShopKart');

    if (!$smtp_host || !$smtp_user || !$smtp_pass) {
        // SMTP not configured — log and bail
        log_message('info', "sk_mailer: SMTP not configured, skipping email to {$to_email}");
        return false;
    }

    $CI->email->initialize([
        'useragent'  => 'ShopKart Mailer',
        'protocol'   => 'smtp',
        'smtp_host'  => $smtp_host,
        'smtp_port'  => (int)$smtp_port,
        'smtp_user'  => $smtp_user,
        'smtp_pass'  => $smtp_pass,
        'smtp_crypto'=> ((int)$smtp_port === 465) ? 'ssl' : 'tls',
        'mailtype'   => 'html',
        'charset'    => 'utf-8',
        'newline'    => "\r\n",
    ]);

    $CI->email->from($from_email, $from_name);
    $CI->email->to($to_email, $to_name);
    $CI->email->subject($subject);
    $CI->email->message($html_body);

    $result = $CI->email->send(false);
    if (!$result) {
        log_message('error', 'sk_mailer send error: ' . $CI->email->print_debugger(['headers', 'subject', 'body']));
    }
    return $result;
}

/** Build and send an order confirmation email to the customer. */
function sk_mail_order_confirmation($order, $settings = []) {
    $to_email = $order['customer_email'] ?? '';
    $to_name  = $order['customer_name']  ?? 'Customer';
    $subject  = 'Order Confirmed – #' . ($order['order_number'] ?? $order['id']);

    $currency = $settings['currency_symbol'] ?? '₹';

    // Build items HTML
    $items_html = '';
    foreach (($order['items'] ?? []) as $item) {
        $line_total = number_format($item['subtotal'] ?? ($item['price'] * $item['quantity']), 2);
        $items_html .= "
        <tr>
          <td style='padding:10px;border-bottom:1px solid #f0f0f0;'>
            <strong>{$item['product_name']}</strong>
          </td>
          <td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:center;'>{$item['quantity']}</td>
          <td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;'>{$currency}" . number_format($item['price'], 2) . "</td>
          <td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold;'>{$currency}{$line_total}</td>
        </tr>";
    }

    // Address block
    $addr_parts = array_filter([
        $order['shipping_name'] ?? '',
        $order['shipping_line1'] ?? '',
        $order['shipping_line2'] ?? '',
        ($order['shipping_city'] ?? '') . (isset($order['shipping_state']) ? ', ' . $order['shipping_state'] : ''),
        ($order['shipping_pincode'] ?? '') . ' – ' . ($order['shipping_country'] ?? 'India'),
        'Phone: ' . ($order['shipping_phone'] ?? ''),
    ]);
    $addr_html = implode('<br>', $addr_parts);

    // Coupon row
    $coupon_html = '';
    if (!empty($order['promo_code']) && $order['discount'] > 0) {
        $coupon_html = "<tr>
          <td colspan='2' style='padding:6px 0;color:#16a34a;'>Coupon ({$order['promo_code']})</td>
          <td style='padding:6px 0;text-align:right;color:#16a34a;'>-{$currency}" . number_format($order['discount'], 2) . "</td>
        </tr>";
    }

    $payment_label = strtoupper($order['payment_method'] ?? 'COD');
    $site_name = $settings['site_name'] ?? 'ShopKart';

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <!-- Header -->
  <div style='background:#0f172a;padding:32px 40px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:24px;letter-spacing:1px;'>{$site_name}</h1>
    <p style='color:#94a3b8;margin:8px 0 0;font-size:14px;'>Order Confirmation</p>
  </div>

  <!-- Body -->
  <div style='padding:40px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$to_name}</strong>,</p>
    <p style='color:#334155;'>Thank you for your order! We have received it and will process it shortly.</p>

    <div style='background:#f1f5f9;border-radius:10px;padding:20px;margin:24px 0;'>
      <div style='display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;'>
        <div>
          <p style='margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;'>Order Number</p>
          <p style='margin:4px 0 0;font-size:18px;font-weight:700;color:#0f172a;'>#{$order['order_number']}</p>
        </div>
        <div>
          <p style='margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;'>Order Date</p>
          <p style='margin:4px 0 0;font-size:15px;color:#334155;'>" . date('d M Y', strtotime($order['created_at'] ?? 'now')) . "</p>
        </div>
        <div>
          <p style='margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;'>Payment</p>
          <p style='margin:4px 0 0;font-size:15px;color:#334155;'>{$payment_label}</p>
        </div>
      </div>
    </div>

    <!-- Items -->
    <h3 style='color:#0f172a;margin-bottom:12px;'>Order Items</h3>
    <table width='100%' style='border-collapse:collapse;'>
      <thead>
        <tr style='background:#f8fafc;'>
          <th style='padding:10px;text-align:left;font-size:13px;color:#64748b;'>Product</th>
          <th style='padding:10px;text-align:center;font-size:13px;color:#64748b;'>Qty</th>
          <th style='padding:10px;text-align:right;font-size:13px;color:#64748b;'>Price</th>
          <th style='padding:10px;text-align:right;font-size:13px;color:#64748b;'>Total</th>
        </tr>
      </thead>
      <tbody>{$items_html}</tbody>
    </table>

    <!-- Totals -->
    <table width='100%' style='margin-top:16px;'>
      <tr>
        <td colspan='2' style='padding:6px 0;color:#64748b;'>Subtotal</td>
        <td style='padding:6px 0;text-align:right;'>{$currency}" . number_format($order['subtotal'] ?? 0, 2) . "</td>
      </tr>
      {$coupon_html}
      <tr>
        <td colspan='2' style='padding:6px 0;color:#64748b;'>Shipping</td>
        <td style='padding:6px 0;text-align:right;'>" . (($order['shipping'] ?? 0) == 0 ? '<span style="color:#16a34a;">Free</span>' : $currency . number_format($order['shipping'] ?? 0, 2)) . "</td>
      </tr>
      <tr>
        <td colspan='2' style='padding:12px 0 6px;font-size:16px;font-weight:700;color:#0f172a;border-top:2px solid #f1f5f9;'>Total</td>
        <td style='padding:12px 0 6px;text-align:right;font-size:16px;font-weight:700;color:#0f172a;border-top:2px solid #f1f5f9;'>{$currency}" . number_format($order['total'] ?? 0, 2) . "</td>
      </tr>
    </table>

    <!-- Delivery Address -->
    <div style='margin-top:32px;padding:20px;border:1px solid #e2e8f0;border-radius:10px;'>
      <h4 style='margin:0 0 12px;color:#0f172a;'>📍 Delivery Address</h4>
      <p style='margin:0;color:#334155;line-height:1.7;font-size:14px;'>{$addr_html}</p>
    </div>

    <p style='margin-top:32px;color:#334155;'>We'll send you another email when your order is shipped. If you have any questions, reply to this email.</p>
    <p style='color:#334155;'>Thank you for shopping with us! 🛍️</p>
  </div>

  <!-- Footer -->
  <div style='background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Send order status update email to customer. */
function sk_mail_order_status($order, $new_status, $settings = []) {
    $to_email = $order['customer_email'] ?? '';
    $to_name  = $order['customer_name']  ?? 'Customer';

    $status_labels = [
        'pending'    => ['label' => 'Order Received',     'color' => '#f59e0b', 'icon' => '⏳'],
        'confirmed'  => ['label' => 'Order Confirmed',    'color' => '#3b82f6', 'icon' => '✅'],
        'processing' => ['label' => 'Processing',         'color' => '#8b5cf6', 'icon' => '🔧'],
        'shipped'    => ['label' => 'Shipped',            'color' => '#06b6d4', 'icon' => '🚚'],
        'delivered'  => ['label' => 'Delivered',          'color' => '#16a34a', 'icon' => '📦'],
        'cancelled'  => ['label' => 'Cancelled',          'color' => '#dc2626', 'icon' => '❌'],
        'returned'   => ['label' => 'Return Requested',   'color' => '#ea580c', 'icon' => '↩️'],
    ];

    $s = $status_labels[$new_status] ?? ['label' => ucfirst($new_status), 'color' => '#64748b', 'icon' => '📋'];
    $subject  = "{$s['icon']} Order #{$order['order_number']} – {$s['label']}";
    $site_name = $settings['site_name'] ?? 'ShopKart';

    $tracking_html = '';
    if (!empty($order['tracking_number'])) {
        $tracking_html = "<p style='margin-top:16px;padding:12px 16px;background:#f1f5f9;border-radius:8px;font-size:14px;'>
          🔍 Tracking Number: <strong>{$order['tracking_number']}</strong>
        </p>";
    }

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#0f172a;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#94a3b8;margin:6px 0 0;font-size:13px;'>Order Update</p>
  </div>
  <div style='padding:36px 32px;'>
    <div style='text-align:center;margin-bottom:28px;'>
      <div style='display:inline-block;background:{$s['color']}1a;border:2px solid {$s['color']};border-radius:50px;padding:10px 28px;'>
        <span style='font-size:18px;font-weight:700;color:{$s['color']};'>{$s['icon']} {$s['label']}</span>
      </div>
    </div>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$to_name}</strong>,</p>
    <p style='color:#334155;'>Your order <strong>#{$order['order_number']}</strong> status has been updated to <strong style='color:{$s['color']};'>{$s['label']}</strong>.</p>
    {$tracking_html}
    <p style='color:#334155;margin-top:24px;'>If you have any questions about your order, please contact our support team.</p>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Send password reset verification code to the user's email. */
function sk_mail_password_reset_code($user, $code, $settings = [], $portalLabel = null) {
    $to_email = $user['email'] ?? '';
    $to_name  = $user['name'] ?? 'Customer';
    $site_name = $settings['site_name'] ?? 'ShopKart';
    $portal = $portalLabel ? htmlspecialchars($portalLabel) : 'Account';
    $subject = 'Password Reset Verification Code – ' . $site_name;

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#0f172a;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#94a3b8;margin:6px 0 0;font-size:13px;'>{$portal} – Password Reset</p>
  </div>
  <div style='padding:36px 32px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$to_name}</strong>,</p>
    <p style='color:#334155;'>Use the verification code below to reset your password. This code expires in <strong>15 minutes</strong>.</p>
    <div style='text-align:center;margin:28px 0;'>
      <div style='display:inline-block;background:#f1f5f9;border:2px dashed #cbd5e1;border-radius:12px;padding:18px 36px;'>
        <span style='font-size:32px;font-weight:700;letter-spacing:8px;color:#0f172a;'>{$code}</span>
      </div>
    </div>
    <p style='color:#64748b;font-size:14px;'>If you did not request a password reset, you can safely ignore this email.</p>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}
