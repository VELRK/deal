<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-person me-2 text-warning"></i><?= htmlspecialchars($customer['name']) ?></h5>
  <a href="<?= site_url('admin/customers') ?>" class="btn btn-sm btn-outline-secondary">
    <i class="bi bi-arrow-left me-1"></i> Back
  </a>
</div>

<div class="row g-3">
  <div class="col-lg-4">
    <div class="card sk-table-card shadow-sm mb-3">
      <div class="card-body text-center py-4">
        <div class="rounded-circle bg-warning text-dark d-inline-flex align-items-center justify-content-center fw-bold mb-3"
             style="width:72px;height:72px;font-size:28px;">
          <?= strtoupper(substr($customer['name'],0,1)) ?>
        </div>
        <h6 class="fw-bold mb-0"><?= htmlspecialchars($customer['name']) ?></h6>
        <p class="text-muted small mb-3"><?= htmlspecialchars($customer['email']) ?></p>
        <p class="mb-1"><i class="bi bi-phone me-1"></i><?= $customer['phone'] ?? 'N/A' ?></p>
        <p class="mb-1"><i class="bi bi-calendar me-1"></i>Joined <?= date('d M Y', strtotime($customer['created_at'])) ?></p>
        <span class="badge <?= $customer['status'] ? 'bg-success' : 'bg-danger' ?> mt-2">
          <?= $customer['status'] ? 'Active' : 'Blocked' ?>
        </span>
      </div>
    </div>
  </div>

  <div class="col-lg-8">
    <div class="card sk-table-card shadow-sm">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Order History</div>
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead><tr><th>Order #</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <?php foreach ($orders as $o): ?>
            <tr>
              <td><a href="<?= site_url('admin/orders/view/'.$o['id']) ?>" class="fw-semibold text-decoration-none">
                <?= htmlspecialchars($o['order_number']) ?>
              </a></td>
              <td><?= $currency . number_format($o['total'],2) ?></td>
              <td><span class="badge badge-<?= $o['status'] ?>"><?= ucfirst($o['status']) ?></span></td>
              <td><?= date('d M Y', strtotime($o['created_at'])) ?></td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($orders)): ?>
            <tr><td colspan="4" class="text-center text-muted py-4">No orders yet.</td></tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
