<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| WhatsApp / Askeva Configuration
|--------------------------------------------------------------------------
| Order status notifications use Askeva utility/text messages.
| Token can also be set in Admin → Settings (askeva_api_token).
|
| Create templates from: database/whatsapp_order_templates.txt
| Template names below must match Meta/Askeva exactly.
*/

$config['whatsapp']['provider'] = 'askeva';
$config['whatsapp']['api_key']  = '5c9fbbe16cbd3ec293504d7d4d758e1adf160554f488609ef64df040d05f2176e44afba64867f635ae34fa48c296203707809db18d5b13e2609176cf18642f10';
$config['whatsapp']['api_url']  = 'https://backend.askeva.io/v1/message/send-message';
$config['whatsapp']['from_number'] = '';
$config['whatsapp']['development_mode'] = false;
$config['whatsapp']['template_lang'] = 'en';

/*
| Per-status UTILITY templates ({{1}}=customer name, {{2}}=order number).
| Used automatically when free-text fails with "session not opened".
*/
$config['whatsapp']['status_templates'] = [
    'pending'    => 'order_received',
    'confirmed'  => 'order_confirmed',
    'processing' => 'order_ready_pickup',
    'shipped'    => 'order_shipped',
    'delivered'  => 'order_delivered',
    'cancelled'  => 'order_cancelled',
    'returned'   => 'order_returned',
];

/* Optional single fallback: {{1}}=order number, {{2}}=status label */
$config['whatsapp']['fallback_template'] = 'order_status_update';
