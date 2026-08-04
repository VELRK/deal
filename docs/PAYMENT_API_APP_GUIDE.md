# 2DEAL Payment API — App Developer Guide (Flutter)

Step-by-step guide for mobile / Flutter developers: checkout, Razorpay online pay, COD, wallet pay, and wallet top-up.

**Base URL**

```text
https://superfinelabels.in/deal/shopkart-api
```

All payment URLs start with this base.  
Example: `https://superfinelabels.in/deal/shopkart-api/payment/create-order`

Interactive explorer (browser): `https://superfinelabels.in/deal/shopkart-api/docs` → group **Payment** / **Orders** / **Wallet**.

---

## 1. Important rules (read first)

### 1.1 Always send JSON

```http
Content-Type: application/json
```

### 1.2 JWT required for all payment / checkout APIs

User **must be logged in**. Guest cannot checkout.

```http
Authorization: Bearer <jwt>
X-Auth-Token: Bearer <jwt>
```

(`X-Auth-Token` is optional backup if the server strips `Authorization`.)

### 1.3 Cart must belong to the logged-in user

1. Guest adds items with `X-Session-ID`.
2. After login → `POST /cart/merge`.
3. Then call `POST /checkout`.

Checkout reads cart rows by **user_id**, not session. Empty user cart → `"Cart is empty."`

### 1.4 Malaysian phone required for Razorpay

Online pay needs a valid MY mobile (e.g. `0123456789` / `60123456789`) on shipping address or profile. Otherwise create-order returns **422**.

### 1.5 Amount units

| Field | Unit | Example |
|-------|------|---------|
| Order totals, `pay_amount`, wallet `amount` | RM (decimal) | `230.50` |
| Razorpay `amount` in create-order / top-up | **sen / paise** (`RM × 100`) | `23050` |

Pass Razorpay Checkout the **paise** value from the API. Do not convert again.

### 1.6 Never verify payment only on the client

After Razorpay success you **must** call our verify API. Until then the order stays unpaid (`payment_attempt` / `pending`).

---

## 2. Payment methods

| `payment_method` | What happens | Next app step |
|------------------|--------------|---------------|
| `cod` | Order created, usually confirmed; pay on delivery | Show order success. **No** Razorpay. |
| `razorpay` | Order created unpaid (`payment_attempt`) | `create-order` → open Razorpay → `verify` |
| `wallet` | Pay full bill from wallet (+ optional royalty). Needs enough balance | Show success. **No** Razorpay if fully covered. |

**Optional flags on checkout**

| Flag | Meaning |
|------|---------|
| `use_wallet: true` | With `razorpay` or alone: deduct wallet from due amount. Remainder goes to Razorpay (or full wallet → treated as `wallet`). |
| `use_royalty` / `apply_royalty: true` | Redeem royalty points toward bill (when eligible, typically balance ≥ RM 100). Remainder COD / online / wallet. |
| `promo_code` | Coupon or affiliate market code. |

---

## 3. When to call which API

| App moment | Call this |
|------------|-----------|
| Place order (any method) | `POST /checkout` |
| User chose Online / Razorpay and order needs gateway pay | `POST /payment/create-order` |
| Razorpay SDK returned success | `POST /payment/verify` |
| Show wallet balance on checkout | `GET /user/wallet` |
| Start wallet top-up | `POST /user/wallet/topup` |
| Razorpay top-up success | `POST /payment/wallet-topup-verify` |
| Order list / detail after pay | `GET /orders`, `GET /order/{id}` |

**Do not call from the Flutter app (server / browser only)**

- `GET /payment/toyyibpay-return`
- `POST /payment/toyyibpay-callback`

---

## 4. End-to-end flows

### Flow A — COD

```text
Login → Merge cart → POST /checkout (payment_method: cod)
       → Show success (order confirmed / pending as returned)
```

### Flow B — Razorpay (online)

