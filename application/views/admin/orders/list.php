<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-cart-check me-2 text-warning"></i>Orders</h5>
</div>

<!-- Filters -->
<div class="card sk-table-card shadow-sm mb-3">
  <div class="card-body py-2">
    <form method="GET" class="d-flex gap-2 flex-wrap">
      <input type="text" name="search" class="form-control form-control-sm" style="max-width:200px;"
             placeholder="Order number..." value="<?= htmlspecialchars($filters['search'] ?? '') ?>">
      <select name="status" class="form-select form-select-sm" style="max-width:160px;">
        <option value="">All Statuses</option>
        <?php foreach (['pending','confirmed','processing','shipped','delivered','cancelled'] as $s): ?>
          <option value="<?= $s ?>" <?= ($filters['status']??'')===$s?'selected':'' ?>><?= ucfirst($s) ?></option>
        <?php endforeach; ?>
      </select>
      <select name="payment_status" class="form-select form-select-sm" style="max-width:160px;">
        <option value="">Payment Status</option>
        <?php foreach (['pending','paid','failed','refunded'] as $s): ?>
          <option value="<?= $s ?>" <?= ($filters['payment_status']??'')===$s?'selected':'' ?>><?= ucfirst($s) ?></option>
        <?php endforeach; ?>
      </select>
      <button class="btn btn-sm btn-outline-warning px-3">Filter</button>
      <a href="<?= site_url('admin/orders') ?>" class="btn btn-sm btn-outline-secondary">Reset</a>
    </form>
  </div>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Coupon</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th><th></th></tr>
        </thead>
        <tbody>
          <?php foreach ($orders as $o): ?>
          <tr>
            <td><span class="fw-semibold"><?= htmlspecialchars($o['order_number']) ?></span></td>
            <td>
              <div><?= htmlspecialchars($o['customer_name'] ?? '-') ?></div>
              <small class="text-muted"><?= htmlspecialchars($o['customer_email'] ?? '') ?></small>
            </td>
            <td>
              <?php
                $item_cnt = $this->db->where('order_id',$o['id'])->count_all_results('order_items');
                echo $item_cnt . ' item' . ($item_cnt!=1?'s':'');
              ?>
            </td>
            <td>
              <?php if (!empty($o['promo_code'])): ?>
                <span class="badge bg-success-subtle text-success border border-success-subtle">
                  <?= htmlspecialchars($o['promo_code']) ?>
                </span>
                <small class="text-muted d-block">-<?= $currency . number_format($o['discount'],2) ?></small>
              <?php else: ?>
                <span class="text-muted small">—</span>
              <?php endif; ?>
            </td>
            <td class="fw-semibold"><?= $currency . number_format($o['total'],2) ?></td>
            <td><span class="badge badge-<?= $o['status'] ?>"><?= ucfirst($o['status']) ?></span></td>
            <td><span class="badge badge-<?= $o['payment_status'] ?>"><?= ucfirst($o['payment_status']) ?></span></td>
            <td><?= date('d M y, H:i', strtotime($o['created_at'])) ?></td>
            <td class="d-flex gap-1">
              <a href="<?= site_url('admin/orders/view/'.$o['id']) ?>" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-eye"></i>
              </a>
              <a href="<?= site_url('admin/orders/invoice/'.$o['id']) ?>" target="_blank" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-printer"></i>
              </a>
            </td>
          </tr>
          <?php endforeach; ?>
          <?php if (empty($orders)): ?>
          <tr><td colspan="8" class="text-center py-5 text-muted">No orders found.</td></tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
  <?php $pages = ceil($total / $limit); if ($pages > 1): ?>
  <div class="card-footer bg-white d-flex justify-content-between align-items-center">
    <small class="text-muted"><?= $total ?> total orders</small>
    <nav><ul class="pagination pagination-sm mb-0">
      <?php for ($i=1; $i<=$pages; $i++): ?>
        <li class="page-item <?= $i===$page?'active':'' ?>">
          <a class="page-link" href="?page=<?= $i ?>&status=<?= urlencode($filters['status']??'') ?>&search=<?= urlencode($filters['search']??'') ?>"><?= $i ?></a>
        </li>
      <?php endfor; ?>
    </ul></nav>
  </div>
  <?php endif; ?>
</div>
