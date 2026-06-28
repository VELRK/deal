<?php
$status_badges = ['pending' => 'bg-warning text-dark', 'approved' => 'bg-success', 'rejected' => 'bg-danger'];
$is_vendor = !empty($is_vendor);
?>
<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">
  <div>
    <h5 class="sk-page-title mb-1">
      <i class="bi bi-box-seam me-2 text-success"></i>Affiliate Product Requests
    </h5>
    <small class="text-muted">
      <?= (int)($total ?? 0) ?> total
      · <?= (int)($counts['pending'] ?? 0) ?> pending
      <?php if ($is_vendor): ?> · your products only<?php endif; ?>
    </small>
  </div>
</div>

<div class="card sk-table-card shadow-sm mb-3">
  <div class="card-body py-3">
    <form method="get" class="row g-2 align-items-end">
      <div class="col-md-5">
        <input type="text" name="search" class="form-control form-control-sm" placeholder="Search affiliate, product, promo..." value="<?= htmlspecialchars($filters['search'] ?? '') ?>">
      </div>
      <div class="col-md-3">
        <select name="status" class="form-select form-select-sm">
          <option value="">All status</option>
          <?php foreach (['pending', 'approved', 'rejected'] as $st): ?>
          <option value="<?= $st ?>" <?= ($filters['status'] ?? '') === $st ? 'selected' : '' ?>><?= ucfirst($st) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-2"><button class="btn btn-sm btn-dark w-100">Filter</button></div>
    </form>
  </div>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead>
          <tr>
            <th>Affiliate</th>
            <th>Product</th>
            <?php if (!$is_vendor): ?><th>Vendor</th><?php endif; ?>
            <th>Notes</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($requests as $r): ?>
          <?php
            $productLabel = $r['product_name'] ?: ($r['catalog_product_name'] ?: ('Product #' . ($r['product_id'] ?: '—')));
            $st = $r['status'] ?? 'pending';
          ?>
          <tr>
            <td>
              <div class="fw-semibold"><?= htmlspecialchars($r['affiliate_name'] ?? '—') ?></div>
              <small class="text-muted"><?= htmlspecialchars($r['affiliate_email'] ?? '') ?></small>
              <?php if (!empty($r['promo_code'])): ?>
              <div><code class="small"><?= htmlspecialchars($r['promo_code']) ?></code></div>
              <?php endif; ?>
            </td>
            <td>
              <div><?= htmlspecialchars($productLabel) ?></div>
              <?php if (!empty($r['product_id'])): ?>
              <small class="text-muted">Catalog #<?= (int)$r['product_id'] ?></small>
              <?php else: ?>
              <small class="text-muted">Custom request</small>
              <?php endif; ?>
            </td>
            <?php if (!$is_vendor): ?>
            <td><?= htmlspecialchars($r['vendor_name'] ?? '—') ?></td>
            <?php endif; ?>
            <td class="small" style="max-width:220px;">
              <?php if (!empty($r['notes'])): ?>
              <div><?= nl2br(htmlspecialchars($r['notes'])) ?></div>
              <?php endif; ?>
              <?php if (!empty($r['admin_notes'])): ?>
              <div class="text-muted mt-1"><em>Reply: <?= nl2br(htmlspecialchars($r['admin_notes'])) ?></em></div>
              <?php endif; ?>
            </td>
            <td><span class="badge <?= $status_badges[$st] ?? 'bg-secondary' ?>"><?= ucfirst($st) ?></span></td>
            <td class="small text-nowrap"><?= date('d M Y', strtotime($r['created_at'])) ?></td>
            <td class="text-end text-nowrap">
              <?php if ($st === 'pending'): ?>
              <form method="post" action="<?= site_url('admin/affiliate-requests/approve/' . $r['id']) ?>" class="d-inline">
                <input type="hidden" name="admin_notes" value="">
                <button type="submit" class="btn btn-sm btn-success" title="Approve">Approve</button>
              </form>
              <button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#rejectModal<?= (int)$r['id'] ?>">Reject</button>
              <div class="modal fade" id="rejectModal<?= (int)$r['id'] ?>" tabindex="-1">
                <div class="modal-dialog modal-sm">
                  <div class="modal-content">
                    <form method="post" action="<?= site_url('admin/affiliate-requests/reject/' . $r['id']) ?>">
                      <div class="modal-header py-2">
                        <h6 class="modal-title">Reject Request</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div class="modal-body">
                        <label class="form-label small">Reason (optional)</label>
                        <textarea name="admin_notes" class="form-control form-control-sm" rows="2"></textarea>
                      </div>
                      <div class="modal-footer py-2">
                        <button type="submit" class="btn btn-sm btn-danger">Reject</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <?php else: ?>
              <span class="text-muted small"><?= !empty($r['reviewed_at']) ? date('d M Y', strtotime($r['reviewed_at'])) : '—' ?></span>
              <?php endif; ?>
            </td>
          </tr>
          <?php endforeach; ?>
          <?php if (empty($requests)): ?>
          <tr><td colspan="<?= $is_vendor ? 6 : 7 ?>" class="text-center text-muted py-4">No affiliate product requests yet.</td></tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<?php if (($total ?? 0) > 20): ?>
<nav class="mt-3">
  <ul class="pagination pagination-sm justify-content-center">
    <?php
      $pages = (int)ceil($total / 20);
      $cur = (int)($page ?? 1);
      for ($i = 1; $i <= $pages; $i++):
        $qs = http_build_query(array_filter(['search' => $filters['search'] ?? '', 'status' => $filters['status'] ?? '', 'page' => $i]));
    ?>
    <li class="page-item <?= $i === $cur ? 'active' : '' ?>">
      <a class="page-link" href="?<?= $qs ?>"><?= $i ?></a>
    </li>
    <?php endfor; ?>
  </ul>
</nav>
<?php endif; ?>
