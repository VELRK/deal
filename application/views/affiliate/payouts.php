<?php
$currency = $settings['currency_symbol'] ?? '₹';
$s = $stats;
$can_request = ($s['pending_commission'] ?? 0) >= $min_payout;
?>
<h4 class="fw-bold mb-4"><i class="bi bi-cash-stack text-success me-2"></i>Payouts</h4>

<div class="row g-3 mb-4">
  <div class="col-md-4"><div class="card p-3"><div class="text-muted small">Available Balance</div><div class="fs-4 fw-bold text-success"><?= $currency . number_format($s['pending_commission'] ?? 0, 2) ?></div></div></div>
  <div class="col-md-4"><div class="card p-3"><div class="text-muted small">Min Payout</div><div class="fs-4 fw-bold"><?= $currency . number_format($min_payout, 0) ?></div></div></div>
  <div class="col-md-4"><div class="card p-3"><div class="text-muted small">Next Payout Day</div><div class="fs-5 fw-bold"><?= date('D, d M Y', strtotime($next_thursday)) ?></div><small class="text-muted">Weekly — Thursday</small></div></div>
</div>

<?php if ($can_request): ?>
<div class="card shadow-sm mb-4">
  <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-2">
    <div><strong>Request payout</strong><br><small class="text-muted">Submitted requests are reviewed manually by admin.</small></div>
    <form method="post" action="<?= site_url('admin/affiliate/payouts') ?>" onsubmit="return confirm('Request payout of <?= $currency . number_format($s['pending_commission'], 2) ?>?');">
      <button type="submit" class="btn btn-success">Request Payout</button>
    </form>
  </div>
</div>
<?php else: ?>
<div class="alert alert-info py-2">Minimum <?= $currency . number_format($min_payout, 0) ?> pending commission required to request payout.</div>
<?php endif; ?>

<div class="card shadow-sm">
  <div class="card-header fw-semibold">Payout History</div>
  <div class="card-body p-0">
    <table class="table table-sm mb-0">
      <thead><tr><th>Amount</th><th>Status</th><th>Scheduled</th><th>Paid</th><th>Reference</th></tr></thead>
      <tbody>
        <?php foreach ($payouts as $p): ?>
        <tr>
          <td class="fw-semibold"><?= $currency . number_format($p['amount'], 2) ?></td>
          <td><span class="badge bg-secondary"><?= $p['status'] ?></span></td>
          <td class="small"><?= $p['scheduled_payout_date'] ? date('d M Y', strtotime($p['scheduled_payout_date'])) : '—' ?></td>
          <td class="small"><?= $p['paid_at'] ? date('d M Y', strtotime($p['paid_at'])) : '—' ?></td>
          <td class="small"><?= htmlspecialchars($p['payment_reference'] ?? '—') ?></td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($payouts)): ?><tr><td colspan="5" class="text-center text-muted py-3">No payout requests yet.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