```text
Login → Merge cart
  → POST /checkout (payment_method: razorpay)
  → Save data.order.id
  → POST /payment/create-order { order_id }
  → Open Razorpay Flutter SDK (key_id, order_id, amount, prefill)
  → On success → POST /payment/verify { order_id, razorpay_* }
  → Show success (payment_status: paid, status: confirmed)
```

If user **closes** Razorpay without paying: order stays in `payment_attempt`. App can open create-order again later for the same `order_id`, or show “Pending payment” on My Orders.

### Flow C — Wallet only

```text
GET /user/wallet → enough balance?
  → POST /checkout (payment_method: wallet)
  → Success (no Razorpay)
```

### Flow D — Razorpay + partial wallet / royalty

```text
POST /checkout {
  payment_method: "razorpay",
  use_wallet: true,
  use_royalty: true,
  ...
}
→ create-order → Razorpay amount = order.total − wallet − royalty
→ verify
```

### Flow E — Wallet top-up (Razorpay)

```text
POST /user/wallet/topup { amount: 10 }
→ if data.gateway == "razorpay":
     open Razorpay → POST /payment/wallet-topup-verify
→ if data.gateway == "toyyibpay":
     open data.payment_url in WebView / browser
     (credit usually via server callback; refresh GET /user/wallet)
```

---

## 5. APIs — input & output examples

Replace `<token>` with JWT from login / OTP.

---

### 5.1 Checkout — create shop order

**When:** User taps Place Order.

```http
POST /shopkart-api/checkout
Content-Type: application/json
Authorization: Bearer <token>
```

**Example input**

```json
{
  "payment_method": "razorpay",
  "use_wallet": false,
  "use_royalty": false,
  "promo_code": "",
  "billing_same": true,
  "note": "",
  "address": {
    "full_name": "Ali Bin Ahmad",
    "phone": "0123456789",
    "line1": "12 Jalan Ampang",
    "line2": "Taman ABC",
    "city": "Kuala Lumpur",
    "state": "Wilayah Persekutuan",
    "pincode": "50000",
    "country": "Malaysia"
  }
}
```

**COD example** — same body, `"payment_method": "cod"`.

**Wallet-only example** — `"payment_method": "wallet"` (balance must cover total after royalty).

**Example success output**

```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": {
    "order": {
      "id": 101,
      "order_number": "SK-20260804-001",
      "total": 230.50,
      "wallet_amount": 0,
      "royalty_used_rm": 0,
      "payment_method": "razorpay",
      "payment_status": "pending",
      "status": "payment_attempt",
      "shipping_name": "Ali Bin Ahmad",
      "shipping_phone": "60123456789"
    }
  }
}
```

**App must save**

- `data.order.id` → for create-order / verify  
- `data.order.order_number` → show on success screen  

**Common errors**

| Message / code | Cause |
|----------------|-------|
| `Cart is empty.` | Forgot merge, or cart already checked out |
| `Shipping address is required.` | Missing `address.full_name` / `line1` |
| Phone validation error | Invalid MY phone |
| Stock issues + `data.stock_issues` | Quantity not available |
| `Insufficient wallet balance` | Wallet method / amount too high |

Cart is **cleared** after a successful checkout response.

---

### 5.2 Create Razorpay payment order

**When:** After checkout with online remainder (`payment_method: razorpay` and amount still due).

```http
POST /shopkart-api/payment/create-order
Content-Type: application/json
Authorization: Bearer <token>
```

**Example input**

```json
{
  "order_id": 101
}
```

**Example success output**

```json
{
  "success": true,
  "message": "Payment order created.",
  "data": {
    "razorpay_order_id": "order_Nabcd123",
    "amount": 23050,
    "pay_amount": 230.50,
    "wallet_amount": 0,
    "royalty_used_rm": 0,
    "order_total": 230.50,
    "currency": "MYR",
    "key_id": "rzp_live_xxxxx",
    "order_number": "SK-20260804-001",
    "prefill": {
      "name": "Ali Bin Ahmad",
      "contact": "60123456789",
      "email": "ali@example.com"
    }
  }
}
```

