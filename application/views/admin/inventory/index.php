<?php
/** @var array $rows */ /** @var array $filters */ /** @var int $total */ /** @var int $page */ /** @var int $limit */
$currency = $settings['currency_symbol'] ?? 'RM';
$pages = max(1, (int)ceil($total / $limit));
?>
<div class="sk-page-header d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
  <div>
    <h5 class="sk-page-title mb-0"><i class="bi bi-boxes text-warning me-2"></i>Inventory</h5>
    <div class="small text-muted mt-1">Edit stock inline per product or pack variant — no need to open full product edit</div>
  </div>
  <div class="d-flex gap-2">
    <?php if (!empty($neg_count)): ?>
    <a href="<?= site_url('shopkart/inventory') ?>?fix_stock=1" class="btn btn-sm btn-outline-danger"
       onclick="return confirm('Reset all negative stock values to 0? You can then edit products to set the correct quantity.');">
      <i class="bi bi-exclamation-triangle me-1"></i> Fix <?= (int)$neg_count ?> negative stock
    </a>
    <?php endif; ?>
    <a href="<?= site_url('shopkart/products') ?>" class="btn btn-sm btn-outline-secondary">
      <i class="bi bi-box-seam me-1"></i> Manage products
    </a>
  </div>
</div>

<?php if ($this->session->flashdata('success')): ?>
<div class="alert alert-success"><?= $this->session->flashdata('success') ?></div>
<?php endif; ?>

<?php if (!empty($neg_count)): ?>
<div class="alert alert-danger">
  <strong><?= (int)$neg_count ?> product(s)</strong> have negative stock (e.g. -47).
  Customers cannot buy them (app may show out of stock / not available).
  Click <strong>Fix negative stock</strong>, then set the real quantity on each pack.
</div>
<?php endif; ?>

<form class="card sk-table-card shadow-sm mb-3" method="get">
  <div class="card-body row g-2 align-items-end py-2">
    <div class="col-md-4">
      <label class="form-label small">Search</label>
      <input type="text" name="search" class="form-control form-control-sm"
        value="<?= htmlspecialchars($filters['search'] ?? '') ?>"
        placeholder="Name or SKU">
    </div>
    <?php if (!empty($vendors)): ?>
    <div class="col-md-3">
      <label class="form-label small">Vendor</label>
      <select name="vendor_id" class="form-select form-select-sm">
        <option value="">All vendors</option>
        <?php foreach ($vendors as $v): ?>
        <option value="<?= $v['id'] ?>" <?= ($vendor_id ?? '') == $v['id'] ? 'selected' : '' ?>>
          <?= htmlspecialchars($v['business_name']) ?>
        </option>
        <?php endforeach; ?>
      </select>
    </div>
    <?php endif; ?>
    <div class="col-md-3">
      <div class="form-check mt-2">
        <input class="form-check-input" type="checkbox" name="low_only" value="1" id="lowOnly"
          <?= !empty($filters['low_only']) ? 'checked' : '' ?>>
        <label class="form-check-label small" for="lowOnly">Low stock only</label>
      </div>
    </div>
    <div class="col-md-2">
      <button type="submit" class="btn btn-sm btn-warning w-100">Filter</button>
    </div>
  </div>
</form>

