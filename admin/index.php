<?php
/**
 * /admin bridge — boot main CodeIgniter front controller.
 * Ensures /admin and /admin/ work when directory index is requested.
 */
$_SERVER['SCRIPT_NAME'] = '/index.php';
require dirname(__DIR__) . '/index.php';
