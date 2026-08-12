<?php
/**
 * Front controller for clean /shopkart-api/* URLs (no index.php in the browser).
 */
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
require dirname(__DIR__) . '/index.php';
