<?php /** @var array $rows */ /** @var array $filters */ /** @var array $summary */ ?>
<div class="sk-page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
  <div>
    <h5 class="sk-page-title mb-0"><i class="bi bi-stars text-warning me-2"></i>Royalty Points Report</h5>
    <div class="small text-muted mt-1">Separate from wallet · Earn after every order · RM 500 purchase = 500 pts (RM 100) · Show on cart from RM 100+</div>
  </div>
  <span class="badge bg-warning-subtle text-dark border">500 pts = RM 100 · <?= (float)$points_per_rm ?> pts / RM · Min redeem RM <?= number_format((float)($min_redeem_rm ?? 100), 0) ?> (<?= (int)$min_redeem ?> pts)</span>
</div>

<div class="row g-3 mb-3">
  <div class="col-md-3">
    <div class="card shadow-sm border-0 h-100">
      <div class="card-body">
        <div class="text-muted small">Total Earned</div>
        <div class="fs-5 fw-semibold text-success"><?= (int)($summary['earned_pts'] ?? 0) ?> pts</div>
        <div class="small">RM <?= number_format((float)($summary['earned_rm'] ?? 0), 2) ?></div>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card shadow-sm border-0 h-100">
      <div class="card-body">
        <div class="text-muted small">Total Redeemed</div>
        <div class="fs-5 fw-semibold text-danger"><?= (int)($summary['redeemed_pts'] ?? 0) ?> pts</div>
        <div class="small">RM <?= number_format((float)($summary['redeemed_rm'] ?? 0), 2) ?></div>
      </div>
    </div>
  </div>
  <div class="col-md-6">
    <div class="card shadow-sm border-0 h-100">
      <div class="card-body small">
        <strong>How it works</strong>
        <ul class="mb-0 mt-1 ps-3">
          <li>Royalty is separate from wallet cash (top-ups / wallet pay).</li>
          <li>Points generate only after order (paid / COD): 1 pt per RM 1 purchase.</li>
          <li>RM 500 purchase = 500 pts = RM 100 credit.</li>
          <li>On cart, only when balance ≥ RM <?= number_format((float)($min_redeem_rm ?? 100), 0) ?> (<?= (int)$min_redeem ?> pts) can customer apply like a coupon.</li>
          <li>Order page &amp; invoice show earned / redeemed royalty for admin.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<form class="card shadow-sm mb-3" method="get">
  <div class="card-body row g-2 align-items-end">
    <div class="col-md-3">
      <label class="form-label small">Search</label>
      <input type="text" name="search" class="form-control form-control-sm" value="<?= htmlspecialchars($filters['search'] ?? '') ?>" placeholder="Name, email, ref">
    </div>
    <div class="col-md-2">
      <label class="form-label small">Type</label>
      <select name="type" class="form-select form-select-sm">
        <option value="">All</option>
        <option value="earn" <?= ($filters['type'] ?? '') === 'earn' ? 'selected' : '' ?>>Earned</option>
        <option value="redeem" <?= ($filters['type'] ?? '') === 'redeem' ? 'selected' : '' ?>>Redeemed</option>
      </select>
    </div>
    <div class="col-md-2">
      <label class="form-label small">From</label>
      <input type="date" name="from" class="form-control form-control-sm" value="<?= htmlspecialchars($filters['from'] ?? '') ?>">
    </div>
    <div class="col-md-2">
      <label class="form-label small">To</label>
      <input type="date" name="to" class="form-control form-control-sm" value="<?= htmlspecialchars($filters['to'] ?? '') ?>">
    </div>
    <div class="col-md-3">
      <button class="btn btn-sm btn-warning" type="submit">Filter</button>
      <a href="<?= site_url('shopkart/royalty-report') ?>" class="btn btn-sm btn-outline-secondary">Reset</a>
    </div>
  </div>
</form>

<div class="card shadow-sm">
  <div class="table-responsive">
    <table class="table table-hover mb-0 align-middle">
      <thead class="table-light">
        <tr>
          <th>Date</th>
          <th>Customer</th>
          <th>Type</th>
          <th>RM</th>
          <th>Points</th>
          <th>Reference</th>
          <th>Description</th>
          <th>Points Balance</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($rows)): ?>
        <tr><td colspan="8" class="text-center text-muted py-4">No royalty records yet.</td></tr>
        <?php else: foreach ($rows as $r): ?>
        <tr>
          <td class="small"><?= htmlspecialchars($r['created_at']) ?></td>
          <td>
            <div class="fw-semibold"><?= htmlspecialchars($r['name'] ?? '-') ?></div>
            <div class="small text-muted"><?= htmlspecialchars($r['email'] ?? '') ?></div>
          </td>
          <td>
            <?php if (($r['royalty_type'] ?? '') === 'earn'): ?>
              <span class="badge bg-success">Earn</span>
            <?php else: ?>
              <span class="badge bg-danger">Redeem</span>
            <?php endif; ?>
          </td>
          <td>RM <?= number_format((float)$r['amount_rm'], 2) ?></td>
          <td><?= (int)$r['points'] ?> pts</td>
          <td class="small font-monospace"><?= htmlspecialchars($r['reference'] ?? '') ?></td>
          <td class="small"><?= htmlspecialchars($r['description'] ?? '') ?></td>
          <td>
            <div class="fw-semibold"><?= (int)($r['balance_after_points'] ?? 0) ?> pts</div>
            <div class="small text-muted">≈ RM <?= number_format((float)$r['balance_after'], 2) ?></div>
          </td>
        </tr>
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>
  <?php if (($total ?? 0) > 50): ?>
  <div class="card-footer small text-muted">Showing page <?= (int)$page ?> · <?= (int)$total ?> records</div>
  <?php endif; ?>
</div>
