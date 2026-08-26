<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * JT Express Malaysia Open Platform — API base URLs only.
 * Credentials (api account, private key, customer code, password, sender)
 * are stored in the settings table and edited in Admin → Settings → Shipping.
 * No secrets are hardcoded here.
 */
$config['jt_express'] = [
    'api_urls' => [
        'sandbox'    => 'https://demoopenapi.jtexpress.my/webopenplatformapi',
        'production' => 'https://ylopenapi.jtexpress.my/webopenplatformapi',
    ],
];