**Map to Razorpay Flutter options**

| API field | Razorpay option |
|-----------|-----------------|
| `key_id` | `key` |
| `razorpay_order_id` | `order_id` |
| `amount` | `amount` (paise — use as-is) |
| `currency` | `currency` |
| `prefill.*` | `prefill` |
| `order_number` | optional `name` / description |

**Common errors**

| Message | Meaning |
|---------|---------|
| `Order not found.` (404) | Wrong id / not your order |
| `Order already paid.` | Already verified |
| `Nothing left to pay online` | Fully paid by wallet/royalty — skip Razorpay |
| Valid Malaysian mobile required (422) | Fix address/profile phone |
| Payment gateway not configured (503) | Offer COD / contact support |

---

### 5.3 Verify order payment

**When:** Razorpay SDK `onSuccess` (never skip this).

```http
POST /shopkart-api/payment/verify
Content-Type: application/json
Authorization: Bearer <token>
```

**Example input**

```json
{
  "order_id": 101,
  "razorpay_order_id": "order_Nabcd123",
  "razorpay_payment_id": "pay_Nxyz789",
  "razorpay_signature": "a1b2c3d4e5f6..."
}
```

Values `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` come **from the Razorpay success callback**. Do not invent them.

**Example success output**

```json
{
  "success": true,
  "message": "Payment successful! Your order is confirmed.",
  "data": {
    "order": {
      "id": 101,
      "order_number": "SK-20260804-001",
      "payment_status": "paid",
      "status": "confirmed",
      "total": 230.50
    }
  }
}
```

Idempotent: calling verify again on an already-paid order still returns success.

**Common errors**

| Message | Meaning |
|---------|---------|
| `Missing payment verification data.` | Incomplete body |
| `Payment verification failed. Invalid signature.` | Wrong/tampered signature or bad keys |

---

### 5.4 Get wallet (checkout helper)

```http
GET /shopkart-api/user/wallet
Authorization: Bearer <token>
```

**Example success output**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "enabled": true,
    "balance": 50.00,
    "balance_rm": 50.00,
    "points": 250,
    "points_per_rm": 5,
    "currency": "MYR",
    "currency_symbol": "RM",
    "discount_percent": 0,
    "royalty": {
      "enabled": true,
      "points": 520,
      "balance_rm": 104.00,
      "can_redeem": true
    }
  }
}
```

Use `balance` / `balance_rm` for wallet pay UI; use nested `royalty` for royalty toggle.

---

### 5.5 Start wallet top-up

```http
POST /shopkart-api/user/wallet/topup
Content-Type: application/json
Authorization: Bearer <token>
```

**Example input**

```json
{
  "amount": 10
}
```

Minimum **RM 1**.

**Example success — Razorpay gateway**

```json
{
  "success": true,
  "message": "Complete payment to add funds to your wallet.",
  "data": {
    "gateway": "razorpay",
    "reference": "TOPUP-6-1722780000-a1b2c3",
    "amount_rm": 10,
    "points": 50,
    "razorpay_order_id": "order_TopupXxx",
    "amount": 1000,
    "currency": "MYR",
    "key_id": "rzp_live_xxxxx",
    "prefill": {
      "name": "Ali Bin Ahmad",
      "contact": "60123456789"
    }
  }
}
```

**Save `data.reference`** — required for verify.

**Example success — ToyyibPay**

```json
{
  "success": true,
  "message": "Redirecting to payment gateway…",
  "data": {
    "gateway": "toyyibpay",
    "reference": "TOPUP-6-...",
    "amount_rm": 10,
    "points": 50,
    "payment_url": "https://toyyibpay.com/...",
    "bill_code": "xxx"
  }
}
```

Open `payment_url` in in-app WebView / external browser, then refresh wallet.

---

### 5.6 Verify wallet top-up (Razorpay)

```http
POST /shopkart-api/payment/wallet-topup-verify
Content-Type: application/json
Authorization: Bearer <token>
```

**Example input**

```json
{
  "reference": "TOPUP-6-1722780000-a1b2c3",
  "razorpay_order_id": "order_TopupXxx",
  "razorpay_payment_id": "pay_TopupYyy",
  "razorpay_signature": "sig_..."
}
```

`reference` must start with `TOPUP-`.

**Example success output**

```json
{
  "success": true,
  "message": "Wallet topped up successfully!",
  "data": {
    "enabled": true,
    "balance": 60.00,
    "balance_rm": 60.00,
    "points": 300,
    "currency": "MYR"
  }
}
```

---

### 5.7 Orders after payment

```http
GET /shopkart-api/orders?page=1
Authorization: Bearer <token>
```

```http
GET /shopkart-api/order/101
Authorization: Bearer <token>
```

Use these to show pending online orders (`status: payment_attempt`) and offer “Pay now” → create-order → Razorpay → verify.

---

## 6. Flutter developer guide — what you need to do

### 6.1 Packages

Suggested:

```yaml
dependencies:
  http: ^1.2.0          # or dio
  flutter_secure_storage: ^9.0.0
  razorpay_flutter: ^1.3.0   # official Razorpay plugin
  # url_launcher: for ToyyibPay payment_url if needed
