<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Firebase Admin SDK — project deal-bc4c4
|--------------------------------------------------------------------------
|
| Preferred: download the service account JSON from Firebase Console and save it as:
|   application/config/firebase-service-account.json
| (that file is gitignored — do not commit the private key)
|
| Or paste fields below. JSON file wins when present.
|
| How to get the JSON:
| 1. https://console.firebase.google.com/ → project deal-bc4c4
| 2. Project settings (gear) → Service accounts
| 3. "Generate new private key" → save the downloaded file as
|    application/config/firebase-service-account.json on the server
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
    'private_key_id'                 => '',
    'private_key'                    => '',
    'client_email'                   => '',
    'client_id'                      => '',
    'auth_uri'                       => 'https://accounts.google.com/o/oauth2/auth',
    'token_uri'                      => 'https://oauth2.googleapis.com/token',
    'auth_provider_x509_cert_url'    => 'https://www.googleapis.com/oauth2/v1/certs',
    'client_x509_cert_url'           => '',
    'universe_domain'                => 'googleapis.com',
];
