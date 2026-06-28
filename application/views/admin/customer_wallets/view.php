<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>
<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">
  <div>
    <h5 class="sk-page-title mb-1">Wallet — <?= htmlspecialchars($user['name']) ?></h5>
    <small class="text-muted"><?= htmlspecialchars($user['email']) ?></small>
  </div>
  <a href="<?= site_url('admin/customer-wallets') ?>" class="btn btn-outline-secondary btn-sm">Back</a>
</div>

<div class="row g-3 mb-4">
  <div class="col-md-4"><div class="card p-4 text-center"><div class="text-muted small">Current Balance</div><div class="display-6 fw-bold text-success"><?= $currency . number_format((float)$wallet['balance'], 2) ?></div></div></div>
  <div class="col-md-8">
    <div class="card p-4">
      <h6 class="fw-semibold mb-3">Add Funds</h6>
      <form method="post" action="<?= site_url('admin/customer-wallets/add_funds/'.$user['id']) ?>" class="row g-2 align-items-end">
        <div class="col-md-4"><label class="form-label small">Amount</label><input type="number" step="0.01" min="0.01" name="amount" class="form-control" required></div>
        <div class="col-md-5"><label class="form-label small">Description</label><input type="text" name="description" class="form-control" placeholder="Admin credit"></div>
        <div class="col-md-3"><button class="btn btn-success w-100">Add Funds</button></div>
      </form>
      <p class="small text-muted mt-2 mb-0">Customers cannot withdraw wallet balance. Funds apply as discount at checkout only.</p>
    </div>
  </div>
</div>

<div class="card shadow-sm">
  <div class="card-header fw-semibold">Transaction History</div>
  <div class="card-body p-0">
    <table class="table table-sm mb-0">
      <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Description</th></tr></thead>
      <tbody>
        <?php foreach ($transactions as $t): ?>
        <tr>
          <td class="small"><?= date('d M Y H:i', strtotime($t['created_at'])) ?></td>
          <td><span class="badge bg-<?= $t['type']==='credit'?'success':'danger' ?>"><?= $t['type'] ?></span></td>
          <td class="fw-semibold"><?= $currency . number_format($t['amount'], 2) ?></td>
          <td><?= $currency . number_format($t['balance_after'], 2) ?></td>
          <td class="small"><?= htmlspecialchars($t['description'] ?? '') ?></td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($transactions)): ?><tr><td colspan="5" class="text-center text-muted py-3">No transactions.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
