<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| WhatsApp / Askeva Configuration
|--------------------------------------------------------------------------
| Order status notifications use Askeva utility/text messages.
| Token can also be set in Admin → Settings (askeva_api_token).
*/

$config['whatsapp']['provider'] = 'askeva';
$config['whatsapp']['api_key']  = '5c9fbbe16cbd3ec293504d7d4d758e1adf160554f488609ef64df040d05f2176e44afba64867f635ae34fa48c296203707809db18d5b13e2609176cf18642f10';
$config['whatsapp']['api_url']  = 'https://backend.askeva.io/v1/message/send-message';
$config['whatsapp']['from_number'] = '';
$config['whatsapp']['development_mode'] = false;
