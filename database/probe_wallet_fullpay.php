<?php
/**
 * Integration probe: wallet full-pay checkout rules against local or remote API.
 * Usage:
 *   php database/probe_wallet_fullpay.php
 *   SK_API_BASE=https://superfinelabels.in/deal/shopkart-api php database/probe_wallet_fullpay.php
 */
$base = rtrim(getenv('SK_API_BASE') ?: 'http://127.0.0.1:8080/deal1/shopkart-api', '/');
$outDir = __DIR__ . '/api_probe';
if (!is_dir($outDir)) {
    mkdir($outDir, 0777, true);
}

function req(string $method, string $url, $body = null, array $headers = []): array {
    $ch = curl_init($url);
    $hdrs = array_merge(['Accept: application/json', 'Content-Type: application/json'], $headers);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => strtoupper($method),
        CURLOPT_HTTPHEADER     => $hdrs,
        CURLOPT_TIMEOUT        => 45,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($body) ? $body : json_encode($body));
    }
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    $json = json_decode((string) $raw, true);
    return [
        'http' => $code,
        'ok'   => $code >= 200 && $code < 300 && is_array($json) && !empty($json['success']),
        'err'  => $err,
        'raw'  => $raw,
        'json' => $json,
    ];
}

function save(string $name, array $res): void {
    global $outDir;
    file_put_contents($outDir . '/' . $name . '.json', json_encode([
        'http' => $res['http'],
        'ok' => $res['ok'],
        'err' => $res['err'],
        'body' => $res['json'] ?? $res['raw'],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$stamp = date('YmdHis');
$email = 'wfull_' . $stamp . '@example.com';
$pass = 'Test@1234';
$phone = '018' . substr($stamp, -7);

echo "API base: $base\n";

$settings = req('GET', $base . '/site-settings');
save('wallet_site_settings', $settings);
echo 'site-settings http=' . $settings['http']
    . ' wallet_free_shipping=' . json_encode($settings['json']['data']['wallet_free_shipping'] ?? null) . "\n";

$reg = req('POST', $base . '/register', [
    'name' => 'Wallet FullPay',
    'email' => $email,
    'password' => $pass,
    'phone' => $phone,
]);
save('wallet_register', $reg);
if (!$reg['ok']) {
    echo "Register failed: " . ($reg['json']['message'] ?? $reg['raw']) . "\n";
    // try login in case user exists
}

$login = req('POST', $base . '/login', ['email' => $email, 'password' => $pass]);
save('wallet_login', $login);
$token = $login['json']['data']['token'] ?? ($reg['json']['data']['token'] ?? '');
if ($token === '') {
    echo "No JWT — abort. login http={$login['http']}\n";
    exit(1);
}
$auth = ['Authorization: Bearer ' . $token];

$wallet = req('GET', $base . '/user/wallet', null, $auth);
save('wallet_get', $wallet);
$w = $wallet['json']['data'] ?? [];
echo 'wallet enabled=' . json_encode($w['enabled'] ?? null)
    . ' balance=' . ($w['balance'] ?? '?')
    . ' free_shipping=' . json_encode($w['free_shipping'] ?? null) . "\n";

// Prefer an in-stock product (API list, then DB fallback)
$products = req('GET', $base . '/products?limit=40');
save('wallet_products', $products);
$productId = null;
$productPrice = null;
$variantId = null;
$list = $products['json']['data']['products'] ?? $products['json']['data'] ?? [];
if (!is_array($list)) {
    $list = [];
}
foreach ($list as $p) {
    if (!is_array($p) || empty($p['id'])) {
        continue;
    }
    $stock = (int)($p['stock'] ?? $p['qty'] ?? 0);
    $price = (float)($p['sale_price'] ?? $p['price'] ?? 0);
    if ($stock < 1 || $price <= 0) {
        continue;
    }
    $productId = (int)$p['id'];
    $productPrice = $price;
    if (!empty($p['variants']) && is_array($p['variants'])) {
        foreach ($p['variants'] as $v) {
            if ((int)($v['stock'] ?? 0) > 0) {
                $variantId = (int)($v['id'] ?? 0) ?: null;
                $productPrice = (float)($v['sale_price'] ?? $v['price'] ?? $price);
                break;
            }
        }
    }
    break;
}
if (!$productId) {
    $m = @new mysqli('127.0.0.1', 'root', '', 'shopkart');
    if (!$m->connect_errno) {
        $r = $m->query("SELECT id, COALESCE(NULLIF(sale_price,0), price) AS p FROM products WHERE status=1 AND stock>0 ORDER BY id DESC LIMIT 1");
        if ($r && ($row = $r->fetch_assoc())) {
            $productId = (int)$row['id'];
            $productPrice = (float)$row['p'];
        }
        $m->close();
    }
}
if (!$productId) {
    echo "No in-stock product found — skip checkout probes.\n";
    exit(0);
}
echo "Using product #$productId price=$productPrice variant=" . json_encode($variantId) . "\n";

$userId = (int)($login['json']['data']['user']['id'] ?? $reg['json']['data']['user']['id'] ?? 0);

$addr = [
    'full_name' => 'Wallet Tester',
    'phone' => $phone,
    'line1' => '12 Jalan Test',
    'line2' => '',
    'city' => 'Kuala Lumpur',
    'state' => 'Wilayah Persekutuan',
    'pincode' => '50000',
    'country' => 'Malaysia',
];

function ensure_cart(string $base, array $auth, int $productId, $variantId): array {
    req('POST', $base . '/cart/clear', new stdClass(), $auth);
    $payload = ['product_id' => $productId, 'quantity' => 1];
    if ($variantId) {
        $payload['variant_id'] = $variantId;
    }
    return req('POST', $base . '/cart/add', $payload, $auth);
}

$add = ensure_cart($base, $auth, $productId, $variantId);
save('wallet_cart_add', $add);
if (!$add['ok']) {
    echo "Cart add failed: " . ($add['json']['message'] ?? $add['raw']) . "\n";
    exit(1);
}

// Underfunded wallet should fail (balance typically 0)
$fail = req('POST', $base . '/checkout', [
    'payment_method' => 'wallet',
    'billing_same' => true,
    'address' => $addr,
], $auth);
save('wallet_checkout_underfunded', $fail);
$underOk = empty($fail['json']['success']) && stripos((string)($fail['json']['message'] ?? ''), 'wallet') !== false;
echo 'underfunded checkout http=' . $fail['http']
    . ' success=' . json_encode($fail['json']['success'] ?? null)
    . ' wallet_msg=' . json_encode($underOk)
    . ' msg=' . ($fail['json']['message'] ?? '') . "\n";

// Partial path: razorpay + use_wallet must NOT debit wallet
ensure_cart($base, $auth, $productId, $variantId);
$partial = req('POST', $base . '/checkout', [
    'payment_method' => 'razorpay',
    'use_wallet' => 1,
    'billing_same' => true,
    'address' => $addr,
], $auth);
save('wallet_checkout_partial_ignored', $partial);
$pdata = $partial['json']['data'] ?? [];
$pm = $pdata['order']['payment_method'] ?? $pdata['payment_method'] ?? null;
$wAmt = $pdata['order']['wallet_amount'] ?? $pdata['wallet_amount'] ?? 0;
$needsPay = !empty($pdata['payment']) || !empty($pdata['razorpay_order_id']) || (($pdata['order']['payment_status'] ?? '') === 'pending');
echo 'razorpay+use_wallet http=' . $partial['http']
    . ' success=' . json_encode($partial['json']['success'] ?? null)
    . ' payment_method=' . json_encode($pm)
    . ' wallet_amount=' . json_encode($wAmt)
    . ' gateway=' . json_encode($needsPay || !empty($pdata['payment'])) . "\n";

// Funded full wallet pay (credit via DB, then checkout — no gateway)
$creditRm = max(500.0, (float)$productPrice + 100);
$userId = $userId ?: (int)($login['json']['data']['id'] ?? 0);
if ($userId <= 0) {
    // decode JWT payload (middle segment) for sub/user id if present
    $parts = explode('.', $token);
    if (count($parts) >= 2) {
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        $userId = (int)($payload['user_id'] ?? $payload['sub'] ?? $payload['id'] ?? 0);
    }
}
$m = @new mysqli('127.0.0.1', 'root', '', 'shopkart');
if ($m->connect_errno || $userId <= 0) {
    echo "Skip funded checkout (db/user). userId=$userId\n";
} else {
    $m->query("INSERT INTO customer_wallets (user_id, balance, created_at, updated_at)
        VALUES ($userId, 0, NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at=NOW()");
    $m->query("UPDATE customer_wallets SET balance = " . number_format($creditRm, 2, '.', '') . ", updated_at=NOW() WHERE user_id=$userId");
    $m->close();
    echo "Credited wallet user#$userId with RM $creditRm\n";

    $wallet2 = req('GET', $base . '/user/wallet', null, $auth);
    save('wallet_get_funded', $wallet2);
    echo 'funded balance=' . ($wallet2['json']['data']['balance'] ?? '?') . "\n";

    ensure_cart($base, $auth, $productId, $variantId);
    $ok = req('POST', $base . '/checkout', [
        'payment_method' => 'wallet',
        'billing_same' => true,
        'address' => $addr,
    ], $auth);
    save('wallet_checkout_funded', $ok);
    $od = $ok['json']['data']['order'] ?? $ok['json']['data'] ?? [];
    echo 'funded wallet checkout http=' . $ok['http']
        . ' success=' . json_encode($ok['json']['success'] ?? null)
        . ' payment_method=' . json_encode($od['payment_method'] ?? null)
        . ' payment_status=' . json_encode($od['payment_status'] ?? null)
        . ' shipping=' . json_encode($od['shipping'] ?? null)
        . ' wallet_amount=' . json_encode($od['wallet_amount'] ?? null)
        . ' has_gateway=' . json_encode(!empty($ok['json']['data']['payment']))
        . ' msg=' . ($ok['json']['message'] ?? '') . "\n";
}

echo "Done. Responses in database/api_probe/wallet_*.json\n";