```

Android / iOS: follow [Razorpay Flutter docs](https://razorpay.com/docs/payments/payment-gateway/flutter-integration/) (min SDK, ProGuard, etc.).

### 6.2 Shared HTTP helper

Always attach:

```dart
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer $token',
  'X-Auth-Token': 'Bearer $token',
}
```

Parse envelope:

```json
{ "success": true|false, "message": "...", "data": { ... } }
```

If `success != true`, show `message` to the user.

### 6.3 Checkout screen checklist

1. User logged in (JWT saved).
2. Cart merged after login.
3. Collect / select shipping address (valid MY phone).
4. Optional: load `GET /user/wallet` for toggles.
5. User picks method: COD / Online / Wallet.
6. `POST /checkout` with chosen `payment_method` + flags.
7. Branch on method:

```dart
final order = res['data']['order'];
final id = order['id'];
final method = order['payment_method'];
final payStatus = order['payment_status'];

if (method == 'cod' || method == 'wallet' || payStatus == 'paid') {
  // Navigate to success — no Razorpay
} else if (method == 'razorpay') {
  await startRazorpayCheckout(orderId: id);
}
```

### 6.4 Open Razorpay (order pay)

```dart
Future<void> startRazorpayCheckout({required int orderId}) async {
  final create = await api.post('/payment/create-order', {'order_id': orderId});
  final d = create['data'];

  final razorpay = Razorpay();
  razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, (PaymentSuccessResponse r) async {
    final verify = await api.post('/payment/verify', {
      'order_id': orderId,
      'razorpay_order_id': r.orderId,
      'razorpay_payment_id': r.paymentId,
      'razorpay_signature': r.signature,
    });
    if (verify['success'] == true) {
      // Navigate to order success
    } else {
      // Show verify['message'] — payment may need support
    }
    razorpay.clear();
  });
  razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, (PaymentFailureResponse r) {
    // User cancelled or failed — order remains unpaid; allow retry
    razorpay.clear();
  });

  razorpay.open({
    'key': d['key_id'],
    'amount': d['amount'],           // paise — do not * 100 again
    'currency': d['currency'] ?? 'MYR',
    'name': '2DEAL',
    'description': d['order_number'] ?? 'Order #$orderId',
    'order_id': d['razorpay_order_id'],
    'prefill': d['prefill'] ?? {},
  });
}
```

### 6.5 Wallet top-up in Flutter

```dart
final top = await api.post('/user/wallet/topup', {'amount': 10});
final d = top['data'];

