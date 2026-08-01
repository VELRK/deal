<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Send an email using SMTP settings stored in the settings table.
 * Returns true on success, false on failure.
 */
function sk_mailer_settings(): array {
    $CI =& get_instance();
    if (!isset($CI->Sk_Admin_model)) {
        $CI->load->model('Sk_Admin_model');
    }
    return $CI->Sk_Admin_model->get_settings();
}

function sk_mailer_notify_email(array $settings = []): string {
    if (empty($settings)) {
        $settings = sk_mailer_settings();
    }
    return sk_mailer_resolve_from_email($settings);
}

function sk_mailer_email_domain(string $email): string {
    $email = strtolower(trim($email));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return '';
    }
    $parts = explode('@', $email);
    return $parts[1] ?? '';
}

/** Pick a From address that SMTP will accept (must match mailbox domain). */
function sk_mailer_resolve_from_email(array $settings): string {
    $smtpUser = trim($settings['smtp_user'] ?? '');
    $siteEmail = trim($settings['site_email'] ?? '');

    $blockedDomains = ['shopkart.com', 'shopkart.app', 'example.com', 'example.org', 'test.com'];

    $smtpDomain = sk_mailer_email_domain($smtpUser);
    $siteDomain = sk_mailer_email_domain($siteEmail);

    if ($smtpUser !== '' && filter_var($smtpUser, FILTER_VALIDATE_EMAIL) && !in_array($smtpDomain, $blockedDomains, true)) {
        if ($siteEmail !== '' && filter_var($siteEmail, FILTER_VALIDATE_EMAIL)
            && !in_array($siteDomain, $blockedDomains, true)
            && $siteDomain === $smtpDomain) {
            return $siteEmail;
        }
        return $smtpUser;
    }

    if ($siteEmail !== '' && filter_var($siteEmail, FILTER_VALIDATE_EMAIL) && !in_array($siteDomain, $blockedDomains, true)) {
        return $siteEmail;
    }

    return '';
}

/** @return string ssl|tls|empty */
function sk_mailer_smtp_crypto(array $settings): string {
    $explicit = strtolower(trim($settings['smtp_crypto'] ?? ''));
    if (in_array($explicit, ['ssl', 'tls'], true)) {
        return $explicit;
    }
    $port = (int)($settings['smtp_port'] ?? 587);
    return $port === 465 ? 'ssl' : 'tls';
}

/** Human-readable SMTP readiness check (does not send mail). */
function sk_mailer_config_status(array $settings = []): array {
    if (empty($settings)) {
        $settings = sk_mailer_settings();
    }

    $issues = [];
    $warnings = [];
    $host = trim($settings['smtp_host'] ?? '');
    $user = trim($settings['smtp_user'] ?? '');
    $pass = trim($settings['smtp_pass'] ?? '');
    $siteEmail = trim($settings['site_email'] ?? '');
    $from = sk_mailer_resolve_from_email($settings);

    if ($host === '') {
        $issues[] = 'SMTP host is empty.';
    }
    if ($user === '') {
        $issues[] = 'SMTP username is empty.';
    }
    if ($pass === '') {
        $issues[] = 'SMTP password is empty.';
    }
    if ($from === '' || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        $issues[] = 'Set Site Email or SMTP username to a valid mailbox on your domain (not shopkart.com).';
    }

    if ($siteEmail !== '' && $user !== ''
        && filter_var($siteEmail, FILTER_VALIDATE_EMAIL) && filter_var($user, FILTER_VALIDATE_EMAIL)) {
        $siteDomain = sk_mailer_email_domain($siteEmail);
        $userDomain = sk_mailer_email_domain($user);
        if (in_array($siteDomain, ['shopkart.com', 'shopkart.app', 'example.com'], true)) {
            $warnings[] = 'Site Email uses placeholder domain ' . $siteDomain . '. Update General → Site Email to your real mailbox (e.g. info@yourdomain.com). Emails will send from ' . $from . ' until fixed.';
        } elseif ($siteDomain !== $userDomain) {
            $warnings[] = 'Site Email domain (' . $siteDomain . ') differs from SMTP username (' . $userDomain . '). Emails send from ' . $from . '.';
        }
    }

    return [
        'ok'       => empty($issues),
        'issues'   => $issues,
        'warnings' => $warnings,
        'from'     => $from,
        'host'     => $host,
        'port'     => (int)($settings['smtp_port'] ?? 587),
        'crypto'   => sk_mailer_smtp_crypto($settings),
    ];
}

