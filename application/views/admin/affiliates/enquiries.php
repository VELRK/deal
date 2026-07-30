<?php
$status_badges = [
    'new'     => 'bg-warning text-dark',
    'read'    => 'bg-secondary',
    'replied' => 'bg-info text-dark',
    'closed'  => 'bg-success',
];
$filters = $filters ?? ['status' => '', 'search' => ''];
$newCount = (int)($enquiry_new_count ?? 0);
?>
<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">
  <div>
    <h5 class="sk-page-title mb-1"><i class="bi bi-megaphone me-2 text-success"></i>Affiliates</h5>
    <small class="text-muted">Website &amp; mobile affiliate enquiry form submissions</small>
  </div>
</div>

<ul class="nav nav-tabs mb-3">
  <li class="nav-item">
    <a class="nav-link" href="<?= site_url('shopkart/affiliates') ?>">Affiliates</a>
  </li>
  <li class="nav-item">
    <a class="nav-link active" href="<?= site_url('shopkart/affiliates/enquiries') ?>">
      Enquiries
      <?php if ($newCount > 0): ?>
        <span class="badge bg-danger ms-1"><?= $newCount ?></span>
      <?php endif; ?>
    </a>
  </li>
</ul>

<div id="alertBox"></div>

<div class="card shadow-sm mb-3">
  <div class="card-body py-3">
    <form method="get" action="<?= site_url('shopkart/affiliates/enquiries') ?>" class="row g-2 align-items-end">
      <div class="col-md-4">
        <label class="form-label small mb-1">Search</label>
        <input type="text" name="search" class="form-control form-control-sm" value="<?= htmlspecialchars($filters['search'] ?? '') ?>" placeholder="Name, email, phone, promo…">
      </div>
      <div class="col-md-3">
        <label class="form-label small mb-1">Status</label>
        <select name="status" class="form-select form-select-sm">
          <option value="">All</option>
          <?php foreach (['new','read','replied','closed'] as $st): ?>
          <option value="<?= $st ?>" <?= ($filters['status'] ?? '') === $st ? 'selected' : '' ?>><?= ucfirst($st) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-md-3">
        <button type="submit" class="btn btn-sm btn-primary">Filter</button>
        <a href="<?= site_url('shopkart/affiliates/enquiries') ?>" class="btn btn-sm btn-outline-secondary">Reset</a>
      </div>
    </form>
  </div>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="sk-table-head">
          <tr>
            <th style="width:50px">#</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Promo</th>
            <th>Message</th>
            <th style="width:90px">Status</th>
            <th style="width:130px">Date</th>
            <th class="text-end" style="width:200px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($enquiries as $i => $e): ?>
          <tr id="row-<?= (int)$e['id'] ?>" class="<?= ($e['status'] ?? '') === 'new' ? 'fw-semibold table-warning' : '' ?>">
            <td class="text-muted small"><?= (int)$e['id'] ?></td>
            <td><?= htmlspecialchars($e['name'] ?? '') ?></td>
            <td class="small">
              <a href="mailto:<?= htmlspecialchars($e['email'] ?? '') ?>"><?= htmlspecialchars($e['email'] ?? '') ?></a>
              <?php if (!empty($e['phone'])): ?>
                <div class="text-muted"><?= htmlspecialchars($e['phone']) ?></div>
              <?php endif; ?>
            </td>
            <td>
              <?php if (!empty($e['promo_code'])): ?>
                <code><?= htmlspecialchars($e['promo_code']) ?></code>
              <?php else: ?>
                <span class="text-muted">—</span>
              <?php endif; ?>
            </td>
            <td class="text-muted small" style="max-width:280px;">
              <span title="<?= htmlspecialchars($e['message'] ?? '') ?>">
                <?= htmlspecialchars(mb_substr((string)($e['message'] ?? ''), 0, 100)) ?><?= mb_strlen((string)($e['message'] ?? '')) > 100 ? '…' : '' ?>
              </span>
            </td>
            <td>
              <span class="badge <?= $status_badges[$e['status'] ?? 'new'] ?? 'bg-secondary' ?>" id="status-<?= (int)$e['id'] ?>">
                <?= ucfirst($e['status'] ?? 'new') ?>
              </span>
            </td>
            <td class="small text-muted"><?= !empty($e['created_at']) ? date('d M Y, h:i A', strtotime($e['created_at'])) : '—' ?></td>
            <td class="text-end text-nowrap">
              <?php if (($e['status'] ?? '') === 'new'): ?>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Mark read" onclick="markEnquiry(<?= (int)$e['id'] ?>, 'read')">
                <i class="bi bi-check2"></i>
              </button>
              <?php endif; ?>
              <a href="<?= site_url('shopkart/affiliates/enquiry_convert/'.(int)$e['id']) ?>" class="btn btn-outline-success btn-sm" title="Create affiliate from enquiry">
                <i class="bi bi-person-plus"></i>
              </a>
              <button type="button" class="btn btn-outline-danger btn-sm" title="Delete" onclick="deleteEnquiry(<?= (int)$e['id'] ?>)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <?php endforeach; ?>
          <?php if (empty($enquiries)): ?>
          <tr>
            <td colspan="8" class="text-center text-muted py-4">
              No affiliate enquiries yet. Submissions from the website / mobile affiliate form will appear here.
            </td>
          </tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
  <?php if (($total ?? 0) > ($limit ?? 25)): ?>
  <div class="card-footer d-flex justify-content-between align-items-center small">
    <span class="text-muted"><?= (int)$total ?> total</span>
    <div class="d-flex gap-1">
      <?php
        $pages = (int)ceil($total / max(1, (int)$limit));
        $qs = http_build_query(array_filter(['status' => $filters['status'] ?? '', 'search' => $filters['search'] ?? '']));
        for ($p = 1; $p <= min($pages, 10); $p++):
      ?>
      <a class="btn btn-sm <?= $p === (int)$page ? 'btn-primary' : 'btn-outline-secondary' ?>"
         href="<?= site_url('shopkart/affiliates/enquiries') ?>?page=<?= $p ?><?= $qs !== '' ? '&'.$qs : '' ?>"><?= $p ?></a>
      <?php endfor; ?>
    </div>
  </div>
  <?php endif; ?>
</div>

<script>
function showAlert(msg, type='success') {
  document.getElementById('alertBox').innerHTML =
    `<div class="alert alert-${type} alert-dismissible fade show py-2 px-3">${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}
function markEnquiry(id, status) {
  const fd = new FormData();
  fd.append('status', status);
  fetch(`<?= site_url('shopkart/affiliates/enquiry_mark') ?>/${id}`, { method: 'POST', body: fd })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        const badge = document.getElementById('status-' + id);
        if (badge) { badge.className = 'badge bg-secondary'; badge.textContent = 'Read'; }
        document.getElementById('row-' + id)?.classList.remove('fw-semibold', 'table-warning');
        showAlert('Marked as read.');
      }
    });
}
function deleteEnquiry(id) {
  if (!confirm('Delete this affiliate enquiry?')) return;
  fetch(`<?= site_url('shopkart/affiliates/enquiry_delete') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        document.getElementById('row-' + id)?.remove();
        showAlert('Enquiry deleted.');
      }
    });
}
</script>