<div class="card sk-table-card shadow-sm">
  <div class="table-responsive">
    <table class="table table-hover mb-0 align-middle">
      <thead class="table-light">
        <tr>
          <th style="width:56px;">Image</th>
          <th>Product / pack stock</th>
          <?php if (empty($vendor_id) && empty($impersonating)): ?><th>Vendor</th><?php endif; ?>
          <th>Category</th>
          <th>Total</th>
          <th>Alert</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $p): ?>
        <?php
          $alert = (int)($p['low_stock_alert'] ?? 5);
          $stockQty = (int)$p['stock'];
          $isOut = $stockQty <= 0;
          $isLow = !$isOut && $stockQty <= $alert;
          $variants = $p['variants'] ?? [];
          $hasVariants = !empty($variants);
        ?>
        <tr class="<?= $isOut ? 'table-danger' : '' ?>" data-product-id="<?= (int)$p['id'] ?>">
          <td>
            <?php if (!empty($p['thumbnail'])): ?>
              <img src="<?= base_url($p['thumbnail']) ?>" class="rounded" width="48" height="48" style="object-fit:cover;">
            <?php else: ?>
              <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width:48px;height:48px;">
                <i class="bi bi-image text-muted"></i>
              </div>
            <?php endif; ?>
          </td>
          <td style="min-width:280px;">
            <div class="fw-semibold"><?= htmlspecialchars($p['name']) ?></div>
            <small class="text-muted"><?= $p['sku'] ? 'SKU: ' . htmlspecialchars($p['sku']) : '' ?></small>
            <?php if ($hasVariants): ?>
              <div class="mt-2 inv-variant-stocks">
                <?php foreach ($variants as $v): ?>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span class="small text-muted" style="min-width:90px;"><?= htmlspecialchars($v['label'] ?? 'Pack') ?></span>
                  <input type="number" min="0" class="form-control form-control-sm inv-stock-input"
                    style="width:88px;"
                    data-product-id="<?= (int)$p['id'] ?>"
                    data-variant-id="<?= (int)$v['id'] ?>"
                    value="<?= (int)$v['stock'] ?>"
                    title="Stock for this pack">
                  <button type="button" class="btn btn-sm btn-outline-success inv-stock-save" title="Save">
                    <i class="bi bi-check-lg"></i>
                  </button>
                </div>
                <?php endforeach; ?>
              </div>
            <?php else: ?>
              <div class="d-flex align-items-center gap-2 mt-2">
                <input type="number" min="0" class="form-control form-control-sm inv-stock-input"
                  style="width:88px;"
                  data-product-id="<?= (int)$p['id'] ?>"
                  data-variant-id="0"
                  value="<?= $stockQty ?>">
                <button type="button" class="btn btn-sm btn-outline-success inv-stock-save" title="Save">
                  <i class="bi bi-check-lg"></i>
                </button>
              </div>
            <?php endif; ?>
            <div class="small text-success inv-stock-msg d-none mt-1"></div>
          </td>
          <?php if (empty($vendor_id) && empty($impersonating)): ?>
          <td><small><?= htmlspecialchars($p['vendor_name'] ?? '—') ?></small></td>
          <?php endif; ?>
          <td><?= htmlspecialchars($p['category_name'] ?? '—') ?></td>
          <td class="inv-product-total">
            <?php if ($isOut): ?>
              <span class="badge bg-dark"><?= number_format($stockQty) ?> Out</span>
            <?php elseif ($isLow): ?>
              <span class="badge bg-danger"><?= number_format($stockQty) ?> Low</span>
            <?php else: ?>
              <span class="fw-semibold"><?= number_format($stockQty) ?></span>
            <?php endif; ?>
          </td>
          <td class="small text-muted"><?= $alert ?></td>
          <td><span class="badge bg-<?= $p['status'] === 'active' ? 'success' : 'secondary' ?>"><?= ucfirst($p['status']) ?></span></td>
          <td>
            <a href="<?= site_url('shopkart/inventory/view/'.$p['id']) ?>" class="btn btn-sm btn-warning">
              <i class="bi bi-eye me-1"></i> View
            </a>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($rows)): ?>
        <tr><td colspan="8" class="text-center py-5 text-muted">No products found.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
  <?php if ($pages > 1): ?>
  <div class="card-footer bg-white d-flex justify-content-between align-items-center py-2">
    <small class="text-muted"><?= number_format($total) ?> product(s)</small>
    <nav>
      <ul class="pagination pagination-sm mb-0">
        <?php if ($page > 1): ?>
        <li class="page-item">
          <a class="page-link" href="?<?= http_build_query(array_merge($filters, ['page' => $page - 1])) ?>">Prev</a>
        </li>
        <?php endif; ?>
        <li class="page-item disabled"><span class="page-link"><?= $page ?> / <?= $pages ?></span></li>
        <?php if ($page < $pages): ?>
        <li class="page-item">
          <a class="page-link" href="?<?= http_build_query(array_merge($filters, ['page' => $page + 1])) ?>">Next</a>
        </li>
        <?php endif; ?>
      </ul>
    </nav>
  </div>
  <?php endif; ?>
</div>

<script>
(function() {
  var url = <?= json_encode(site_url('shopkart/inventory/update_stock')) ?>;

  function saveStock(input, btn) {
    var productId = input.getAttribute('data-product-id');
    var variantId = input.getAttribute('data-variant-id') || '0';
    var stock = parseInt(input.value, 10);
    if (isNaN(stock) || stock < 0) stock = 0;
    input.value = stock;
    if (btn) btn.disabled = true;
    var row = input.closest('tr');
    var msg = row ? row.querySelector('.inv-stock-msg') : null;
    $.post(url, { product_id: productId, variant_id: variantId, stock: stock }, function(res) {
      if (btn) btn.disabled = false;
      if (!res || !res.success) {
        alert((res && res.message) || 'Could not update stock.');
        return;
      }
      if (msg) {
        msg.textContent = res.message || 'Saved';
        msg.classList.remove('d-none', 'text-danger');
        msg.classList.add('text-success');
        setTimeout(function() { msg.classList.add('d-none'); }, 2000);
      }
      if (row && typeof res.product_stock !== 'undefined') {
        var totalCell = row.querySelector('.inv-product-total');
        if (totalCell) {
          var t = parseInt(res.product_stock, 10) || 0;
          if (t <= 0) totalCell.innerHTML = '<span class="badge bg-dark">' + t + ' Out</span>';
          else totalCell.innerHTML = '<span class="fw-semibold">' + t.toLocaleString() + '</span>';
        }
      }
    }, 'json').fail(function() {
      if (btn) btn.disabled = false;
      alert('Network error.');
    });
  }

  document.querySelectorAll('.inv-stock-save').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var wrap = btn.closest('div');
      var input = wrap ? wrap.querySelector('.inv-stock-input') : null;
      if (input) saveStock(input, btn);
    });
  });
  document.querySelectorAll('.inv-stock-input').forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var wrap = input.closest('div');
        var btn = wrap ? wrap.querySelector('.inv-stock-save') : null;
        saveStock(input, btn);
      }
    });
  });
})();
</script>
