<?php $currency = $settings['currency_symbol'] ?? '₹'; $is_vendor = !empty($is_vendor_scope); ?>
<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">
  <div>
    <h5 class="sk-page-title mb-1"><i class="bi bi-cash-stack me-2 text-success"></i>Affiliate Payouts</h5>
    <small class="text-muted">
      Min payout: <?= $currency . number_format($min_payout, 0) ?> · Weekly Thursday · Manual approval
      <?php if ($is_vendor): ?> · your affiliates only<?php endif; ?>
    </small>
  </div>
  <div class="d-flex gap-2">
    <a href="<?= site_url('admin/affiliate-payouts/settlement') ?>" class="btn btn-outline-primary btn-sm">Settlement Report</a>
    <a href="<?= site_url('admin/affiliate-payouts/export') ?>" class="btn btn-outline-secondary btn-sm">Export CSV</a>
  </div>
</div>

<div class="card sk-table-card shadow-sm mb-3">
  <div class="card-body py-3">
    <form method="get" class="row g-2 align-items-end">
      <div class="col-md-5"><input type="text" name="search" class="form-control form-control-sm" placeholder="Affiliate name, promo..." value="<?= htmlspecialchars($filters['search']??'') ?>"></div>
      <div class="col-md-3">
        <select name="status" class="form-select form-select-sm">
          <option value="">All status</option>
          <?php foreach (['pending','approved','processing','paid','rejected'] as $st): ?>
          <option value="<?= $st ?>" <?= ($filters['status']??'')===$st?'selected':'' ?>><?= ucfirst($st) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-2"><button class="btn btn-sm btn-dark w-100">Filter</button></div>
    </form>
  </div>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover mb-0">
      <thead><tr><th>Affiliate</th><th>Promo</th><th>Amount</th><th>Status</th><th>Scheduled</th><th>Actions</th></tr></thead>
      <tbody>
        <?php foreach ($payouts as $p): ?>
        <tr>
          <td><?= htmlspecialchars($p['affiliate_name'] ?? $p['name'] ?? '') ?></td>
          <td><code><?= htmlspecialchars($p['promo_code'] ?? '') ?></code></td>
          <td class="fw-semibold"><?= $currency . number_format($p['amount'], 2) ?></td>
          <td><span class="badge bg-secondary"><?= $p['status'] ?></span></td>
          <td class="small"><?= $p['scheduled_payout_date'] ? date('d M Y', strtotime($p['scheduled_payout_date'])) : '—' ?></td>
          <td>
            <?php if ($p['status'] === 'pending'): ?>
            <form action="<?= site_url('admin/affiliate-payouts/approve/'.$p['id']) ?>" method="post" class="d-inline"><button class="btn btn-sm btn-success">Approve</button></form>
            <form action="<?= site_url('admin/affiliate-payouts/reject/'.$p['id']) ?>" method="post" class="d-inline" onsubmit="return confirm('Reject payout?')"><button class="btn btn-sm btn-outline-danger">Reject</button></form>
            <?php elseif ($p['status'] === 'approved'): ?>
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#payModal<?= $p['id'] ?>">Mark Paid</button>
            <div class="modal fade" id="payModal<?= $p['id'] ?>" tabindex="-1">
              <div class="modal-dialog modal-sm"><div class="modal-content">
                <form action="<?= site_url('admin/affiliate-payouts/pay/'.$p['id']) ?>" method="post">
                  <div class="modal-header"><h6 class="modal-title">Mark Paid</h6><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                  <div class="modal-body"><input type="text" name="payment_reference" class="form-control form-control-sm" placeholder="UTR / Reference" required></div>
                  <div class="modal-footer"><button type="submit" class="btn btn-primary btn-sm">Confirm</button></div>
                </form>
              </div></div>
            </div>
            <?php else: ?>—<?php endif; ?>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($payouts)): ?><tr><td colspan="6" class="text-center text-muted py-4">No payout requests.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
