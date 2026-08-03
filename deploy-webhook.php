<?php
/**
 * HTTPS deploy webhook for Hostinger (called by GitHub Actions).
 *
 * Why: GitHub runners often cannot open SSH to Hostinger :65002 (i/o timeout).
 * This script runs ON the server and pulls main over git (outbound HTTPS), which works.
 *
 * Setup (once):
 * 1. Put the same random token in GitHub secret DEPLOY_WEBHOOK_TOKEN
 *    and in application/config/deploy_webhook_secret.php (see .example file).
 * 2. Optional GitHub secret DEPLOY_WEBHOOK_URL =
 *    https://superfinelabels.in/deal/deploy-webhook.php
 * 3. Ensure this file is live on the server (manual upload / one SSH pull).
 * 4. Re-run the failed GitHub Action (workflow_dispatch) or push to main.
 */
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo "Method not allowed. Use POST.\n";
    exit;
}

$token = (string)($_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? '');
if ($token === '' && isset($_POST['token'])) {
    $token = (string)$_POST['token'];
}

$expected = '';
$secretFile = __DIR__ . '/application/config/deploy_webhook_secret.php';
if (is_file($secretFile)) {
    $loaded = include $secretFile;
    if (is_string($loaded)) {
        $expected = $loaded;
    } elseif (is_array($loaded) && isset($loaded['token'])) {
        $expected = (string)$loaded['token'];
    }
}

if ($expected === '' || $token === '' || !hash_equals($expected, $token)) {
    http_response_code(401);
    echo "Unauthorized.\n";
    exit;
}

$root = __DIR__;
if (!is_dir($root . '/.git')) {
    http_response_code(500);
    echo "No .git directory at deploy root: {$root}\n";
    echo "Initialize git on the server once, then retry.\n";
    exit;
}

$commands = [
    'git remote set-url origin https://github.com/VELRK/deal.git',
    'git fetch origin main',
    'git reset --hard origin/main',
    'git rev-parse --short HEAD',
];

$lines = [];
$failed = false;
foreach ($commands as $cmd) {
    $lines[] = '$ ' . $cmd;
    $output = [];
    $code = 0;
    exec('cd ' . escapeshellarg($root) . ' && ' . $cmd . ' 2>&1', $output, $code);
    $lines = array_merge($lines, $output);
    if ($code !== 0) {
        $failed = true;
        $lines[] = "ERROR: exit code {$code}";
        break;
    }
}

$body = implode("\n", $lines) . "\n";
if ($failed) {
    http_response_code(500);
    echo "Deploy failed.\n" . $body;
    exit;
}

http_response_code(200);
echo "Deploy OK.\n" . $body;
exit;
