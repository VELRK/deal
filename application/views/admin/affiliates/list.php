<?php

$status_badges = ['pending'=>'bg-warning text-dark','approved'=>'bg-success','rejected'=>'bg-danger','suspended'=>'bg-secondary'];

$currency = $settings['currency_symbol'] ?? '₹';

$is_vendor = !empty($is_vendor_scope);

?>

<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">

  <div>

    <h5 class="sk-page-title mb-1"><i class="bi bi-megaphone me-2 text-success"></i><?= $is_vendor ? 'My Affiliates' : 'Affiliates' ?></h5>

    <small class="text-muted"><?= (int)($counts['total']??0) ?> total · <?= (int)($counts['pending']??0) ?> pending</small>

  </div>

  <div class="d-flex gap-2">

    <a href="<?= site_url('admin/affiliates/export') ?>" class="btn btn-outline-secondary btn-sm"><i class="bi bi-download me-1"></i>Export CSV</a>

    <a href="<?= site_url('admin/affiliates/add') ?>" class="btn btn-success btn-sm"><i class="bi bi-plus-lg me-1"></i>Add Affiliate</a>

  </div>

</div>



<?php if (!$is_vendor): ?>

<div class="card shadow-sm mb-3">

  <div class="card-body py-3">

    <form method="post" action="<?= site_url('admin/affiliates/settings') ?>" class="row g-2 align-items-center">

      <div class="col-md-8">

        <div class="form-check form-switch mb-0">

          <input class="form-check-input" type="checkbox" name="affiliate_promo_discount_enabled" id="affDiscGlobal" value="1" <?= !empty($affiliate_discount_enabled) ? 'checked' : '' ?>>

          <label class="form-check-label" for="affDiscGlobal">

            <strong>Affiliate checkout discounts</strong> — customers can apply affiliate promo codes at cart/checkout for a % off subtotal

          </label>

        </div>

      </div>

      <div class="col-md-2"><button type="submit" class="btn btn-sm btn-success w-100">Save</button></div>

    </form>

  </div>

</div>

<?php endif; ?>



<div class="card sk-table-card shadow-sm mb-3">

  <div class="card-body py-3">

    <form method="get" class="row g-2 align-items-end">

      <div class="col-md-4"><input type="text" name="search" class="form-control form-control-sm" placeholder="Search..." value="<?= htmlspecialchars($filters['search']??'') ?>"></div>

      <div class="col-md-3">

        <select name="status" class="form-select form-select-sm">

          <option value="">All status</option>

          <?php foreach (['pending','approved','rejected','suspended'] as $st): ?>

          <option value="<?= $st ?>" <?= ($filters['status']??'')===$st?'selected':'' ?>><?= ucfirst($st) ?></option>

          <?php endforeach; ?>

        </select>

      </div>

      <div class="col-md-3">

        <select name="kyc_status" class="form-select form-select-sm">

          <option value="">All KYC</option>

          <?php foreach (['pending','verified','rejected'] as $k): ?>

          <option value="<?= $k ?>" <?= ($filters['kyc_status']??'')===$k?'selected':'' ?>><?= ucfirst($k) ?></option>

          <?php endforeach; ?>

        </select>

      </div>

      <div class="col-md-2"><button class="btn btn-sm btn-dark w-100">Filter</button></div>

    </form>

  </div>

</div>



<div class="card sk-table-card shadow-sm">

  <div class="card-body p-0">

    <table class="table table-hover mb-0">

      <thead><tr><th>Affiliate</th><th>Promo</th><th>Checkout %</th><th>Orders</th><th>Pending</th><th>Status</th><th></th></tr></thead>

      <tbody>

        <?php foreach ($affiliates as $a): ?>

        <tr>

          <td><div class="fw-semibold"><?= htmlspecialchars($a['name']) ?></div><small class="text-muted"><?= htmlspecialchars($a['email']) ?></small></td>

          <td><code><?= htmlspecialchars($a['promo_code']) ?></code></td>

          <td>

            <?php if (!empty($a['discount_active']) && (float)($a['customer_discount_percent'] ?? 0) > 0): ?>

            <span class="badge bg-success"><?= number_format((float)$a['customer_discount_percent'], 1) ?>% ON</span>

            <?php else: ?>

            <span class="badge bg-secondary">OFF</span>

            <?php endif; ?>

          </td>

          <td><?= number_format($a['total_sales']) ?></td>

          <td class="text-warning fw-semibold"><?= $currency . number_format($a['pending_commission'], 0) ?></td>

          <td><span class="badge <?= $status_badges[$a['status']]??'bg-secondary' ?>"><?= ucfirst($a['status']) ?></span></td>

          <td class="text-end text-nowrap">

            <a href="<?= site_url('admin/affiliates/toggle_discount/'.$a['id']) ?>" class="btn btn-sm btn-outline-<?= !empty($a['discount_active']) ? 'warning' : 'success' ?>" title="Toggle checkout discount"><?= !empty($a['discount_active']) ? 'Disable' : 'Enable' ?></a>

            <a href="<?= site_url('admin/affiliates/view/'.$a['id']) ?>" class="btn btn-sm btn-outline-primary">View</a>

            <a href="<?= site_url('admin/affiliates/edit/'.$a['id']) ?>" class="btn btn-sm btn-outline-secondary">Edit</a>

            <a href="<?= site_url('admin/affiliates/delete/'.$a['id']) ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Remove this affiliate?')">Delete</a>

          </td>

        </tr>

        <?php endforeach; ?>

        <?php if (empty($affiliates)): ?><tr><td colspan="8" class="text-center text-muted py-4">No affiliates found. <a href="<?= site_url('admin/affiliates/add') ?>">Add your first affiliate</a>.</td></tr><?php endif; ?>

      </tbody>

    </table>

  </div>

</div>

