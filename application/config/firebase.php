<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Firebase Admin SDK — project deal-bc4c4
|--------------------------------------------------------------------------
|
| Paste the service account JSON fields from Firebase Console
| (Project settings → Service accounts → Generate new private key).
| Until private_key + client_email are set, FCM send returns a clear error;
| Admin compose / draft still works.
|
| See firebase.php.example for the expected shape.
|
*/

$config['firebase'] = array(
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
);
