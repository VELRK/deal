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
$config['whatsapp']['api_key']  = '674e498739ed6b8f2ed24ebdc3b243272776edd10cca20161979f8c72637842b05bab827f1867cd2efb49331993e20b0dc196c48de22694331f722bd079bab53';
$config['whatsapp']['api_url']  = 'https://waadmin.syncr.in/v1/message/send-message';
$config['whatsapp']['from_number'] = '';
$config['whatsapp']['development_mode'] = false;
$config['whatsapp']['template_lang'] = 'en';

/*
| Named body variables used in Askeva/Meta templates, e.g.:
|   Hi {{Customername}}, your order {{OrderName}} has been confirmed...
| Keys must match the template variable names exactly.
*/
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
