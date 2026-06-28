<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>
<h4 class="fw-bold mb-4"><i class="bi bi-currency-rupee text-success me-2"></i>Commission History</h4>
<div class="card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover mb-0">
      <thead><tr><th>Order</th><th>Order Total</th><th>Rate</th><th>Commission</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        <?php foreach ($commissions as $c): ?>
        <tr>
          <td>#<?= $c['order_id'] ?></td>
          <td><?= $currency . number_format($c['order_total'], 2) ?></td>
          <td><?= $c['commission_rate'] ?>%</td>
          <td class="fw-semibold"><?= $currency . number_format($c['commission_amount'], 2) ?></td>
          <td><span class="badge bg-secondary"><?= $c['status'] ?></span></td>
          <td class="small text-muted"><?= date('d M Y', strtotime($c['created_at'])) ?></td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($commissions)): ?><tr><td colspan="6" class="text-center text-muted py-4">No commissions yet.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
