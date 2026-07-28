<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * JT Express Malaysia Open Platform credentials.
 *
 * Production values are fixed here and shown read-only in Admin → Settings.
 * When Sandbox is OFF, the library always uses $config['jt_express']['production'].
 * Sandbox credentials remain editable in Settings (DB).
 */
$config['jt_express'] = [
    'api_urls' => [
        'sandbox'    => 'https://demoopenapi.jtexpress.my/webopenplatformapi',
        'production' => 'https://ylopenapi.jtexpress.my/webopenplatformapi',
    ],

    'sandbox' => [
        'api_account'       => '640826271705595946',
        'private_key'       => '8e88c8477d4e4939859c560192fcafbc',
        'customer_code'     => 'ITTEST0001',
        'customer_name'     => 'ITTEST0001',
        'customer_password' => 'Sfx6H8d4',
        'demo_uuid'         => '5ba402abcfdc4dff9cb1c589afcf9682',
    ],

    'production' => [
        'api_account'       => '838338320232973056',
        'private_key'       => 'c1fe13bc3f7642fd96297248a80533d5',
        'customer_code'     => 'JTMY024627',
        'customer_name'     => 'JTMY024627',
        // Pre-hashed Open Platform password (Firestore app_data/hash.password) — do not re-hash.
        'customer_password' => '06F4B84632C34F6476EAB9F872587660',
        'demo_uuid'         => '',
        'sender_name'       => 'Golden2Deal (M) Sdn Bhd',
        'sender_phone'      => '60123235454',
        'sender_address'    => 'Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A, Kawasan Industri Taman Bukit Maluri, 52100 Kepong Kuala Lumpur.',
        'sender_city'       => 'Kuala Lumpur',
        'sender_state'      => 'Wilayah Persekutuan',
        'sender_postcode'   => '52100',
    ],
];
