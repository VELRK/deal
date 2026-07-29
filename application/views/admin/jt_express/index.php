<?php /** @var array $rows */ /** @var array $filters */ /** @var array $settings */ ?>
<div class="sk-page-header d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
  <div>
    <h5 class="sk-page-title mb-0"><i class="bi bi-truck text-warning me-2"></i>JT Express</h5>
    <div class="small text-muted mt-1">Create AWB, print labels, and view detailed tracking — separate from order page</div>
  </div>
  <div class="d-flex gap-2 align-items-center">
    <?php if (sk_jt_express_is_sandbox($settings)): ?>
      <span class="badge bg-secondary">Sandbox</span>
    <?php else: ?>
      <span class="badge bg-success">Production</span>
    <?php endif; ?>
    <a href="<?= site_url('shopkart/settings') ?>?tab=shipping" class="btn btn-sm btn-outline-secondary">
      <i class="bi bi-gear me-1"></i> JT Settings
    </a>
  </div>
</div>

<?php if (empty($enabled)): ?>
<div class="alert alert-warning">JT Express is disabled. Enable it under <a href="<?= site_url('shopkart/settings') ?>?tab=shipping">Settings → JT Express</a>.</div>
<?php endif; ?>

<form class="card shadow-sm mb-3" method="get">
  <div class="card-body row g-2 align-items-end">
    <div class="col-md-4">
      <label class="form-label small">Search</label>
      <input type="text" name="search" class="form-control form-control-sm"
        value="<?= htmlspecialchars($filters['search'] ?? '') ?>"
        placeholder="Order no, AWB, phone, name">
    </div>
    <div class="col-md-3">
      <label class="form-label small">Scope</label>
      <select name="scope" class="form-select form-select-sm">
        <option value="all" <?= ($filters['scope'] ?? '') === 'all' ? 'selected' : '' ?>>All eligible</option>
        <option value="pending" <?= ($filters['scope'] ?? '') === 'pending' ? 'selected' : '' ?>>Needs AWB</option>
        <option value="created" <?= ($filters['scope'] ?? '') === 'created' ? 'selected' : '' ?>>Has AWB</option>
      </select>
    </div>
    <div class="col-md-2">
      <button type="submit" class="btn btn-sm btn-warning w-100">Filter</button>
    </div>
  </div>
</form>

<div class="card shadow-sm">
  <div class="table-responsive">
    <table class="table table-hover mb-0 align-middle">
      <thead class="table-light">
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>Status</th>
          <th>AWB</th>
          <th>Courier</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($rows)): ?>
        <tr><td colspan="7" class="text-center text-muted py-4">No shipments found.</td></tr>
        <?php else: foreach ($rows as $r): ?>
        <tr>
          <td>
            <a href="<?= site_url('shopkart/orders/view/'.$r['id']) ?>" class="fw-semibold text-decoration-none">
              <?= htmlspecialchars($r['order_number'] ?? '') ?>
            </a>
            <div class="small text-muted"><?= htmlspecialchars($r['shipping_city'] ?? '') ?></div>
          </td>
          <td>
            <div><?= htmlspecialchars($r['customer_name'] ?? $r['shipping_name'] ?? '—') ?></div>
            <div class="small text-muted"><?= htmlspecialchars($r['shipping_phone'] ?? '') ?></div>
          </td>
          <td><span class="badge bg-light text-dark border"><?= htmlspecialchars($r['status'] ?? '') ?></span></td>
          <td>
            <?php if (!empty($r['jt_bill_code'])): ?>
              <code><?= htmlspecialchars($r['jt_bill_code']) ?></code>
            <?php else: ?>
              <span class="text-muted">—</span>
            <?php endif; ?>
          </td>
          <td class="small"><?= htmlspecialchars($r['jt_courier_status'] ?? 'not created') ?></td>
          <td class="small text-muted"><?= !empty($r['jt_shipment_created_at']) ? sk_jt_format_datetime($r['jt_shipment_created_at']) : '—' ?></td>
          <td class="text-end">
            <a href="<?= site_url('shopkart/jt-express/view/'.$r['id']) ?>" class="btn btn-sm btn-warning">
              <i class="bi bi-truck me-1"></i> Manage
            </a>
          </td>
        </tr>
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>
  <?php if (($total ?? 0) > ($limit ?? 20)): ?>
  <div class="card-footer d-flex justify-content-between align-items-center small">
    <span class="text-muted"><?= (int)$total ?> shipments</span>
    <div class="btn-group">
      <?php
        $pages = (int)ceil($total / $limit);
        $qs = http_build_query(array_filter(['scope' => $filters['scope'] ?? null, 'search' => $filters['search'] ?? null]));
        for ($p = 1; $p <= min($pages, 10); $p++):
      ?>
        <a class="btn btn-sm <?= $p === (int)$page ? 'btn-warning' : 'btn-outline-secondary' ?>"
           href="?page=<?= $p ?><?= $qs ? '&'.$qs : '' ?>"><?= $p ?></a>
      <?php endfor; ?>
    </div>
  </div>
  <?php endif; ?>
</div>
