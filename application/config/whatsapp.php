<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| WhatsApp / Syncr (waadmin) Configuration
|--------------------------------------------------------------------------
| Order status + OTP use Syncr send-message API:
|   POST https://waadmin.syncr.in/v1/message/send-message?token=...
|
| Token can also be set in Admin → Settings (askeva_api_token — same field).
| Create templates from: database/whatsapp_order_templates.txt
| Template names below must match Meta/Syncr exactly.
*/

$config['whatsapp']['provider'] = 'syncr';
$config['whatsapp']['api_key']  = 'f20a70ac7131c40762b928155d4ebc1c6115d88041e0f9611c085d8e8f6c22200be15ba0a45f2dd2404a242a2e4b237b9634dbac8e517b8e8b97177e99946481';
$config['whatsapp']['api_url']  = 'https://waadmin.syncr.in/v1/message/send-message';
$config['whatsapp']['from_number'] = '';
$config['whatsapp']['development_mode'] = false;
$config['whatsapp']['template_lang'] = 'en';

/*
| Parameter style for template body vars:
|   positional — {{1}}, {{2}} (Syncr/Meta classic; preferred)
|   named      — {{Customername}}, {{OrderName}} + parameter_name in API
|   auto       — try positional, then named if Syncr rejects
*/
$config['whatsapp']['template_param_mode'] = 'auto';

/* Used only when mode is named (or auto fallback to named). */
$config['whatsapp']['template_param_names'] = [
    'customer' => 'Customername',
    'order'    => 'OrderName',
];

/*
| Per-status UTILITY templates (Customername + OrderName).
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

/* Optional single fallback. Leave empty if unused. */
$config['whatsapp']['fallback_template'] = '';

/*
| TESTING: force every WhatsApp send to this number (digits only, country code included).
| Set empty string '' to send to the real customer phone again.
*/
$config['whatsapp']['test_force_phone'] = '';
