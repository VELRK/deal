<?php
/**
 * Front controller for clean /admin/* URLs (no index.php in the browser).
 * Apache runs this file for /admin/login etc.; CodeIgniter reads REQUEST_URI.
 */
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
require dirname(__DIR__) . '/index.php';
