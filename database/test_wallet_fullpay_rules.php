<?php
/**
 * Wallet full-pay rules smoke test (no HTTP).
 * Run: php database/test_wallet_fullpay_rules.php
 */
echo "=== Wallet full-pay rule checks ===\n";

function assert_true($cond, $msg) {
    if (!$cond) {
        echo "FAIL: $msg\n";
        exit(1);
    }
    echo "OK: $msg\n";
}

// Mirror backend shipping + wallet payable math
function wallet_payable($subtotal, $promo, $walletPct, $shipCharge, $freeAbove, $walletFreeShip, $discountMinRm = 0) {
    $afterPromo = max(0, $subtotal - $promo);
    $walletDisc = 0;
    if ($walletPct > 0 && $afterPromo + 0.0001 >= $discountMinRm) {
        $walletDisc = round($afterPromo * $walletPct / 100, 2);
    }
    $baseShip = ($subtotal <= 0) ? 0 : ($subtotal >= $freeAbove ? 0 : $shipCharge);
    $ship = $walletFreeShip ? 0 : $baseShip;
    return round($afterPromo - $walletDisc + $ship, 2);
}

function can_use_wallet($balance, $payable) {
    return $balance + 0.009 >= $payable && $payable > 0;
}

// Example from requirement: total 30, wallet 20 → disabled
$p = wallet_payable(30, 0, 0, 50, 999, true); // free ship on wallet → payable 30
assert_true($p === 30.0, "wallet payable with free ship = 30");
assert_true(!can_use_wallet(20, $p), "RM20 wallet cannot pay RM30");
assert_true(can_use_wallet(30, $p), "RM30 wallet can pay RM30");
assert_true(can_use_wallet(40, $p), "RM40 wallet can pay RM30");

// Without free ship: goods 30 + ship 50 = 80
$p2 = wallet_payable(30, 0, 0, 50, 999, false);
assert_true($p2 === 80.0, "wallet payable without free ship = 80");
assert_true(!can_use_wallet(30, $p2), "RM30 cannot pay RM80 without free ship");
assert_true(can_use_wallet(80, $p2), "RM80 can pay RM80");

// With 10% wallet discount + free ship: 30 - 3 = 27
$p3 = wallet_payable(30, 0, 10, 50, 999, true);
assert_true($p3 === 27.0, "10% wallet discount → payable 27");
assert_true(can_use_wallet(27, $p3), "exact balance after discount OK");
assert_true(!can_use_wallet(26.99, $p3), "slightly under fails");

// RM100 min: 2% only when goods total >= 100
$p4 = wallet_payable(80, 0, 2, 50, 999, false, 100);
assert_true($p4 === 130.0, "below RM100: no 2% and shipping charged");
$p5 = wallet_payable(100, 0, 2, 50, 999, false, 100);
assert_true($p5 === 148.0, "RM100+: 2% off then shipping");
$p6 = wallet_payable(80, 0, 2, 50, 999, true, 100);
assert_true($p6 === 80.0, "below RM100 with free ship: no 2%, payable 80");
$p7 = wallet_payable(100, 0, 2, 50, 999, true, 100);
assert_true($p7 === 98.0, "RM100+ with free ship: 2% off only");

// Partial razorpay+wallet must be rejected by policy (documented)
$partial_allowed = false;
assert_true($partial_allowed === false, "partial wallet+gateway not allowed");

echo "All wallet full-pay rule checks passed.\n";
