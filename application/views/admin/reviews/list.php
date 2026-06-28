<div class="sk-page-header d-flex align-items-center justify-content-between">
  <h5 class="sk-page-title mb-0"><i class="bi bi-star-half me-2 text-warning"></i>Product Reviews</h5>
</div>

<div id="alertBox" class="mt-2"></div>

<!-- Status tabs -->
<ul class="nav nav-tabs mt-3 mb-3" id="reviewTabs">
  <?php foreach (['pending'=>'Pending','approved'=>'Approved','rejected'=>'Rejected'] as $s=>$label): ?>
  <li class="nav-item">
    <a class="nav-link <?= $status===$s?'active':'' ?>" href="<?= site_url('admin/reviews?status='.$s) ?>">
      <?= $label ?>
      <span class="badge <?= $s==='pending'?'bg-warning text-dark':($s==='approved'?'bg-success':'bg-secondary') ?> ms-1">
        <?= $counts[$s] ?>
      </span>
    </a>
  </li>
  <?php endforeach; ?>
</ul>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover align-middle mb-0">
      <thead class="sk-table-head">
        <tr>
          <th style="width:40px">#</th>
          <th>Product</th>
          <th>Customer</th>
          <th style="width:90px">Rating</th>
          <th>Review</th>
          <th style="width:120px">Date</th>
          <th class="text-end" style="width:140px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($reviews as $i => $r): ?>
        <tr id="row-<?= $r['id'] ?>">
          <td class="text-muted small"><?= $i+1 ?></td>
          <td class="fw-semibold small"><?= htmlspecialchars($r['product_name'] ?? 'N/A') ?></td>
          <td>
            <div class="fw-medium small"><?= htmlspecialchars($r['user_name'] ?? 'Guest') ?></div>
            <div class="text-muted" style="font-size:.75rem"><?= htmlspecialchars($r['user_email'] ?? '') ?></div>
          </td>
          <td>
            <?php for ($s=1;$s<=5;$s++): ?>
              <i class="bi bi-star<?= $s<=$r['rating']?'-fill text-warning':'' ?>" style="font-size:.7rem"></i>
            <?php endfor; ?>
            <span class="small ms-1"><?= $r['rating'] ?>/5</span>
          </td>
          <td class="small text-muted" style="max-width:280px">
            <?php if ($r['title']): ?><div class="fw-semibold text-dark"><?= htmlspecialchars($r['title']) ?></div><?php endif; ?>
            <span title="<?= htmlspecialchars($r['body'] ?? '') ?>">
              <?= htmlspecialchars(mb_substr($r['body'] ?? '', 0, 100)) ?><?= mb_strlen($r['body'] ?? '') > 100 ? '…' : '' ?>
            </span>
          </td>
          <td class="small text-muted"><?= date('d M Y', strtotime($r['created_at'])) ?></td>
          <td class="text-end">
            <?php if ($r['status'] !== 'approved'): ?>
            <button class="btn btn-outline-success btn-sm me-1" title="Approve" onclick="setStatus(<?= $r['id'] ?>,'approve')">
              <i class="bi bi-check-lg"></i>
            </button>
            <?php endif; ?>
            <?php if ($r['status'] !== 'rejected'): ?>
            <button class="btn btn-outline-warning btn-sm me-1" title="Reject" onclick="setStatus(<?= $r['id'] ?>,'reject')">
              <i class="bi bi-x-lg"></i>
            </button>
            <?php endif; ?>
            <button class="btn btn-outline-danger btn-sm" title="Delete" onclick="deleteReview(<?= $r['id'] ?>)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($reviews)): ?>
        <tr><td colspan="7" class="text-center text-muted py-4">No <?= $status ?> reviews.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<script>
function showAlert(msg, type='success') {
  document.getElementById('alertBox').innerHTML =
    `<div class="alert alert-${type} alert-dismissible fade show"><i class="bi bi-${type==='success'?'check-circle':'exclamation-triangle'} me-2"></i>${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}
function setStatus(id, action) {
  fetch(`<?= base_url('admin/reviews/') ?>${action}/${id}`, {method:'POST'})
    .then(r=>r.json()).then(res=>{
      if (res.success) { showAlert(`Review ${action}d.`); setTimeout(()=>location.reload(),700); }
    });
}
function deleteReview(id) {
  if (!confirm('Delete this review permanently?')) return;
  fetch(`<?= base_url('admin/reviews/delete/') ?>${id}`, {method:'POST'})
    .then(r=>r.json()).then(res=>{
      if (res.success) { document.getElementById('row-'+id)?.remove(); showAlert('Review deleted.'); }
    });
}
</script>
