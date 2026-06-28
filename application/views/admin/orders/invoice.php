<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$CI =& get_instance();
$CI->load->helper('sk_invoice');
$invoice = sk_invoice_build($order, $settings ?? []);
echo sk_invoice_render_html($invoice, false);
