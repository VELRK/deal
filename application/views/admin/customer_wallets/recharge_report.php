<?php /** @var array $rows */ /** @var array $filters */ ?>
<div class="sk-page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
  <h5 class="sk-page-title mb-0">Wallet Recharge Report</h5>
  <span class="badge bg-success-subtle text-success border">500 pts = RM 100 · <?= (float)$points_per_rm ?> pts / RM</span>
</div>

<form class="card shadow-sm mb-3" method="get">
  <div class="card-body row g-2 align-items-end">
    <div class="col-md-3">
      <label class="form-label small">Search</label>
      <input type="text" name="search" class="form-control form-control-sm" value="<?= htmlspecialchars($filters['search'] ?? '') ?>" placeholder="Name, email, ref">
    </div>
    <div class="col-md-2">
      <label class="form-label small">From</label>
      <input type="date" name="from" class="form-control form-control-sm" value="<?= htmlspecialchars($filters['from'] ?? '') ?>">
    </div>
    <div class="col-md-2">
      <label class="form-label small">To</label>
      <input type="date" name="to" class="form-control form-control-sm" value="<?= htmlspecialchars($filters['to'] ?? '') ?>">
    </div>
    <div class="col-md-2">
      <button class="btn btn-sm btn-primary" type="submit">Filter</button>
      <a href="<?= site_url('admin/wallet-recharge') ?>" class="btn btn-sm btn-outline-secondary">Reset</a>
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
          <th>Rs</th>
          <th>Points</th>
          <th>Source</th>
          <th>Reference</th>
          <th>Balance After</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($rows)): ?>
        <tr><td colspan="7" class="text-center text-muted py-4">No recharge records.</td></tr>
        <?php else: foreach ($rows as $r): ?>
        <tr>
          <td class="small"><?= sk_format_datetime($r['created_at']) ?></td>
          <td>
            <div class="fw-semibold"><?= htmlspecialchars($r['name'] ?? '-') ?></div>
            <div class="small text-muted"><?= htmlspecialchars($r['email'] ?? '') ?></div>
          </td>
          <td class="fw-semibold text-success">RM <?= number_format((float)$r['amount_rm'], 2) ?></td>
          <td><?= (int)$r['points'] ?> pts</td>
          <td><span class="badge bg-light text-dark border"><?= htmlspecialchars($r['source']) ?></span></td>
          <td class="small"><?= htmlspecialchars($r['reference'] ?? '') ?></td>
          <td>RM <?= number_format((float)$r['balance_after'], 2) ?></td>
        </tr>
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>
  <?php if (($total ?? 0) > ($limit ?? 30)): ?>
  <div class="card-footer small text-muted">Showing page <?= (int)$page ?> · <?= (int)$total ?> total</div>
  <?php endif; ?>
</div>
