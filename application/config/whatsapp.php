<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| WhatsApp Configuration
|--------------------------------------------------------------------------
|
| Configure your WhatsApp API provider settings here
|
*/

// Provider options: 'gupshup', 'twilio', 'wati', '360dialog', 'messagebird', 'syncr', 'waadmin'
$config['whatsapp']['provider'] = 'syncr'; // or 'waadmin'

// API Key/Token (get from your WhatsApp API provider)
// For Syncr/WAAdmin: Your token from waadmin.syncr.in
$config['whatsapp']['api_key'] = '7fb0608e5260b2b542e729927a233b5a47100911028e51dfc481719a3fa5a5bba98ec5127f49547965dacfc3602c8228aa56ec758433dda3abe16ae217e2ae09';

// API URL (optional, will use default if not provided)
// For Syncr/WAAdmin: https://waadmin.syncr.in/v1/message/send-message
// For Gupshup: https://api.gupshup.io/sm/api/v1/msg
$config['whatsapp']['api_url'] = 'https://waadmin.syncr.in/v1/message/send-message';

// From/WhatsApp Business Number (your registered WhatsApp Business number)
$config['whatsapp']['from_number'] = '919790919412';

// Development Mode (set to true to skip actual WhatsApp sending and show cURL command)
// When true: OTP will be returned in response and cURL command will be shown (for testing)
// When false: OTP will be sent via WhatsApp API (production mode)
$config['whatsapp']['development_mode'] = true;

/*
|--------------------------------------------------------------------------
| Provider-Specific Configuration
|--------------------------------------------------------------------------
|
| For Twilio:
| - provider: 'twilio'
| - api_key: Your Twilio Account SID
| - api_url: Your Twilio Auth Token (using api_url field for auth token)
| - from_number: Your Twilio WhatsApp number (e.g., +14155238886)
|
| For Gupshup:
| - provider: 'gupshup'
| - api_key: Your Gupshup API Key
| - api_url: https://api.gupshup.io/sm/api/v1/msg (default)
| - from_number: Your Gupshup WhatsApp Business number
|
| For Wati.io:
| - provider: 'wati'
| - api_key: Your Wati API Token
| - api_url: https://api.wati.io/v1/sendSessionMessage/{phone}
| - from_number: Not required
|
| For 360dialog:
| - provider: '360dialog'
| - api_key: Your 360dialog API Key
| - api_url: https://waba-api.360dialog.io/v1/messages (default)
| - from_number: Not required
|
| For MessageBird:
| - provider: 'messagebird'
| - api_key: Your MessageBird Access Key
| - api_url: Not required
| - from_number: Your MessageBird WhatsApp number
|
*/

