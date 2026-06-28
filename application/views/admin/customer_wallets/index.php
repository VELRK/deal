<?php $currency = $settings['currency_symbol'] ?? '₹'; $is_vendor = !empty($is_vendor_scope); ?>
<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">
  <div>
    <h5 class="sk-page-title mb-1"><i class="bi bi-wallet2 me-2 text-primary"></i>Customer Wallets</h5>
    <small class="text-muted">Wallet payments apply <?= $discount_percent ?>% discount at checkout · No withdrawals</small>
  </div>
</div>

<?php if (!$is_vendor): ?>
<div class="card shadow-sm mb-3">
  <div class="card-body">
    <form method="post" action="<?= site_url('admin/customer-wallets/settings') ?>" class="row g-2 align-items-end">
      <div class="col-md-2">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" name="customer_wallet_enabled" id="wEnabled" value="1" <?= $wallet_enabled ? 'checked' : '' ?>>
          <label class="form-check-label" for="wEnabled">Enabled</label>
        </div>
      </div>
      <div class="col-md-3">
        <label class="form-label small">Discount % on wallet pay</label>
        <input type="number" step="0.01" name="customer_wallet_discount_percent" class="form-control form-control-sm" value="<?= htmlspecialchars($discount_percent) ?>">
      </div>
      <div class="col-md-2"><button class="btn btn-sm btn-success">Save Settings</button></div>
    </form>
  </div>
</div>
<?php else: ?>
<div class="alert alert-info py-2 small mb-3">
  Add funds to customer wallets here. Customers get <strong><?= $discount_percent ?>%</strong> extra discount when paying with wallet at checkout. Withdrawals are not allowed.
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
      <thead><tr><th>Customer</th><th>Email</th><th>Balance</th><th>Updated</th><th></th></tr></thead>
      <tbody>
        <?php foreach ($wallets as $w): ?>
        <tr>
          <td><?= htmlspecialchars($w['name']) ?></td>
          <td><?= htmlspecialchars($w['email']) ?></td>
          <td class="fw-semibold text-success"><?= $currency . number_format((float)$w['balance'], 2) ?></td>
          <td class="small text-muted"><?= $w['updated_at'] ? date('d M Y', strtotime($w['updated_at'])) : '—' ?></td>
          <td><a href="<?= site_url('admin/customer-wallets/view/'.$w['user_id']) ?>" class="btn btn-sm btn-outline-primary">Manage</a></td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($wallets)): ?><tr><td colspan="5" class="text-center text-muted py-4">No wallets yet.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
