<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><?= htmlspecialchars($title ?? 'Set Password') ?></title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?= base_url('assets/admin/css/admin.css') ?>">
</head>
<body>
<div class="sk-login-wrapper" style="background:linear-gradient(135deg,#065f46,#047857);">
  <div class="sk-login-card card p-4 p-md-5" style="max-width:420px;">
    <h4 class="fw-bold text-center mb-2">Set Your Password</h4>
    <p class="text-muted text-center small mb-3">Create a password to access the Affiliate Portal.</p>
    <?php if ($this->session->flashdata('error')): ?><div class="alert alert-danger py-2"><?= $this->session->flashdata('error') ?></div><?php endif; ?>
    <?php if ($this->session->flashdata('success')): ?><div class="alert alert-success py-2"><?= $this->session->flashdata('success') ?></div><?php endif; ?>
    <form action="<?= site_url('admin/affiliate/set-password/submit') ?>" method="POST">
      <input type="hidden" name="token" value="<?= htmlspecialchars($token ?? '') ?>">
      <div class="mb-3"><label class="form-label">Email</label><input type="email" name="email" class="form-control" value="<?= htmlspecialchars($email ?? '') ?>" readonly></div>
      <div class="mb-3"><label class="form-label">New Password</label><input type="password" name="password" class="form-control" minlength="6" required autofocus></div>
      <div class="mb-4"><label class="form-label">Confirm Password</label><input type="password" name="password_confirm" class="form-control" minlength="6" required></div>
      <button type="submit" class="btn btn-success w-100">Save Password &amp; Continue</button>
    </form>
    <p class="text-center small mt-4 mb-0"><a href="<?= site_url('admin/affiliate/login') ?>">Back to login</a></p>
  </div>
</div>
</body>
</html>
