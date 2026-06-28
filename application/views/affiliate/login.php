<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><?= $title ?? 'Affiliate Login' ?></title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="<?= base_url('assets/admin/css/admin.css') ?>">
</head>
<body>
<div class="sk-login-wrapper" style="background:linear-gradient(135deg,#065f46,#047857);">
  <div class="sk-login-card card p-4 p-md-5">
    <div class="text-center mb-4">
      <i class="bi bi-megaphone text-success" style="font-size:2.5rem;"></i>
      <h4 class="fw-bold mb-0 mt-2">Affiliate Login</h4>
      <p class="text-muted small">Track referrals, commissions & payouts</p>
    </div>
    <?php if ($this->session->flashdata('error')): ?><div class="alert alert-danger py-2"><?= $this->session->flashdata('error') ?></div><?php endif; ?>
    <?php if ($this->session->flashdata('success')): ?><div class="alert alert-success py-2"><?= $this->session->flashdata('success') ?></div><?php endif; ?>
    <form action="<?= site_url('admin/affiliate/login/submit') ?>" method="POST">
      <div class="mb-3"><label class="form-label">Email</label><input type="email" name="email" class="form-control" required autofocus></div>
      <div class="mb-4"><label class="form-label">Password</label><input type="password" name="password" class="form-control" required></div>
      <button type="submit" class="btn btn-success w-100 fw-bold">Sign In</button>
    </form>
    <p class="text-center small mt-4 mb-0">
      <a href="<?= site_url('admin/affiliate/register') ?>">Register as affiliate</a> ·
      <a href="<?= site_url('admin/affiliate/forgot-password') ?>">Forgot password?</a> ·
      <a href="<?= site_url('admin/login') ?>">Admin login</a>
    </p>
  </div>
</div>
</body>
</html>
