<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-box-seam me-2 text-warning"></i>Products</h5>
  <a href="<?= site_url('admin/products/add') ?>" class="btn btn-warning btn-sm fw-semibold">
    <i class="bi bi-plus-lg me-1"></i> Add Product
  </a>
</div>

<!-- Search -->
<div class="card sk-table-card shadow-sm mb-3">
  <div class="card-body py-2">
    <form method="GET" class="row g-2 align-items-center">
      <div class="col-md-4">
        <input type="text" name="search" class="form-control form-control-sm" placeholder="Search by name or SKU..."
               value="<?= htmlspecialchars($search ?? '') ?>">
      </div>
      <?php if (!empty($vendors)): ?>
      <div class="col-md-3">
        <select name="vendor_id" class="form-select form-select-sm">
          <option value="">All vendors</option>
          <?php foreach ($vendors as $v): ?>
          <option value="<?= $v['id'] ?>" <?= ($vendor_id ?? '') == $v['id'] ? 'selected' : '' ?>><?= htmlspecialchars($v['business_name']) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <?php endif; ?>
      <div class="col-auto">
        <button class="btn btn-sm btn-outline-warning px-3">Search</button>
        <a href="<?= site_url('admin/products') ?>" class="btn btn-sm btn-outline-secondary">Reset</a>
      </div>
    </form>
  </div>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th style="width:60px;">Image</th>
            <th>Name</th>
            <?php if (empty($vendor_id) && empty($impersonating)): ?><th>Vendor</th><?php endif; ?>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($products as $p): ?>
          <tr>
            <td>
              <?php if ($p['thumbnail']): ?>
                <img src="<?= base_url($p['thumbnail']) ?>" class="rounded" width="48" height="48" style="object-fit:cover;">
              <?php else: ?>
                <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width:48px;height:48px;">
                  <i class="bi bi-image text-muted"></i>
                </div>
              <?php endif; ?>
            </td>
            <td>
              <div class="fw-semibold"><?= htmlspecialchars($p['name']) ?></div>
              <small class="text-muted"><?= $p['sku'] ? 'SKU: ' . htmlspecialchars($p['sku']) : '' ?></small>
              <?php if ($p['saree_type'] ?? null): ?>
                <span class="badge bg-warning text-dark ms-1 small"><?= htmlspecialchars($p['saree_type']) ?></span>
              <?php endif; ?>
              <?php if ($p['fabric'] ?? null): ?>
                <span class="badge bg-light text-secondary border small"><?= htmlspecialchars($p['fabric']) ?></span>
              <?php endif; ?>
            </td>
            <?php if (empty($vendor_id) && empty($impersonating)): ?>
            <td><small><?= htmlspecialchars($p['vendor_name'] ?? '—') ?></small></td>
            <?php endif; ?>
            <td><?= htmlspecialchars($p['category_name'] ?? '-') ?></td>
            <td>
              <?php if ($p['sale_price']): ?>
                <span class="text-success fw-semibold"><?= $currency . number_format($p['sale_price'],2) ?></span>
                <del class="text-muted small ms-1"><?= $currency . number_format($p['price'],2) ?></del>
              <?php else: ?>
                <?= $currency . number_format($p['price'],2) ?>
              <?php endif; ?>
            </td>
            <td>
              <?php if ($p['stock'] <= 5): ?>
                <span class="badge bg-danger"><?= $p['stock'] ?> Low</span>
              <?php else: ?>
                <?= number_format($p['stock']) ?>
              <?php endif; ?>
            </td>
            <td>
              <button onclick="skToggleStatus('<?= site_url('admin/products/toggle/'.$p['id']) ?>', this)"
                      class="btn btn-sm <?= $p['status']==='active' ? 'btn-success' : 'btn-secondary' ?>">
                <?= ucfirst($p['status']) ?>
              </button>
            </td>
            <td>
              <a href="<?= site_url('admin/products/edit/'.$p['id']) ?>" class="btn btn-sm btn-outline-primary me-1">
                <i class="bi bi-pencil"></i>
              </a>
              <button onclick="skConfirmDelete('<?= site_url('admin/products/delete/'.$p['id']) ?>','<?= htmlspecialchars($p['name']) ?>')"
                      class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <?php endforeach; ?>
          <?php if (empty($products)): ?>
          <tr><td colspan="7" class="text-center py-5 text-muted">No products found.</td></tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Pagination -->
  <?php
  $pages = ceil($total / $limit);
  if ($pages > 1):
  ?>
  <div class="card-footer bg-white d-flex justify-content-between align-items-center">
    <small class="text-muted">Showing <?= ($page-1)*$limit+1 ?>–<?= min($page*$limit,$total) ?> of <?= $total ?></small>
    <nav>
      <ul class="pagination pagination-sm mb-0">
        <?php for ($i = 1; $i <= $pages; $i++): ?>
          <li class="page-item <?= $i===$page?'active':'' ?>">
            <a class="page-link" href="?page=<?= $i ?>&search=<?= urlencode($search??'') ?>"><?= $i ?></a>
          </li>
        <?php endfor; ?>
      </ul>
    </nav>
  </div>
  <?php endif; ?>
</div>
