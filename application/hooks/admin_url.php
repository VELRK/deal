<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Keep admin panel URLs under /admin instead of legacy /shopkart paths.
 */
function redirect_shopkart_panel_to_admin()
{
    $CI  =& get_instance();
    $uri = $CI->uri->uri_string();

    // Never touch the JSON API.
    if (strpos($uri, 'shopkart-api') === 0) {
        return;
    }

    if ($uri === 'shopkart') {
        redirect('admin', 'location', 302);
    }

    if (strpos($uri, 'shopkart/') === 0) {
        redirect('admin/' . substr($uri, 9), 'location', 302);
    }
}
