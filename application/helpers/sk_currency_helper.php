<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Application currency symbol (display). Default: RM (Malaysia).
 */
if (!function_exists('sk_currency_symbol')) {
    function sk_currency_symbol(?array $settings = null): string {
        if ($settings === null) {
            $CI =& get_instance();
            if (isset($CI->sk_settings) && is_array($CI->sk_settings)) {
                $settings = $CI->sk_settings;
            } elseif (method_exists($CI, 'get_settings')) {
                $settings = $CI->get_settings();
            } else {
                $settings = [];
            }
        }
        $sym = trim((string)($settings['currency_symbol'] ?? ''));
        // Normalize legacy India symbols to RM
        if ($sym === '' || $sym === '₹' || strcasecmp($sym, 'Rs') === 0
            || strcasecmp($sym, 'Rs.') === 0 || strcasecmp($sym, 'INR') === 0) {
            return 'RM';
        }
        return $sym;
    }
}

if (!function_exists('sk_money')) {
    /** Format amount with currency symbol, e.g. RM1,234.00 */
    function sk_money($amount, ?array $settings = null, int $decimals = 2): string {
        return sk_currency_symbol($settings) . number_format((float)$amount, $decimals);
    }
}
