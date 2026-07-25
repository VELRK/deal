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
    <?php if (!empty($a['must_set_password']) || in_array($a['status'], ['pending', 'approved'], true)): ?>
    <form method="post" action="<?= site_url('admin/affiliates/resend_email/'.$a['id']) ?>" class="d-inline">
      <button type="submit" class="btn btn-outline-primary btn-sm" title="Resend invite, registration, or approval email">Resend Email</button>
    </form>
    <?php endif; ?>
    <?php if ($a['kyc_status']!=='verified'): ?>
    <a href="<?= site_url('admin/affiliates/verify_kyc/'.$a['id']) ?>" class="btn btn-outline-success btn-sm">Verify KYC</a>
    <?php endif; ?>
    <a href="<?= site_url('admin/affiliates/login_as/'.$a['id']) ?>" class="btn btn-success btn-sm" target="_blank" rel="noopener noreferrer"><i class="bi bi-box-arrow-in-right me-1"></i>Login as Affiliate</a>
    <a href="<?= site_url('admin/affiliates/edit/'.$a['id']) ?>" class="btn btn-outline-secondary btn-sm">Edit</a>
    <a href="<?= site_url('admin/affiliates/delete/'.$a['id']) ?>" class="btn btn-outline-danger btn-sm" onclick="return confirm('Remove this affiliate?')">Delete</a>
    <a href="<?= site_url('admin/affiliates') ?>" class="btn btn-outline-dark btn-sm">Back</a>
  </div>
</div>

<?php if (!empty($a['must_set_password'])): ?>
<?php
  $inviteUrl = site_url('admin/affiliate/set-password?token=' . urlencode($a['invite_token'] ?? '') . '&email=' . urlencode($a['email']));
  $inviteExpired = empty($a['invite_expires']) || strtotime($a['invite_expires']) < time();
?>
<div class="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
  <div>
    <strong>Password not set.</strong> Affiliate must use the email link before they can log in.
    <?php if ($inviteExpired): ?>
    <span class="d-block small mt-1">Invite link expired — click <strong>Resend Email</strong> to generate a new one.</span>
    <?php elseif (!empty($a['invite_expires'])): ?>
    <span class="d-block small mt-1">Link valid until <?= date('d M Y, h:i A', strtotime($a['invite_expires'])) ?>.</span>
    <?php endif; ?>
  </div>
  <?php if (!empty($a['invite_token']) && !$inviteExpired): ?>
  <button type="button" class="btn btn-sm btn-outline-dark" data-copy-url="<?= htmlspecialchars($inviteUrl, ENT_QUOTES) ?>" onclick="navigator.clipboard.writeText(this.dataset.copyUrl); this.textContent='Copied!';">Copy set-password link</button>
  <?php endif; ?>
</div>
<?php endif; ?>

<?php if (!empty($mail_status) && empty($mail_status['ok'])): ?>
<div class="alert alert-danger mb-3">
  <strong>Email not configured.</strong> Affiliate emails cannot send until SMTP is set up.
  <?= htmlspecialchars(implode(' ', $mail_status['issues'] ?? [])) ?>
  <a href="<?= site_url('admin/settings?tab=email') ?>" class="alert-link">Open Email settings</a>
</div>
<?php elseif (!empty($mail_status['warnings'])): ?>
<div class="alert alert-warning mb-3">
  <?= htmlspecialchars(implode(' ', $mail_status['warnings'])) ?>
  <a href="<?= site_url('admin/settings') ?>" class="alert-link">Update Site Email</a>
</div>
<?php endif; ?>

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
        <p class="mb-1"><strong>MyKAD:</strong> <?= htmlspecialchars($a['mykad_number'] ?? '—') ?></p>
        <p class="mb-1"><strong>Passport:</strong> <?= htmlspecialchars($a['passport_number'] ?? '—') ?></p>
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
