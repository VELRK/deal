<?php $currency = $settings['currency_symbol'] ?? 'RM'; $is_vendor = !empty($is_vendor_scope); ?>
<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">
  <div>
    <h5 class="sk-page-title mb-1"><i class="bi bi-wallet2 me-2 text-primary"></i>Customer Wallets</h5>
    <small class="text-muted">MYR · 500 pts = RM 100 · Wallet pay discount <?= $discount_percent ?>%</small>
  </div>
  <a href="<?= site_url('shopkart/royalty-report') ?>" class="btn btn-sm btn-outline-warning">Royalty Report</a>
  <a href="<?= site_url('shopkart/wallet-recharge') ?>" class="btn btn-sm btn-outline-success">Recharge Report</a>
</div>

<?php if (!$is_vendor): ?>
<div class="card shadow-sm mb-3">
  <div class="card-body">
    <form method="post" action="<?= site_url('admin/customer-wallets/settings') ?>" class="row g-2 align-items-end">
      <div class="col-md-2">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" name="customer_wallet_enabled" id="wEnabled" value="1" <?= $wallet_enabled ? 'checked' : '' ?>>
          <label class="form-check-label" for="wEnabled">Wallet enabled</label>
        </div>
      </div>
      <div class="col-md-2">
        <label class="form-label small">Discount % on wallet pay</label>
        <input type="number" step="0.01" min="0" max="100" name="customer_wallet_discount_percent" class="form-control form-control-sm" value="<?= htmlspecialchars($discount_percent) ?>">
        <small class="text-muted">0 = no extra discount</small>
      </div>
      <div class="col-md-2">
        <div class="form-check mt-4">
          <input class="form-check-input" type="checkbox" name="wallet_free_shipping" id="wFreeShip" value="1"
                 <?= (($settings['wallet_free_shipping'] ?? '1') !== '0') ? 'checked' : '' ?>>
          <label class="form-check-label" for="wFreeShip">Free delivery on wallet pay</label>
        </div>
        <small class="text-muted">Full wallet pay only — no gateway</small>
      </div>
      <div class="col-md-2">
        <label class="form-label small">Points per RM</label>
        <input type="number" step="0.01" name="wallet_points_per_rm" class="form-control form-control-sm" value="<?= htmlspecialchars($settings['wallet_points_per_rm'] ?? '5') ?>" title="500 pts / 100 RM = 5">
      </div>
      <div class="col-md-1">
        <label class="form-label small">Symbol</label>
        <input type="text" name="currency_symbol" class="form-control form-control-sm" value="<?= htmlspecialchars($settings['currency_symbol'] ?? 'RM') ?>">
      </div>
      <div class="col-md-1">
        <label class="form-label small">Code</label>
        <input type="text" name="currency_code" class="form-control form-control-sm" value="<?= htmlspecialchars($settings['currency_code'] ?? 'MYR') ?>">
      </div>
      <div class="col-md-2">
        <label class="form-label small">Wallet top-up gateway</label>
        <select name="payment_gateway" class="form-select form-select-sm">
          <?php $pg = $settings['payment_gateway'] ?? 'razorpay'; ?>
          <option value="razorpay" <?= $pg === 'razorpay' ? 'selected' : '' ?>>Razorpay (FPX/Card)</option>
          <option value="toyyibpay" <?= $pg === 'toyyibpay' ? 'selected' : '' ?>>ToyyibPay</option>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label small">ToyyibPay Secret</label>
        <input type="text" name="toyyibpay_secret_key" class="form-control form-control-sm" value="<?= htmlspecialchars($settings['toyyibpay_secret_key'] ?? '') ?>" placeholder="Malaysia FPX">
      </div>
      <div class="col-md-2">
        <label class="form-label small">Category Code</label>
        <input type="text" name="toyyibpay_category_code" class="form-control form-control-sm" value="<?= htmlspecialchars($settings['toyyibpay_category_code'] ?? '') ?>">
      </div>
      <div class="col-md-2">
        <div class="form-check mt-4">
          <input class="form-check-input" type="checkbox" name="toyyibpay_sandbox" id="tpSandbox" value="1" <?= ($settings['toyyibpay_sandbox'] ?? '1') === '1' ? 'checked' : '' ?>>
          <label class="form-check-label" for="tpSandbox">ToyyibPay sandbox</label>
        </div>
      </div>
      <div class="col-12"><hr class="my-2"><div class="small fw-semibold text-warning"><i class="bi bi-stars me-1"></i>Royalty points</div></div>
      <div class="col-md-2">
        <div class="form-check mt-4">
          <input class="form-check-input" type="checkbox" name="royalty_enabled" id="rEnabled" value="1" <?= ($settings['royalty_enabled'] ?? '1') !== '0' ? 'checked' : '' ?>>
          <label class="form-check-label" for="rEnabled">Royalty enabled</label>
        </div>
      </div>
      <div class="col-md-2">
        <label class="form-label small">Earn pts per RM purchase</label>
        <input type="number" step="0.01" min="0.01" name="royalty_earn_points_per_rm" class="form-control form-control-sm" value="<?= htmlspecialchars($settings['royalty_earn_points_per_rm'] ?? '0.1') ?>" title="RM 5000 → 500 pts (0.1 pts / RM)">
      </div>
      <div class="col-md-2">
        <label class="form-label small">Min pay pts (≥ RM 100)</label>
        <input type="number" min="1" name="royalty_min_redeem_points" class="form-control form-control-sm" value="<?= htmlspecialchars($settings['royalty_min_redeem_points'] ?? '500') ?>" title="500 pts = RM 100 min payment">
      </div>
      <div class="col-md-2">
        <label class="form-label small">Min pay RM on bill</label>
        <input type="number" step="0.01" min="1" name="royalty_min_redeem_rm" class="form-control form-control-sm" value="<?= htmlspecialchars($settings['royalty_min_redeem_rm'] ?? '100') ?>" title="Need this much royalty balance (RM) to unlock Apply">
      </div>
      <div class="col-md-2"><button class="btn btn-sm btn-success">Save Settings</button></div>
    </form>
  </div>