function sk_mailer_last_error(): string {
    $CI =& get_instance();
    return (string)($CI->sk_mailer_last_error ?? '');
}

function sk_mailer_set_last_error(string $message): void {
    $CI =& get_instance();
    $CI->sk_mailer_last_error = $message;
}

function sk_send_mail($to_email, $to_name, $subject, $html_body, array $attachments = []) {
    if (empty($to_email) || strpos($to_email, '@shopkart.app') !== false) {
        sk_mailer_set_last_error('Invalid recipient email.');
        return false;
    }

    $CI =& get_instance();
    $CI->load->library('email');
    $settings = sk_mailer_settings();
    $status   = sk_mailer_config_status($settings);

    if (!$status['ok']) {
        $msg = implode(' ', $status['issues']);
        sk_mailer_set_last_error($msg);
        log_message('info', "sk_mailer: {$msg} Skipping email to {$to_email}");
        return false;
    }

    $smtp_host = $status['host'];
    $smtp_user = trim($settings['smtp_user'] ?? '');
    $smtp_pass = trim($settings['smtp_pass'] ?? '');
    $smtp_port = $status['port'];
    $from_email = $status['from'];
    $from_name  = $settings['smtp_from_name'] ?? ($settings['site_name'] ?? '2DEAL');

    $CI->email->clear(true);
    $CI->email->initialize([
        'useragent'    => 'ShopKart Mailer',
        'protocol'     => 'smtp',
        'smtp_host'    => $smtp_host,
        'smtp_port'    => $smtp_port,
        'smtp_user'    => $smtp_user,
        'smtp_pass'    => $smtp_pass,
        'smtp_crypto'  => $status['crypto'],
        'smtp_timeout' => 20,
        'mailtype'     => 'html',
        'charset'      => 'utf-8',
        'newline'      => "\r\n",
        'crlf'         => "\r\n",
    ]);

    $CI->email->from($from_email, $from_name);
    $CI->email->to($to_email, $to_name);
    $CI->email->subject($subject);
    $CI->email->message($html_body);
    foreach ($attachments as $path) {
        if (is_string($path) && is_file($path)) {
            $CI->email->attach($path);
        }
    }

    $result = $CI->email->send(false);
    if (!$result) {
        $debug = trim(strip_tags($CI->email->print_debugger(['headers'])));
        if (preg_match('/550[^\\n]*Sender address rejected[^\\n]*/i', $debug, $m)) {
            $debug = $m[0] . ' Use the same domain as your SMTP mailbox in Admin → Settings → General (Site Email).';
        }
        sk_mailer_set_last_error($debug !== '' ? $debug : 'SMTP send failed.');
        log_message('error', 'sk_mailer send error: ' . $CI->email->print_debugger(['headers', 'subject', 'body']));
    } else {
        sk_mailer_set_last_error('');
    }
    return $result;
}

