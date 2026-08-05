<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$config['jwt_secret'] = getenv('JWT_SECRET') ?: 'change-me';
$config['razorpay_key_id'] = getenv('RAZORPAY_KEY_ID') ?: 'rzp_test_TM5k4dP1CIF3dX';
$config['razorpay_key_secret'] = getenv('RAZORPAY_KEY_SECRET') ?: '0n187EabAyE0VyJKy9C5UMfw';
$config['razorpay_webhook_secret'] = getenv('RAZORPAY_WEBHOOK_SECRET') ?: '';
$config['smtp_host'] = getenv('SMTP_HOST') ?: '';
$config['smtp_user'] = getenv('SMTP_USER') ?: '';
$config['smtp_pass'] = getenv('SMTP_PASS') ?: '';
