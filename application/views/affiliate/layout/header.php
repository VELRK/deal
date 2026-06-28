<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $title ?? 'Affiliate Portal' ?> - ShopKart</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="<?= base_url('assets/admin/css/admin.css') ?>">
  <link rel="stylesheet" href="<?= base_url('assets/admin/css/affiliate.css') ?>">
</head>
<body class="sk-affiliate-body">

<nav class="navbar navbar-dark bg-success fixed-top sk-aff-topbar">
  <div class="container-fluid">
    <a class="navbar-brand fw-bold" href="<?= site_url('admin/affiliate/dashboard') ?>">
      <i class="bi bi-megaphone me-1"></i> Affiliate Portal
    </a>
    <span class="text-white-50 small d-none d-md-inline"><?= htmlspecialchars($affiliate['name'] ?? '') ?></span>
    <a href="<?= site_url('admin/affiliate/logout') ?>" class="btn btn-sm btn-outline-light"><i class="bi bi-box-arrow-right"></i></a>
  </div>
</nav>

<div class="sk-aff-wrapper d-flex" style="margin-top:56px;">
