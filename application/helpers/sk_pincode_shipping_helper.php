<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Pincode shipping scenarios (do not change default / old-area behaviour):
 *  1. blocked     — existing non-delivery From–To ranges
 *  2. extra_charge — per-area extra fee; free when cart >= that area's free_above
 *  3. default     — global shipping_charge + free_shipping_above
 */

if (!function_exists('sk_pincode_int')) {
    function sk_pincode_int($pincode): ?int {
        $raw = preg_replace('/\D+/', '', (string)$pincode);
        if ($raw === '') {
            return null;
        }
        return (int)$raw;
    }
}

if (!function_exists('sk_pincode_in_range')) {
    function sk_pincode_in_range(int $pin, int $from, int $to): bool {
        if ($to < $from) {
            [$from, $to] = [$to, $from];
        }
        return $pin >= $from && $pin <= $to;
    }
}

if (!function_exists('sk_pincode_parse_block_ranges')) {
    /** @return array<int, array{from:int,to:int}> */
    function sk_pincode_parse_block_ranges($raw): array {
        if (is_array($raw)) {
            $list = [];
            foreach ($raw as $row) {
                if (!is_array($row)) {
                    continue;
                }
                $from = isset($row['from']) ? (int)$row['from'] : 0;
                $to   = isset($row['to']) ? (int)$row['to'] : $from;
                if ($from <= 0 && $to <= 0) {
                    continue;
                }
                if ($to < $from) {
                    [$from, $to] = [$to, $from];
                }
                $list[] = ['from' => $from, 'to' => $to];
            }
            return $list;
        }

        $text = trim((string)$raw);
        if ($text === '') {
            return [];
        }
        $list = [];
        $parts = preg_split('/[\r\n,;]+/', $text);
        foreach ($parts as $part) {
            $token = trim((string)$part);
            if ($token === '') {
                continue;
            }
            if (preg_match('/^\s*(\d+)\s*(?:to|-)\s*(\d+)\s*$/i', $token, $m)) {
                $start = (int)$m[1];
                $end   = (int)$m[2];
                if ($end < $start) {
                    [$start, $end] = [$end, $start];
                }
                $list[] = ['from' => $start, 'to' => $end];
                continue;
            }
            if (preg_match('/^\s*(\d+)\s*$/', $token, $m)) {
                $n = (int)$m[1];
                $list[] = ['from' => $n, 'to' => $n];
            }
        }
        return $list;
    }
}

if (!function_exists('sk_pincode_parse_extra_ranges')) {
    /**
     * @return array<int, array{from:int,to:int,extra_charge:float,free_above:float}>
     */
    function sk_pincode_parse_extra_ranges($raw): array {
        $rows = [];
        if (is_array($raw)) {
            $rows = $raw;
        } else {
            $text = trim((string)$raw);
            if ($text === '') {
                return [];
            }
            $decoded = json_decode($text, true);
            if (!is_array($decoded)) {
                return [];
            }
            $rows = $decoded;
        }

        $list = [];
        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }
            $from = isset($row['from']) ? (int)$row['from'] : 0;
            $to   = isset($row['to']) ? (int)$row['to'] : $from;
            if ($from <= 0 && $to <= 0) {
                continue;
            }
            if ($to < $from) {
                [$from, $to] = [$to, $from];
            }
            $list[] = [
                'from'         => $from,
                'to'           => $to,
                'extra_charge' => round((float)($row['extra_charge'] ?? 0), 2),
                'free_above'   => round((float)($row['free_above'] ?? 0), 2),
            ];
        }
        return $list;
    }
}

if (!function_exists('sk_pincode_encode_extra_ranges')) {
    function sk_pincode_encode_extra_ranges(array $ranges): string {
        $clean = sk_pincode_parse_extra_ranges($ranges);
        return $clean === [] ? '' : json_encode($clean);
    }
}

if (!function_exists('sk_pincode_is_blocked')) {
    function sk_pincode_is_blocked($pincode, $settings): bool {
        $pin = sk_pincode_int($pincode);
        if ($pin === null) {
            return false;
        }
        $ranges = sk_pincode_parse_block_ranges($settings['non_delivery_pincode_ranges'] ?? '');
        foreach ($ranges as $range) {
            if (sk_pincode_in_range($pin, (int)$range['from'], (int)$range['to'])) {
                return true;
            }
        }
        return false;
    }
}

