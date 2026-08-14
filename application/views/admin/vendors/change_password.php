<?php
$vendor = $vendor ?? [];
$email = htmlspecialchars($vendor['email'] ?? '');
?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-shield-lock me-2 text-warning"></i>Change Password</h5>
</div>

<?php if ($this->session->flashdata('error')): ?>
  <div class="alert alert-danger py-2"><?= $this->session->flashdata('error') ?></div>
<?php endif; ?>
<?php if ($this->session->flashdata('success')): ?>
  <div class="alert alert-success py-2"><?= $this->session->flashdata('success') ?></div>
<?php endif; ?>

<div class="row g-3">
  <div class="col-lg-6">
    <div class="card sk-table-card shadow-sm">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Email verification required</div>
      <div class="card-body">
        <p class="small text-muted">
          For security, password changes require a 6-digit code sent to
          <strong><?= $email ?></strong>.
        </p>

        <form method="post" class="mb-4" action="<?= site_url('admin/vendor/account/password') ?>">
          <input type="hidden" name="action" value="send_code">
          <button type="submit" class="btn btn-outline-primary w-100">
            <i class="bi bi-envelope me-1"></i> Send Verification Code to Email
          </button>
        </form>

        <hr>

        <form method="post" action="<?= site_url('admin/vendor/account/password') ?>">
          <input type="hidden" name="action" value="change_password">
          <div class="mb-3">
            <label class="form-label">Email Code</label>
            <input type="text" name="code" class="form-control" maxlength="6" pattern="\d{6}"
                   inputmode="numeric" placeholder="6-digit code" required autocomplete="one-time-code">
          </div>
          <div class="mb-3">
            <label class="form-label">New Password</label>
            <input type="password" name="password" class="form-control" minlength="6" required autocomplete="new-password">
          </div>
          <div class="mb-3">
            <label class="form-label">Confirm Password</label>
            <input type="password" name="password_confirm" class="form-control" minlength="6" required autocomplete="new-password">
          </div>
          <button type="submit" class="btn btn-warning w-100 fw-semibold">
            <i class="bi bi-check2-circle me-1"></i> Update Password
          </button>
        </form>
      </div>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card sk-table-card shadow-sm">
      <div class="card-body small text-muted">
        <p class="mb-2 fw-semibold text-dark">Account</p>
        <div class="mb-1"><span class="text-muted">Business:</span> <?= htmlspecialchars($vendor['business_name'] ?? '—') ?></div>
        <div class="mb-1"><span class="text-muted">Owner:</span> <?= htmlspecialchars($vendor['owner_name'] ?? '—') ?></div>
        <div class="mb-0"><span class="text-muted">Email:</span> <?= $email ?></div>
        <hr>
        <p class="mb-0">Codes expire in 15 minutes. If email does not arrive, check spam or ask admin to verify SMTP in Settings.</p>
      </div>
    </div>
  </div>
</div>
