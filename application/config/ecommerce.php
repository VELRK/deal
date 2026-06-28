<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$config['jwt_secret'] = getenv('JWT_SECRET') ?: 'change-me';
$config['razorpay_key_id'] = getenv('RAZORPAY_KEY_ID') ?: 'rzp_test_SkYFquoHU6C56T';
$config['razorpay_key_secret'] = getenv('RAZORPAY_KEY_SECRET') ?: 'NGqs41oM0mA2mVdZZqkUJU67';
$config['razorpay_webhook_secret'] = getenv('RAZORPAY_WEBHOOK_SECRET') ?: '';
$config['smtp_host'] = getenv('SMTP_HOST') ?: '';
$config['smtp_user'] = getenv('SMTP_USER') ?: '';
$config['smtp_pass'] = getenv('SMTP_PASS') ?: '';