if (d['gateway'] == 'razorpay') {
  // Same Razorpay open as above, but on success:
  await api.post('/payment/wallet-topup-verify', {
    'reference': d['reference'],
    'razorpay_order_id': r.orderId,
    'razorpay_payment_id': r.paymentId,
    'razorpay_signature': r.signature,
  });
} else if (d['gateway'] == 'toyyibpay' && d['payment_url'] != null) {
  await launchUrl(Uri.parse(d['payment_url']), mode: LaunchMode.externalApplication);
  // Then refresh GET /user/wallet
}
```

### 6.6 UI states to handle

| State | UI |
|-------|-----|
| Checkout loading | Disable Place Order button |
| `payment_attempt` unpaid | “Complete payment” on order detail |
| Razorpay cancelled | Keep order; offer Pay again |
| Verify failed after Razorpay success | Show error + support ref (`order_number` / payment id) — money may be captured; do not create a second checkout blindly |
| Network error on verify | Retry **verify** with same Razorpay ids (idempotent if already paid) |

### 6.7 Security notes for Flutter

- Do **not** put Razorpay **key_secret** in the app. Only use `key_id` from API.
- Do **not** mark order paid only because Razorpay UI succeeded — always call `/payment/verify`.
- Store JWT in secure storage, not plain SharedPreferences if possible.

### 6.8 Suggested screen map

| Screen | APIs |
|--------|------|
| Checkout | `GET /user/wallet`, `POST /checkout` |
| Razorpay sheet | SDK + `create-order` / `verify` |
| Order success | Show `order_number` from verify/checkout |
| My Orders | `GET /orders` — Pay now if unpaid online |
| Wallet | `GET /user/wallet`, `POST /user/wallet/topup`, top-up verify |

---

## 7. cURL quick tests

```bash
# Checkout (Razorpay)
curl -X POST "https://superfinelabels.in/deal/shopkart-api/checkout" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d "{\"payment_method\":\"razorpay\",\"billing_same\":true,\"address\":{\"full_name\":\"Ali\",\"phone\":\"0123456789\",\"line1\":\"12 Jalan Test\",\"city\":\"Kuala Lumpur\",\"state\":\"WP\",\"pincode\":\"50000\",\"country\":\"Malaysia\"}}"

# Create Razorpay order
curl -X POST "https://superfinelabels.in/deal/shopkart-api/payment/create-order" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d "{\"order_id\":101}"

# Verify (after real Razorpay payment)
curl -X POST "https://superfinelabels.in/deal/shopkart-api/payment/verify" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d "{\"order_id\":101,\"razorpay_order_id\":\"order_xxx\",\"razorpay_payment_id\":\"pay_xxx\",\"razorpay_signature\":\"sig_xxx\"}"

# Wallet top-up start
curl -X POST "https://superfinelabels.in/deal/shopkart-api/user/wallet/topup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d "{\"amount\":10}"
```

---

## 8. Checklist if payment “not working”

1. Base URL is `/deal/shopkart-api` (not old `/api/v1/...` unless you intentionally use legacy routes).
2. JWT sent on every call; user owns the order.
3. Cart merged before checkout; cart not empty for **user_id**.
4. Shipping phone is valid Malaysian format.
5. For Razorpay: call **create-order** then SDK then **verify** — all three.
6. Pass `amount` from API as-is (already × 100).
7. `order_id` in verify is the **shop** order id (integer), not the Razorpay `order_…` string.
8. Top-up verify includes `reference` starting with `TOPUP-`.
9. Test keys vs live keys: app must use `key_id` returned by API (server-configured).
10. COD / full wallet orders must **not** open Razorpay.

---

## 9. Related

- Live API explorer: `/deal/shopkart-api/docs`
