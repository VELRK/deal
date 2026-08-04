<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Firebase Admin SDK — project deal-bc4c4
|--------------------------------------------------------------------------
|
| Loads application/config/firebase-service-account.json when present;
| otherwise uses the embedded service account below (Hostinger deploy).
|
*/

$firebaseSaPath = APPPATH . 'config/firebase-service-account.json';
$firebaseFromJson = [];

if (is_file($firebaseSaPath)) {
    $raw = @file_get_contents($firebaseSaPath);
    $decoded = is_string($raw) ? json_decode($raw, true) : null;
    if (is_array($decoded) && !empty($decoded['private_key']) && !empty($decoded['client_email'])) {
        $firebaseFromJson = [
            'project_id'                  => (string)($decoded['project_id'] ?? 'deal-bc4c4'),
            'private_key_id'              => (string)($decoded['private_key_id'] ?? ''),
            'private_key'                 => (string)$decoded['private_key'],
            'client_email'                => (string)$decoded['client_email'],
            'client_id'                   => (string)($decoded['client_id'] ?? ''),
            'auth_uri'                    => (string)($decoded['auth_uri'] ?? 'https://accounts.google.com/o/oauth2/auth'),
            'token_uri'                   => (string)($decoded['token_uri'] ?? 'https://oauth2.googleapis.com/token'),
            'auth_provider_x509_cert_url' => (string)($decoded['auth_provider_x509_cert_url'] ?? 'https://www.googleapis.com/oauth2/v1/certs'),
            'client_x509_cert_url'        => (string)($decoded['client_x509_cert_url'] ?? ''),
            'universe_domain'             => (string)($decoded['universe_domain'] ?? 'googleapis.com'),
        ];
    }
}

$config['firebase'] = $firebaseFromJson ?: [
    'project_id'                     => 'deal-bc4c4',
    'private_key_id'                 => '6e5b38f6613b6cf823d806bd93d3250732450d3b',
    'private_key'                    => "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjDb01QhoJmxkI\nAK6Zp0Mwc9N6QBAyKKPAQLJ0nH+Awi3QnjcEkv9/VJTTW5vJo+Z/s+iMvawxZ3Eb\n3/9HzunuPODj1gzsTDzfGXzAGZfW7/xLp+EKVwMLNzXP3NcQadqBrGmwQc9yPAuG\nH2rV6nKUE6TocYg9Kali+WBy28EXvYUH1a0j0aFGJS2l26UNFIhiXt9tBnWEgIWn\n+pwoEJ0BK0Wa42h4oksyhp+SWj1R+AvOB1X3MxUuUzU4jY9anZr0WElL9tEwSXpE\nJfdmgXnSwHp7QwKWxPLMmsDx0SaHdZJ7Sc6+4Y2dqGrpdQDJ6Bc5IYdG8nTttfQL\nyik5jbl1AgMBAAECggEAIteRfiMzJajVEzr0FGTjzGN/xfCRFWrOPQuGJrl3XHgB\n6sGYP5u6yYZ1K+n4MwEZROIYmBSCymbQinSV3A4Yul4bb0wi5E6RNlo/qFv/sIAF\nMVR9F+TKg3fHgbSu5zS7arjBN9cEQWSX0M//WBk6ZS6Cb2ItSuaPadUgmUKgsxXm\nw/fR3UPj99sYVWMvA3CICSxxx4awr+t0tMolYqNnEDBaejmoDKq796O8VazOQ/Vg\nEMWBUDjDe87OSBqo4Y7MUbjPUoSDJTohgL1Ej50etDCrK5SdhZVPWK0HbEZv1jSw\n7lEMxaj0jFWl3WeN4uQP9/OwbnV1UntpgXUiA7eRMQKBgQDVhLYSLSY2UM/hNUhP\ny8w2/agjV2XhHNZID+7tly9zNArD4//5I7Lol3lWfLnit2VFisNrENJj05B+P93R\nixNUvUNs+vfC3ki4WreW2U9Rb/6ujU7m8KMOLtMlhdCZyrmqczAXVh4AtWx6NWTs\neAg3fhkUIlBMrf5rx7OcoysUMQKBgQDDfquxoSCilb68MPgouhKK74UgtUvBftr3\n+Vgx5QNoUVlT2kRpJIF5Jb1jTxsVXg8QwHJTJcWb+FI54cTQbf1ElVKQgv7ewpXf\nq3TaG5AoXvdZ1E0fE9IvBFDAk0jCSVACgE1R2ZW7YRJTjWpa7+X5E2aooyXcVRwM\n8h8yOgz8hQKBgGWI94ALQlmf8kr5KIrxsgoQc61iuUrkiK26Dfej5meVPu1KdgZG\nyKQ8q/HJ3CeI6Lq6MxWt6S6Zg+PVgSlNRoMMgYzIh5t+Uvx//z/X1RU3+deN0RCX\nLCLpd3Unfjw0IDiDEEJ4rEnP/GbdD0I4Dkg9SbW+X4snTo54Z9w755dxAoGANutf\n+n/EdkhRE/dBz9cuHF/ba2vjA1HK2/ztXN70TRsFWDwqGcuKn+kNQlfXyPHqk48s\nztT+palmGCKnstIjY1/7mONkDFpn1jUJl7hEkELVhCPTIpbj5hd1RBRcTVBhLMK0\ndfkFSmWjy1sf9LoORiHAJkHnAfXa8nwWbXrHaS0CgYEAsLYTEIcdZ3/38Jv9inu/\nWE5sO/Fkvc5nP3rF10/TfUgb3mA1Ng2vW5E2PkxjLGRiA5jTvl0l+/KBF/EZIOHa\nLSFVf0ih8BCZ7BsCj/tszk9mBwoe5ZE70jUXpSrYMb4/FMqIgJRvkZ+8c5Hw52+B\nKq/lM5uRV7/5G32KjWQ3oKE=\n-----END PRIVATE KEY-----\n",
    'client_email'                   => 'firebase-adminsdk-fbsvc@deal-bc4c4.iam.gserviceaccount.com',
    'client_id'                      => '109313511132500571501',
    'auth_uri'                       => 'https://accounts.google.com/o/oauth2/auth',
    'token_uri'                      => 'https://oauth2.googleapis.com/token',
    'auth_provider_x509_cert_url'    => 'https://www.googleapis.com/oauth2/v1/certs',
    'client_x509_cert_url'           => 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40deal-bc4c4.iam.gserviceaccount.com',
    'universe_domain'                => 'googleapis.com',
];
