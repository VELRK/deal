<?php
$currency = $settings['currency_symbol'] ?? 'RM';
$f = $filters ?? [];
$queryParams = array_filter([
    'search'         => $f['search'] ?? '',
    'vendor_id'      => $f['vendor_id'] ?? '',
    'category_id'    => !empty($f['category_id']) ? (int)$f['category_id'] : '',
    'subcategory_id' => !empty($f['subcategory_id']) ? (int)$f['subcategory_id'] : '',
    'status'         => $f['status'] ?? '',
    'low_stock'      => !empty($f['low_stock']) ? '1' : '',
    'min_price'      => ($f['min_price'] ?? '') !== '' && ($f['min_price'] ?? '') !== null ? $f['min_price'] : '',
    'max_price'      => ($f['max_price'] ?? '') !== '' && ($f['max_price'] ?? '') !== null ? $f['max_price'] : '',
], function ($v) { return $v !== '' && $v !== null; });
$filterQuery = http_build_query($queryParams);
?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-box-seam me-2 text-warning"></i>Products</h5>
  <a href="<?= site_url('shopkart/products/add') ?>" class="btn btn-warning btn-sm fw-semibold">
    <i class="bi bi-plus-lg me-1"></i> Add Product
  </a>
</div>

<!-- Filters -->
<div class="card sk-table-card shadow-sm mb-3">
  <div class="card-body py-2">
    <form method="GET" class="row g-2 align-items-end" id="productFilterForm">
      <div class="col-md-3">
        <label class="form-label small mb-1">Search</label>
        <input type="text" name="search" class="form-control form-control-sm" placeholder="Name or SKU..."
               value="<?= htmlspecialchars($f['search'] ?? '') ?>">
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Category</label>
        <select name="category_id" id="filterCategoryId" class="form-select form-select-sm">
          <option value="">All categories</option>
          <?php foreach ($categories ?? [] as $c): ?>
            <option value="<?= $c['id'] ?>" <?= ((int)($f['category_id'] ?? 0) === (int)$c['id']) ? 'selected' : '' ?>>
              <?= htmlspecialchars($c['name']) ?>
            </option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Subcategory</label>
        <select name="subcategory_id" id="filterSubcategoryId" class="form-select form-select-sm">
          <option value="">All subcategories</option>
          <?php foreach ($subcategories ?? [] as $s): ?>
            <option value="<?= $s['id'] ?>" data-category="<?= (int)$s['category_id'] ?>"
              <?= ((int)($f['subcategory_id'] ?? 0) === (int)$s['id']) ? 'selected' : '' ?>>
              <?= htmlspecialchars($s['name']) ?>
            </option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Status</label>
        <select name="status" class="form-select form-select-sm">
          <option value="">All status</option>
          <?php foreach (['active', 'inactive', 'draft'] as $st): ?>
            <option value="<?= $st ?>" <?= ($f['status'] ?? '') === $st ? 'selected' : '' ?>><?= ucfirst($st) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">Min RM</label>
        <input type="number" name="min_price" class="form-control form-control-sm" step="0.01" min="0"
               value="<?= htmlspecialchars((string)($f['min_price'] ?? '')) ?>" placeholder="0">
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">Max RM</label>
        <input type="number" name="max_price" class="form-control form-control-sm" step="0.01" min="0"
               value="<?= htmlspecialchars((string)($f['max_price'] ?? '')) ?>" placeholder="Any">
      </div>
      <?php if (!empty($vendors)): ?>
      <div class="col-md-2">
        <label class="form-label small mb-1">Vendor</label>
        <select name="vendor_id" class="form-select form-select-sm">
          <option value="">All vendors</option>
          <?php foreach ($vendors as $v): ?>
          <option value="<?= $v['id'] ?>" <?= ($vendor_id ?? '') == $v['id'] ? 'selected' : '' ?>><?= htmlspecialchars($v['business_name']) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <?php endif; ?>
      <div class="col-md-2">
        <div class="form-check mt-4">
          <input class="form-check-input" type="checkbox" name="low_stock" value="1" id="lowStockCheck"
                 <?= !empty($f['low_stock']) ? 'checked' : '' ?>>
          <label class="form-check-label small" for="lowStockCheck">Low stock only</label>
        </div>
      </div>
      <div class="col-auto">
        <button class="btn btn-sm btn-outline-warning px-3">Filter</button>
        <a href="<?= site_url('shopkart/products') ?>" class="btn btn-sm btn-outline-secondary">Reset</a>
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
            <th>Subcategory</th>
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
                <img src="<?= base_url($p['thumbnail']) ?>?v=<?= (int)@filemtime(FCPATH . $p['thumbnail']) ?>" class="rounded" width="48" height="48" style="object-fit:cover;">
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
            <td><?= htmlspecialchars($p['subcategory_name'] ?? '—') ?></td>
            <td>
              <?php if (!empty($p['variants'])): ?>
                <?php foreach ($p['variants'] as $vi => $vr): ?>
                  <div class="<?= $vi > 0 ? 'mt-1' : '' ?>" style="white-space:nowrap;">
                    <small class="text-muted"><?= htmlspecialchars($vr['unit_value'] . ($vr['unit_symbol'] ?? '')) ?>:</small>
                    <?php if (!empty($vr['sale_price'])): ?>
                      <span class="text-success fw-semibold"><?= $currency . number_format($vr['sale_price'],2) ?></span>
                      <del class="text-muted small"><?= $currency . number_format($vr['price'],2) ?></del>
                    <?php else: ?>
                      <span><?= $currency . number_format($vr['price'],2) ?></span>
                    <?php endif; ?>
                  </div>
                <?php endforeach; ?>
              <?php elseif ($p['sale_price']): ?>
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
              <button onclick="skToggleStatus('<?= site_url('shopkart/products/toggle/'.$p['id']) ?>', this)"
                      class="btn btn-sm <?= $p['status']==='active' ? 'btn-success' : 'btn-secondary' ?>">
                <?= ucfirst($p['status']) ?>
              </button>
            </td>
            <td>
              <a href="<?= site_url('shopkart/products/edit/'.$p['id']) ?>" class="btn btn-sm btn-outline-primary me-1">
                <i class="bi bi-pencil"></i>
              </a>
              <button onclick="skConfirmDelete('<?= site_url('shopkart/products/delete/'.$p['id']) ?>','<?= htmlspecialchars($p['name']) ?>')"
                      class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <?php endforeach; ?>
          <?php if (empty($products)): ?>
          <tr><td colspan="9" class="text-center py-5 text-muted">No products found.</td></tr>
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
            <a class="page-link" href="?<?= $filterQuery ? $filterQuery . '&' : '' ?>page=<?= $i ?>"><?= $i ?></a>
          </li>
        <?php endfor; ?>
      </ul>
    </nav>
  </div>
  <?php endif; ?>
</div>

<script>
(function() {
  var catSel = document.getElementById('filterCategoryId');
  var subSel = document.getElementById('filterSubcategoryId');
  if (!catSel || !subSel) return;

  function filterSubcategories() {
    var catId = catSel.value;
    var selected = subSel.value;
    Array.from(subSel.options).forEach(function(opt, idx) {
      if (idx === 0) {
        opt.hidden = false;
        return;
      }
      var match = !catId || opt.dataset.category === catId;
      opt.hidden = !match;
      if (!match && opt.selected) subSel.value = '';
    });
    if (selected && subSel.querySelector('option[value="' + selected + '"]')?.hidden) {
      subSel.value = '';
    }
  }

  catSel.addEventListener('change', filterSubcategories);
  filterSubcategories();
})();
</script>