/** Build and send an order confirmation email to the customer. */
function sk_mail_order_confirmation($order, $settings = []) {
    $to_email = $order['customer_email'] ?? '';
    $to_name  = $order['customer_name']  ?? 'Customer';
    $subject  = 'Order Confirmed – #' . ($order['order_number'] ?? $order['id']);

    $currency = $settings['currency_symbol'] ?? 'RM';

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

    // Coupon / discount rows
    $coupon_html = '';
    if (($order['discount'] ?? 0) > 0) {
        $CI =& get_instance();
        $CI->load->helper('sk_invoice');
        $orderForDisc = $order;
        $orderForDisc['discount_breakdown'] = sk_order_discount_breakdown($order, $settings);
        $coupon_html = sk_invoice_discount_rows_html($orderForDisc, $currency, '2', 'padding:6px 0;color:#16a34a;');
    }

    $payment_label = strtoupper($order['payment_method'] ?? 'COD');
    $site_name = $settings['site_name'] ?? '2DEAL';

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
        'payment_attempt' => ['label' => 'Payment Attempt',  'color' => '#ea580c', 'icon' => '💳'],
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
    $site_name = $settings['site_name'] ?? '2DEAL';

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
    $site_name = $settings['site_name'] ?? '2DEAL';
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

/** Affiliate forgot password: reset via secure link. */
function sk_mail_affiliate_password_reset(array $affiliate, string $link, array $settings = []) {
    $to_email  = $affiliate['email'] ?? '';
    $to_name   = $affiliate['name'] ?? 'Affiliate';
    $site_name = $settings['site_name'] ?? '2DEAL';
    $safeLink  = htmlspecialchars($link);
    $safeName  = htmlspecialchars($to_name);
    $subject   = 'Reset your Affiliate Portal password – ' . $site_name;

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#065f46;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#a7f3d0;margin:6px 0 0;font-size:13px;'>Affiliate Portal – Password Reset</p>
  </div>
  <div style='padding:36px 32px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$safeName}</strong>,</p>
    <p style='color:#334155;'>We received a request to reset your affiliate account password. Click the button below to choose a new password.</p>
    <div style='text-align:center;margin:28px 0;'>
      <a href='{$safeLink}' style='display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;'>Reset Password</a>
    </div>
    <p style='color:#64748b;font-size:13px;'>This link expires in 1 hour. If you did not request a reset, you can ignore this email.</p>
    <p style='color:#64748b;font-size:13px;'>If the button does not work, copy this URL:<br><span style='word-break:break-all;'>{$safeLink}</span></p>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Affiliate invite: set password via verification link. */
function sk_mail_affiliate_invite($affiliate, $link, $settings = []) {
    $to_email  = $affiliate['email'] ?? '';
    $to_name   = $affiliate['name'] ?? 'Affiliate';
    $site_name = $settings['site_name'] ?? '2DEAL';
    $promo     = htmlspecialchars($affiliate['promo_code'] ?? '');
    $safeLink  = htmlspecialchars($link);
    $safeName  = htmlspecialchars($to_name);
    $subject   = 'Set your Affiliate Portal password – ' . $site_name;

    $promoHtml = $promo
        ? "<p style='color:#334155;'>Your promo code: <strong style='letter-spacing:1px;'>{$promo}</strong></p>"
        : '';

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#065f46;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#a7f3d0;margin:6px 0 0;font-size:13px;'>Affiliate Portal – Welcome</p>
  </div>
  <div style='padding:36px 32px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$safeName}</strong>,</p>
    <p style='color:#334155;'>Your affiliate account has been created. Please set your password to activate login.</p>
    {$promoHtml}
    <div style='text-align:center;margin:28px 0;'>
      <a href='{$safeLink}' style='display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;'>Set Password</a>
    </div>
    <p style='color:#64748b;font-size:13px;'>This link expires in 7 days. If the button does not work, copy this URL:<br><span style='word-break:break-all;'>{$safeLink}</span></p>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Affiliate self-registration: confirmation to applicant (pending approval). */
function sk_mail_affiliate_registration(array $affiliate, array $settings = []) {
    if (empty($settings)) {
        $settings = sk_mailer_settings();
    }
    $to_email  = $affiliate['email'] ?? '';
    $to_name   = $affiliate['name'] ?? 'Affiliate';
    $site_name = $settings['site_name'] ?? '2DEAL';
    $promo     = htmlspecialchars($affiliate['promo_code'] ?? '');
    $loginUrl  = htmlspecialchars(site_url('admin/affiliate/login'));
    $safeName  = htmlspecialchars($to_name);
    $subject   = 'Affiliate registration received – ' . $site_name;

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#065f46;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#a7f3d0;margin:6px 0 0;font-size:13px;'>Affiliate Registration</p>
  </div>
  <div style='padding:36px 32px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$safeName}</strong>,</p>
    <p style='color:#334155;'>Thank you for registering as an affiliate. Your application is <strong>pending admin approval</strong>.</p>
    <p style='color:#334155;'>Your requested promo code: <strong style='letter-spacing:1px;'>{$promo}</strong></p>
    <p style='color:#64748b;font-size:14px;'>We will email you again once your account is approved. After approval you can sign in here:<br><a href='{$loginUrl}'>{$loginUrl}</a></p>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Notify store admin about a new affiliate registration. */
function sk_mail_affiliate_registration_admin(array $affiliate, array $settings = []) {
    if (empty($settings)) {
        $settings = sk_mailer_settings();
    }
    $adminEmail = sk_mailer_notify_email($settings);
    if ($adminEmail === '') {
        return false;
    }

    $site_name = $settings['site_name'] ?? '2DEAL';
    $name  = htmlspecialchars($affiliate['name'] ?? '');
    $email = htmlspecialchars($affiliate['email'] ?? '');
    $phone = htmlspecialchars($affiliate['phone'] ?? '');
    $promo = htmlspecialchars($affiliate['promo_code'] ?? '');
    $adminUrl = htmlspecialchars(site_url('admin/affiliates'));
    $subject = 'New affiliate registration – ' . ($affiliate['name'] ?? 'Applicant');

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='margin:0;padding:20px;background:#f8fafc;font-family:Arial,sans-serif;color:#334155;'>
  <div style='max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e2e8f0;'>
    <h2 style='margin:0 0 16px;color:#0f172a;'>New affiliate registration</h2>
    <p><strong>Name:</strong> {$name}<br>
    <strong>Email:</strong> {$email}<br>
    <strong>Phone:</strong> {$phone}<br>
    <strong>Promo code:</strong> {$promo}</p>
    <p style='margin-top:24px;'><a href='{$adminUrl}' style='background:#059669;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;'>Review in admin</a></p>
    <p style='color:#94a3b8;font-size:13px;margin-top:24px;'>{$site_name}</p>
  </div>
</body>
</html>";

    return sk_send_mail($adminEmail, $site_name . ' Admin', $subject, $body);
}

/** Affiliate approved: notify applicant with promo code and login link. */
function sk_mail_affiliate_approved(array $affiliate, array $settings = []) {
    if (empty($settings)) {
        $settings = sk_mailer_settings();
    }
    $to_email  = $affiliate['email'] ?? '';
    $to_name   = $affiliate['name'] ?? 'Affiliate';
    $site_name = $settings['site_name'] ?? '2DEAL';
    $promo     = htmlspecialchars($affiliate['promo_code'] ?? '');
    $loginUrl  = htmlspecialchars(site_url('admin/affiliate/login'));
    $safeName  = htmlspecialchars($to_name);
    $subject   = 'Affiliate account approved – ' . $site_name;

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#065f46;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#a7f3d0;margin:6px 0 0;font-size:13px;'>Affiliate Approved</p>
  </div>
  <div style='padding:36px 32px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$safeName}</strong>,</p>
    <p style='color:#334155;'>Great news — your affiliate account has been <strong>approved</strong>.</p>
    <p style='color:#334155;'>Your promo code: <strong style='letter-spacing:1px;font-size:18px;'>{$promo}</strong></p>
    <p style='color:#64748b;font-size:14px;'>Share this code at checkout or use your referral link. Sign in to your affiliate dashboard:</p>
    <div style='text-align:center;margin:28px 0;'>
      <a href='{$loginUrl}' style='display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;'>Affiliate Login</a>
    </div>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Affiliate payout paid: notify affiliate that payment was sent. */
function sk_mail_affiliate_payout_paid(array $affiliate, array $payout, array $settings = []) {
    if (empty($settings)) {
        $settings = sk_mailer_settings();
    }
    $to_email  = $affiliate['email'] ?? '';
    $to_name   = $affiliate['name'] ?? 'Affiliate';
    if ($to_email === '') {
        return false;
    }
    $site_name = $settings['site_name'] ?? '2DEAL';
    $currency  = $settings['currency_symbol'] ?? 'RM';
    $amount    = number_format((float)($payout['amount'] ?? 0), 2);
    $ref       = htmlspecialchars($payout['payment_reference'] ?? '');
    $paidAt    = !empty($payout['paid_at']) ? date('d M Y, h:i A', strtotime($payout['paid_at'])) : date('d M Y, h:i A');
    $pending   = number_format((float)($affiliate['pending_commission'] ?? 0), 2);
    $paidTotal = number_format((float)($affiliate['paid_commission'] ?? 0), 2);
    $safeName  = htmlspecialchars($to_name);
    $loginUrl  = htmlspecialchars(site_url('admin/affiliate/login'));
    $subject   = "Payout of {$currency}{$amount} paid – {$site_name}";

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#065f46;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#a7f3d0;margin:6px 0 0;font-size:13px;'>Affiliate Payout Paid</p>
  </div>
  <div style='padding:36px 32px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$safeName}</strong>,</p>
    <p style='color:#334155;'>Your affiliate payout has been <strong>paid</strong>.</p>
    <div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 18px;margin:20px 0;'>
      <p style='margin:0 0 8px;color:#065f46;font-size:14px;'><strong>Amount:</strong> {$currency}{$amount}</p>
      <p style='margin:0 0 8px;color:#065f46;font-size:14px;'><strong>Payment reference:</strong> {$ref}</p>
      <p style='margin:0;color:#065f46;font-size:14px;'><strong>Paid on:</strong> {$paidAt}</p>
    </div>
    <p style='color:#64748b;font-size:14px;margin:0 0 6px;'>Pending balance: <strong>{$currency}{$pending}</strong></p>
    <p style='color:#64748b;font-size:14px;margin:0;'>Total paid to date: <strong>{$currency}{$paidTotal}</strong></p>
    <div style='text-align:center;margin:28px 0 0;'>
      <a href='{$loginUrl}' style='display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;'>Affiliate Login</a>
    </div>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Contact / affiliate enquiry: ack to user + notify admin. */
function sk_mail_contact_enquiry(string $name, string $email, string $message, array $settings = []): array {
    if (empty($settings)) {
        $settings = sk_mailer_settings();
    }
    $site_name = $settings['site_name'] ?? '2DEAL';
    $safeName  = htmlspecialchars($name);
    $safeMsg   = nl2br(htmlspecialchars($message));
    $isAffiliate = stripos($message, 'Affiliate programme enquiry') !== false
        || stripos($message, 'Affiliate program enquiry') !== false;

    $userSubject = ($isAffiliate ? 'Affiliate enquiry received' : 'We received your message') . ' – ' . $site_name;
    $userBody = "
<!DOCTYPE html>
<html><body style='margin:0;padding:20px;background:#f8fafc;font-family:Arial,sans-serif;color:#334155;'>
<div style='max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e2e8f0;'>
  <p>Hi <strong>{$safeName}</strong>,</p>
  <p>Thank you for contacting {$site_name}. We have received your " . ($isAffiliate ? 'affiliate enquiry' : 'message') . " and will get back to you shortly.</p>
  <p style='color:#64748b;font-size:14px;'><strong>Your message:</strong><br>{$safeMsg}</p>
</div>
</body></html>";

    $sentUser = sk_send_mail($email, $name, $userSubject, $userBody);

    $adminEmail = sk_mailer_notify_email($settings);
    $sentAdmin = false;
    if ($adminEmail !== '') {
        $adminSubject = ($isAffiliate ? 'New affiliate enquiry' : 'New contact enquiry') . ' – ' . $name;
        $adminBody = "
<!DOCTYPE html>
<html><body style='margin:0;padding:20px;background:#f8fafc;font-family:Arial,sans-serif;color:#334155;'>
<div style='max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e2e8f0;'>
  <h2 style='margin:0 0 16px;'>{$adminSubject}</h2>
  <p><strong>Name:</strong> {$safeName}<br><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
  <p style='background:#f8fafc;padding:16px;border-radius:8px;'>{$safeMsg}</p>
</div>
</body></html>";
        $sentAdmin = sk_send_mail($adminEmail, $site_name . ' Admin', $adminSubject, $adminBody);
    }

    return ['user' => $sentUser, 'admin' => $sentAdmin];
}
