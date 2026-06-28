<?php $currency = $settings['currency_symbol'] ?? '₹'; $st = $stats; $is_vendor = !empty($is_vendor_scope); ?>
<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">
  <h5 class="sk-page-title"><i class="bi bi-file-earmark-bar-graph me-2"></i><?= $is_vendor ? 'Affiliate Settlement Report' : 'Settlement Report' ?></h5>
  <a href="<?= site_url('admin/affiliate-payouts/export?from='.$from.'&to='.$to) ?>" class="btn btn-outline-secondary btn-sm">Export CSV</a>
</div>

<form method="get" class="row g-2 mb-4 align-items-end">
  <div class="col-md-3"><label class="form-label small">From</label><input type="date" name="from" class="form-control form-control-sm" value="<?= $from ?>"></div>
  <div class="col-md-3"><label class="form-label small">To</label><input type="date" name="to" class="form-control form-control-sm" value="<?= $to ?>"></div>
  <div class="col-md-2"><button class="btn btn-sm btn-dark w-100">Apply</button></div>
</form>

<div class="row g-3 mb-4">
  <div class="col-md-3"><div class="card p-3"><div class="text-muted small">Checkout Orders</div><div class="fs-4 fw-bold"><?= number_format($st['checkout_orders'] ?? $st['conversions'] ?? 0) ?></div></div></div>
  <div class="col-md-3"><div class="card p-3"><div class="text-muted small">Conversions</div><div class="fs-4 fw-bold"><?= number_format($st['checkout_orders'] ?? $st['conversions'] ?? 0) ?></div></div></div>
  <div class="col-md-3"><div class="card p-3"><div class="text-muted small">Commission Earned</div><div class="fs-4 fw-bold"><?= $currency . number_format($st['commission_earned']??0,0) ?></div></div></div>
  <div class="col-md-3"><div class="card p-3"><div class="text-muted small">Paid Out</div><div class="fs-4 fw-bold text-success"><?= $currency . number_format($st['payouts_paid']??0,0) ?></div></div></div>
</div>

<div class="card shadow-sm">
  <div class="card-header fw-semibold">Payouts in Period</div>
  <div class="card-body p-0">
    <table class="table table-sm mb-0">
      <thead><tr><th>Affiliate</th><th>Promo</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        <?php foreach ($payouts as $p): ?>
        <tr>
          <td><?= htmlspecialchars($p['name']) ?></td>
          <td><code><?= htmlspecialchars($p['promo_code']) ?></code></td>
          <td><?= $currency . number_format($p['amount'],2) ?></td>
          <td><?= $p['status'] ?></td>
          <td><?= date('d M Y', strtotime($p['created_at'])) ?></td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