if (!function_exists('sk_pincode_match_extra')) {
    /** @return array{from:int,to:int,extra_charge:float,free_above:float}|null */
    function sk_pincode_match_extra($pincode, $settings): ?array {
        $pin = sk_pincode_int($pincode);
        if ($pin === null) {
            return null;
        }
        $ranges = sk_pincode_parse_extra_ranges($settings['pincode_extra_charge_ranges'] ?? '');
        foreach ($ranges as $range) {
            if (sk_pincode_in_range($pin, (int)$range['from'], (int)$range['to'])) {
                return $range;
            }
        }
        return null;
    }
}

if (!function_exists('sk_pincode_shipping_quote')) {
    /**
     * Quote shipping for a pincode + goods amount (after promo).
     * Empty pincode keeps the old global shipping / free-above rules.
     *
     * @return array{
     *   pincode:?string,deliverable:bool,scenario:string,shipping:float,
     *   base_charge:float,extra_charge:float,charged_shipping:float,
     *   free_eligible:bool,free_threshold:float,amount_remaining:float,
     *   matched_range:?array,currency:string,message:?string
     * }
     */
    function sk_pincode_shipping_quote($pincode, $goodsAmount, array $settings): array {
        $goods = round(max(0, (float)$goodsAmount), 2);
        $base  = (float)($settings['shipping_charge'] ?? 50);
        $globalFree = (float)($settings['free_shipping_above'] ?? 999);
        $symbol = function_exists('sk_currency_symbol') ? sk_currency_symbol($settings) : 'RM';
        $pinRaw = trim((string)$pincode);
        $pinRaw = $pinRaw === '' ? null : $pinRaw;

        $out = [
            'pincode'          => $pinRaw,
            'deliverable'      => true,
            'scenario'         => 'default',
            'shipping'         => 0.0,
            'base_charge'      => $base,
            'extra_charge'     => 0.0,
            'charged_shipping' => $base,
            'free_eligible'    => false,
            'free_threshold'   => $globalFree,
            'amount_remaining' => 0.0,
            'matched_range'    => null,
            'currency'         => $symbol,
            'message'          => null,
        ];

        if ($goods <= 0) {
            $out['message'] = null;
            return $out;
        }

        if ($pinRaw !== null && sk_pincode_is_blocked($pinRaw, $settings)) {
            $out['deliverable'] = false;
            $out['scenario'] = 'blocked';
            $out['shipping'] = 0.0;
            $out['charged_shipping'] = 0.0;
            $out['message'] = 'Sorry, we do not deliver to this postcode.';
            return $out;
        }

        $matched = $pinRaw !== null ? sk_pincode_match_extra($pinRaw, $settings) : null;
        if ($matched) {
            $extra = (float)$matched['extra_charge'];
            $freeAbove = (float)$matched['free_above'];
            $charge = round($base + $extra, 2);
            $out['scenario'] = 'extra_charge';
            $out['extra_charge'] = $extra;
            $out['charged_shipping'] = $charge;
            $out['matched_range'] = $matched;
            $out['free_threshold'] = $freeAbove > 0 ? $freeAbove : 0.0;

            if ($freeAbove > 0 && $goods >= $freeAbove) {
                $out['shipping'] = 0.0;
                $out['free_eligible'] = true;
                $out['amount_remaining'] = 0.0;
                $out['message'] = 'You qualify for free delivery.';
                return $out;
            }

            $out['shipping'] = $charge;
            $out['free_eligible'] = false;
            if ($freeAbove > 0) {
                $remain = round(max(0, $freeAbove - $goods), 2);
                $out['amount_remaining'] = $remain;
                $out['message'] = 'Add ' . $symbol . number_format($remain, 2)
                    . ' more for free delivery. Extra postcode charge '
                    . $symbol . number_format($extra, 2) . '.';
            } else {
                $out['amount_remaining'] = 0.0;
                $out['message'] = $extra > 0
                    ? ('Extra postcode charge ' . $symbol . number_format($extra, 2) . '.')
                    : null;
            }
            return $out;
        }

        // Old area: unchanged global shipping charge / free shipping above.
        $eligible = $globalFree > 0 && $goods >= $globalFree;
        $out['scenario'] = 'default';
        $out['charged_shipping'] = $base;
        $out['free_threshold'] = $globalFree;
        if ($eligible) {
            $out['shipping'] = 0.0;
            $out['free_eligible'] = true;
            $out['amount_remaining'] = 0.0;
            $out['message'] = 'You qualify for free delivery.';
            return $out;
        }

        $remain = $globalFree > 0 ? round(max(0, $globalFree - $goods), 2) : 0.0;
        $out['shipping'] = $base;
        $out['free_eligible'] = false;
        $out['amount_remaining'] = $remain;
        $out['message'] = $globalFree > 0
            ? ('Add ' . $symbol . number_format($remain, 2) . ' more for free delivery.')
            : null;
        return $out;
    }
}
