<nav class="sk-aff-sidebar bg-dark text-white">
  <div class="p-3">
    <div class="mb-3 p-2 bg-success bg-opacity-25 rounded text-center">
      <small class="text-white-50 d-block">Your Promo Code</small>
      <strong class="text-warning fs-5"><?= htmlspecialchars($affiliate['promo_code'] ?? '') ?></strong>
    </div>
    <ul class="nav flex-column gap-1">
      <li><a href="<?= site_url('admin/affiliate/dashboard') ?>" class="nav-link sk-nav-link text-white-50"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a></li>
      <li><a href="<?= site_url('admin/affiliate/commissions') ?>" class="nav-link sk-nav-link text-white-50"><i class="bi bi-currency-rupee me-2"></i> Commissions</a></li>
      <li><a href="<?= site_url('admin/affiliate/payouts') ?>" class="nav-link sk-nav-link text-white-50"><i class="bi bi-cash-stack me-2"></i> Payouts</a></li>
      <li><a href="<?= site_url('admin/affiliate/kyc') ?>" class="nav-link sk-nav-link text-white-50"><i class="bi bi-shield-check me-2"></i> KYC</a></li>
      <li><a href="<?= site_url('admin/affiliate/products') ?>" class="nav-link sk-nav-link text-white-50"><i class="bi bi-box-seam me-2"></i> Product Requests</a></li>
      <li><a href="<?= site_url('admin/affiliate/profile') ?>" class="nav-link sk-nav-link text-white-50"><i class="bi bi-person-circle me-2"></i> My Profile</a></li>
      <li class="mt-3"><a href="<?= site_url('admin/affiliate/logout') ?>" class="nav-link text-danger"><i class="bi bi-box-arrow-left me-2"></i> Logout</a></li>
    </ul>
  </div>
</nav>
<main class="sk-aff-main flex-grow-1 p-4">

<?php if ($this->session->flashdata('success')): ?>
<div class="alert alert-success py-2"><?= $this->session->flashdata('success') ?></div>
<?php endif; ?>
<?php if ($this->session->flashdata('error')): ?>
<div class="alert alert-danger py-2"><?= $this->session->flashdata('error') ?></div>
<?php endif; ?>
