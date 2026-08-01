<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Format DB datetime strings in app timezone (Asia/Kolkata).
 * Treats naive MySQL DATETIME as already-local wall clock (written via date()).
 */
if (!function_exists('sk_format_datetime')) {
    function sk_format_datetime($value, string $format = 'd M Y, h:i A'): string {
        if ($value === null || $value === '' || $value === '0000-00-00 00:00:00') {
            return '—';
        }
        $tz = new DateTimeZone(date_default_timezone_get() ?: 'Asia/Kolkata');
        try {
            if ($value instanceof DateTimeInterface) {
                $dt = DateTimeImmutable::createFromInterface($value)->setTimezone($tz);
            } else {
                $raw = trim((string)$value);
                // ISO with Z / offset → convert into app TZ
                if (preg_match('/[Zz]|[+\-]\d{2}:?\d{2}$/', $raw)) {
                    $dt = new DateTimeImmutable($raw);
                    $dt = $dt->setTimezone($tz);
                } else {
                    $dt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $raw, $tz)
                        ?: DateTimeImmutable::createFromFormat('Y-m-d', $raw, $tz)
                        ?: new DateTimeImmutable($raw, $tz);
                }
            }
            return $dt->format($format);
        } catch (Throwable $e) {
            $ts = strtotime((string)$value);
            return $ts ? date($format, $ts) : '—';
        }
    }
}

if (!function_exists('sk_format_date')) {
    function sk_format_date($value, string $format = 'd M Y'): string {
        return sk_format_datetime($value, $format);
    }
}
