<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Affiliate Registration</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?= base_url('assets/admin/css/admin.css') ?>">
</head>
<body>
<div class="sk-login-wrapper" style="background:linear-gradient(135deg,#065f46,#047857);">
  <div class="sk-login-card card p-4 p-md-5" style="max-width:480px;">
    <h4 class="fw-bold text-center mb-3">Affiliate Registration</h4>
    <?php if ($this->session->flashdata('error')): ?><div class="alert alert-danger py-2"><?= $this->session->flashdata('error') ?></div><?php endif; ?>
    <form action="<?= site_url('admin/affiliate/register/submit') ?>" method="POST">
      <div class="mb-3"><label class="form-label">Full Name</label><input type="text" name="name" id="regName" class="form-control" required></div>
      <div class="mb-3"><label class="form-label">Email</label><input type="email" name="email" class="form-control" required></div>
      <div class="mb-3"><label class="form-label">Phone</label><input type="text" name="phone" id="regPhone" class="form-control" required placeholder="10-digit mobile"></div>
      <div class="mb-3">
        <label class="form-label">Promo Code <small class="text-muted">(auto: Name4 + last 4 phone digits)</small></label>
        <input type="text" name="promo_code" id="regPromo" class="form-control text-uppercase" placeholder="Leave blank for auto">
        <small id="promoHint" class="text-muted"></small>
      </div>
      <div class="mb-4"><label class="form-label">Password</label><input type="password" name="password" class="form-control" required minlength="6"></div>
      <button type="submit" class="btn btn-success w-100">Register</button>
    </form>
    <p class="text-center small mt-3"><a href="<?= site_url('admin/affiliate/login') ?>">Already registered? Login</a></p>
  </div>
</div>
<script>
function suggestPromo() {
  var n = (document.getElementById('regName').value || '').replace(/[^a-zA-Z]/g,'').substring(0,4).toUpperCase().padEnd(4,'X');
  var p = (document.getElementById('regPhone').value || '').replace(/\D/g,'').slice(-4) || '0000';
  document.getElementById('promoHint').textContent = 'Suggested: ' + n + p;
}
document.getElementById('regName').addEventListener('input', suggestPromo);
document.getElementById('regPhone').addEventListener('input', suggestPromo);
</script>
</body>
</html>
