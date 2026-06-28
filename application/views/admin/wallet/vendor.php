<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>

<div class="sk-page-header d-flex justify-content-between flex-wrap gap-2">
  <div>
    <h5 class="sk-page-title mb-1"><i class="bi bi-wallet2 me-2 text-success"></i><?= htmlspecialchars($vendor['business_name']) ?></h5>
    <div class="display-6 fw-bold text-success"><?= $currency . number_format((float)($wallet['balance'] ?? 0), 2) ?></div>
    <small class="text-muted d-block mt-1">Vendor settlement wallet · Top-up by admin only · No withdrawals</small>
  </div>
  <?php if (empty($impersonating) && ($admin['role'] ?? '') === 'superadmin'): ?>
  <a href="<?= site_url('admin/wallet') ?>" class="btn btn-sm btn-outline-secondary">All Wallets</a>
  <?php endif; ?>
</div>

<?php if (empty($impersonating) && ($admin['role'] ?? '') === 'superadmin'): ?>
<div class="card shadow-sm mb-3">
  <div class="card-header fw-semibold">Add Funds</div>
  <div class="card-body">
    <form method="post" action="<?= site_url('admin/wallet/add_funds/'.$vendor['id']) ?>" class="row g-2 align-items-end">
      <div class="col-md-3"><label class="form-label small">Amount (₹)</label><input type="number" step="0.01" name="amount" class="form-control" required min="0.01"></div>
      <div class="col-md-5"><label class="form-label small">Description</label><input type="text" name="description" class="form-control" placeholder="Manual credit"></div>
      <div class="col-md-2"><button type="submit" class="btn btn-success w-100">Add Funds</button></div>
    </form>
  </div>
</div>
<?php endif; ?>

<div class="card sk-table-card shadow-sm">
  <div class="card-header fw-semibold">Transaction History</div>
  <div class="card-body p-0">
    <table class="table table-hover mb-0">
      <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Description</th><th>Reference</th></tr></thead>
      <tbody>
        <?php foreach ($transactions as $t): ?>
        <tr>
          <td class="small"><?= date('d M Y H:i', strtotime($t['created_at'])) ?></td>
          <td><span class="badge <?= $t['type']==='credit'?'bg-success':'bg-danger' ?>"><?= ucfirst($t['type']) ?></span></td>
          <td class="fw-semibold"><?= $currency . number_format((float)$t['amount'], 2) ?></td>
          <td><?= $currency . number_format((float)$t['balance_after'], 2) ?></td>
          <td><?= htmlspecialchars($t['description'] ?? '—') ?></td>
          <td class="small text-muted"><?= htmlspecialchars($t['reference'] ?? '') ?></td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($transactions)): ?><tr><td colspan="6" class="text-center text-muted py-4">No transactions yet.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
