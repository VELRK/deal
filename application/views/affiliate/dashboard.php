<?php $s = $stats; $currency = $settings['currency_symbol'] ?? '₹'; ?>
<h4 class="fw-bold mb-4"><i class="bi bi-speedometer2 text-success me-2"></i>Dashboard</h4>

<div class="row g-3 mb-4">
  <div class="col-6 col-md-3"><div class="card sk-aff-stat shadow-sm p-3"><div class="text-muted small">Checkout Orders</div><div class="fs-3 fw-bold"><?= number_format($s['checkout_orders'] ?? $s['total_sales']) ?></div></div></div>
  <div class="col-6 col-md-3"><div class="card sk-aff-stat shadow-sm p-3"><div class="text-muted small">Sales Amount</div><div class="fs-3 fw-bold"><?= $currency . number_format($s['sales_amount'] ?? 0, 0) ?></div></div></div>
  <div class="col-6 col-md-3"><div class="card sk-aff-stat shadow-sm p-3"><div class="text-muted small">Total Commission</div><div class="fs-3 fw-bold"><?= $currency . number_format($s['total_commission'] ?? 0, 0) ?></div></div></div>
  <div class="col-6 col-md-3"><div class="card sk-aff-stat shadow-sm p-3"><div class="text-muted small">Pending</div><div class="fs-3 fw-bold text-warning"><?= $currency . number_format($s['pending_commission'], 0) ?></div></div></div>
</div>

<div class="row g-3">
  <div class="col-lg-6">
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Your Referral Link</div>
      <div class="card-body">
        <p class="small text-muted">Customers must enter promo code <strong><?= htmlspecialchars($affiliate['promo_code']) ?></strong> at checkout. Share your link to pre-fill the code.</p>
        <div class="input-group">
          <input type="text" class="form-control form-control-sm" readonly value="<?= htmlspecialchars($referral_url ?? '') ?>" id="refUrl">
          <button class="btn btn-outline-success btn-sm" onclick="navigator.clipboard.writeText(document.getElementById('refUrl').value)">Copy</button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Recent Commissions</div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead><tr><th>Order</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            <?php foreach ($recent_commissions as $c): ?>
            <tr><td>#<?= $c['order_id'] ?></td><td><?= $currency . number_format($c['commission_amount'], 2) ?></td><td><span class="badge bg-secondary"><?= $c['status'] ?></span></td></tr>
            <?php endforeach; ?>
            <?php if (empty($recent_commissions)): ?><tr><td colspan="3" class="text-muted text-center py-3">No commissions yet</td></tr><?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
