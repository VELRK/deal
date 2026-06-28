<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-wallet2 me-2 text-success"></i>Vendor Wallets</h5>
</div>

<div class="card sk-table-card shadow-sm mb-3">
  <div class="card-body py-3">
    <form method="get" class="row g-2 align-items-end">
      <div class="col-md-6"><input type="text" name="search" class="form-control form-control-sm" placeholder="Search vendor..." value="<?= htmlspecialchars($filters['search'] ?? '') ?>"></div>
      <div class="col-md-2"><button class="btn btn-sm btn-dark w-100">Search</button></div>
    </form>
  </div>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover mb-0">
      <thead><tr><th>Vendor</th><th>Store</th><th>Balance</th><th>Updated</th><th></th></tr></thead>
      <tbody>
        <?php foreach ($wallets as $w): ?>
        <tr>
          <td><?= htmlspecialchars($w['business_name']) ?></td>
          <td><?= htmlspecialchars($w['store_name'] ?? '—') ?></td>
          <td class="fw-semibold text-success"><?= $currency . number_format((float)$w['balance'], 2) ?></td>
          <td class="small text-muted"><?= date('d M Y', strtotime($w['updated_at'])) ?></td>
          <td><a href="<?= site_url('admin/wallet/vendor/'.$w['vendor_id']) ?>" class="btn btn-sm btn-outline-primary">View</a></td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($wallets)): ?><tr><td colspan="5" class="text-center text-muted py-4">No wallets found.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
