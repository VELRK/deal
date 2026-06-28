<?php
$a = $affiliate;
$s = $stats;
$currency = $settings['currency_symbol'] ?? '₹';
$status_badges = ['pending'=>'bg-warning text-dark','approved'=>'bg-success','rejected'=>'bg-danger','suspended'=>'bg-secondary'];
?>
<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">
  <div>
    <h5 class="sk-page-title mb-1"><?= htmlspecialchars($a['name']) ?></h5>
    <code><?= htmlspecialchars($a['promo_code']) ?></code>
    <span class="badge <?= $status_badges[$a['status']]??'bg-secondary' ?> ms-2"><?= ucfirst($a['status']) ?></span>
  </div>
  <div class="d-flex gap-2 flex-wrap">
    <?php if ($a['status']==='pending'): ?>
    <a href="<?= site_url('admin/affiliates/approve/'.$a['id']) ?>" class="btn btn-success btn-sm">Approve</a>
    <a href="<?= site_url('admin/affiliates/reject/'.$a['id']) ?>" class="btn btn-danger btn-sm" onclick="return confirm('Reject affiliate?')">Reject</a>
    <?php endif; ?>
    <?php if ($a['kyc_status']!=='verified'): ?>
    <a href="<?= site_url('admin/affiliates/verify_kyc/'.$a['id']) ?>" class="btn btn-outline-success btn-sm">Verify KYC</a>
    <?php endif; ?>
    <a href="<?= site_url('admin/affiliates/edit/'.$a['id']) ?>" class="btn btn-outline-secondary btn-sm">Edit</a>
    <a href="<?= site_url('admin/affiliates/delete/'.$a['id']) ?>" class="btn btn-outline-danger btn-sm" onclick="return confirm('Remove this affiliate?')">Delete</a>
    <a href="<?= site_url('admin/affiliates') ?>" class="btn btn-outline-dark btn-sm">Back</a>
  </div>
</div>

<div class="row g-3 mb-4">
  <div class="col-md-3"><div class="card p-3"><div class="text-muted small">Checkout Orders</div><div class="fs-4 fw-bold"><?= number_format($s['checkout_orders'] ?? $s['total_sales']) ?></div></div></div>
  <div class="col-md-3"><div class="card p-3"><div class="text-muted small">Sales Amount</div><div class="fs-4 fw-bold"><?= $currency . number_format($s['sales_amount'] ?? 0, 0) ?></div></div></div>
  <div class="col-md-3"><div class="card p-3"><div class="text-muted small">Pending</div><div class="fs-4 fw-bold text-warning"><?= $currency . number_format($s['pending_commission'],0) ?></div></div></div>
  <div class="col-md-3"><div class="card p-3"><div class="text-muted small">Paid</div><div class="fs-4 fw-bold text-success"><?= $currency . number_format($s['paid_commission'],0) ?></div></div></div>
</div>

<div class="row g-3">
  <div class="col-lg-6">
    <div class="card shadow-sm mb-3">
      <div class="card-header fw-semibold">Profile</div>
      <div class="card-body small">
        <p class="mb-1"><strong>Email:</strong> <?= htmlspecialchars($a['email']) ?></p>
        <p class="mb-1"><strong>Phone:</strong> <?= htmlspecialchars($a['phone']) ?></p>
        <?php if (!empty($a['address_line1']) || !empty($a['city'])): ?>
        <p class="mb-1"><strong>Address:</strong> <?= htmlspecialchars(trim(($a['address_line1']??'').', '.($a['city']??'').', '.($a['state']??''), ', ')) ?></p>
        <?php endif; ?>
        <?php if (!empty($a['about'])): ?><p class="mb-1"><strong>About:</strong> <?= nl2br(htmlspecialchars($a['about'])) ?></p><?php endif; ?>
        <p class="mb-1"><strong>Commission:</strong> <?= $a['commission_rate'] ?>%</p>
        <p class="mb-1"><strong>Checkout discount:</strong> <?= !empty($a['discount_active']) ? number_format((float)($a['customer_discount_percent']??0), 1).'% (active)' : 'Inactive' ?></p>
        <p class="mb-1"><strong>KYC:</strong> <?= ucfirst($a['kyc_status']) ?></p>
        <p class="mb-0"><strong>Bank:</strong> <?= htmlspecialchars($a['bank_name']??'—') ?> / <?= htmlspecialchars($a['bank_account_number']??'—') ?></p>
      </div>
    </div>
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">KYC Documents</div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead><tr><th>Type</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <?php foreach ($documents as $d): ?>
            <tr><td><?= ucfirst($d['doc_type']) ?></td><td><?= $d['status'] ?></td><td><a href="<?= base_url($d['file_path']) ?>" target="_blank">View</a></td></tr>
            <?php endforeach; ?>
            <?php if (empty($documents)): ?><tr><td colspan="3" class="text-muted text-center py-2">No documents</td></tr><?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card shadow-sm mb-3">
      <div class="card-header fw-semibold">Recent Commissions</div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead><tr><th>Order</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            <?php foreach ($commissions as $c): ?>
            <tr><td>#<?= $c['order_id'] ?></td><td><?= $currency . number_format($c['commission_amount'],2) ?></td><td><?= $c['status'] ?></td></tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Payouts</div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead><tr><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <?php foreach ($payouts as $p): ?>
            <tr><td><?= $currency . number_format($p['amount'],2) ?></td><td><?= $p['status'] ?></td><td><?= date('d M Y', strtotime($p['created_at'])) ?></td></tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