</div>
<?php else: ?>
<div class="alert alert-info py-2 small mb-3">
  Add funds to customer wallets here.
  <?php if ((float)$discount_percent > 0): ?>
    Customers get <strong><?= $discount_percent ?>%</strong> extra discount when paying with wallet at checkout.
  <?php else: ?>
    Wallet pay discount is currently <strong>off</strong> (0%).
  <?php endif; ?>
  Withdrawals are not allowed.
  <a href="<?= site_url('shopkart/royalty-report') ?>" class="ms-1">Royalty Points Report</a>
</div>
<?php endif; ?>

<div class="card sk-table-card shadow-sm mb-3">
  <div class="card-body py-3">
    <form method="get" class="row g-2">
      <div class="col-md-6"><input type="text" name="search" class="form-control form-control-sm" placeholder="Customer name, email, phone..." value="<?= htmlspecialchars($filters['search']??'') ?>"></div>
      <div class="col-md-2"><button class="btn btn-sm btn-dark w-100">Search</button></div>
    </form>
  </div>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover mb-0">
      <thead><tr><th>Customer</th><th>Email</th><th>Balance (RM)</th><th>Updated</th><th></th></tr></thead>
      <tbody>
        <?php foreach ($wallets as $w): ?>
        <tr>
          <td><?= htmlspecialchars($w['name']) ?></td>
          <td><?= htmlspecialchars($w['email']) ?></td>
          <td class="fw-semibold text-success"><?= $currency . number_format((float)$w['balance'], 2) ?></td>
          <td class="small text-muted"><?= $w['updated_at'] ? sk_format_date($w['updated_at']) : '—' ?></td>
          <td><a href="<?= site_url('admin/customer-wallets/view/'.$w['user_id']) ?>" class="btn btn-sm btn-outline-primary">Manage</a></td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($wallets)): ?><tr><td colspan="5" class="text-center text-muted py-4">No wallets yet.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
