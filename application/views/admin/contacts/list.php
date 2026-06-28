<div class="sk-page-header d-flex align-items-center justify-content-between">
  <h5 class="sk-page-title mb-0"><i class="bi bi-envelope me-2 text-info"></i>Contact Enquiries</h5>
  <span class="badge bg-info text-dark"><?= count($contacts) ?> total</span>
</div>

<div id="alertBox" class="mt-2"></div>

<div class="card sk-table-card shadow-sm mt-3">
  <div class="card-body p-0">
    <table class="table table-hover align-middle mb-0">
      <thead class="sk-table-head">
        <tr>
          <th style="width:40px">#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Message</th>
          <th style="width:90px">Status</th>
          <th style="width:130px">Date</th>
          <th class="text-end" style="width:100px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($contacts as $i => $c): ?>
        <tr id="row-<?= $c['id'] ?>" class="<?= $c['status'] === 'new' ? 'fw-semibold' : '' ?>">
          <td class="text-muted small"><?= $i + 1 ?></td>
          <td><?= htmlspecialchars($c['name']) ?></td>
          <td>
            <a href="mailto:<?= htmlspecialchars($c['email']) ?>" class="link cl-text-2">
              <?= htmlspecialchars($c['email']) ?>
            </a>
          </td>
          <td class="text-muted small" style="max-width:320px;">
            <span title="<?= htmlspecialchars($c['message']) ?>">
              <?= htmlspecialchars(mb_substr($c['message'], 0, 120)) ?><?= mb_strlen($c['message']) > 120 ? '…' : '' ?>
            </span>
          </td>
          <td>
            <span class="badge <?= $c['status'] === 'new' ? 'bg-warning text-dark' : ($c['status'] === 'read' ? 'bg-success' : 'bg-info') ?>" id="status-<?= $c['id'] ?>">
              <?= ucfirst($c['status']) ?>
            </span>
          </td>
          <td class="small text-muted"><?= date('d M Y, h:i A', strtotime($c['created_at'])) ?></td>
          <td class="text-end">
            <?php if ($c['status'] === 'new'): ?>
            <button class="btn btn-outline-success btn-sm me-1" title="Mark Read" onclick="markRead(<?= $c['id'] ?>)">
              <i class="bi bi-check2"></i>
            </button>
            <?php endif; ?>
            <button class="btn btn-outline-danger btn-sm" title="Delete" onclick="deleteContact(<?= $c['id'] ?>)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($contacts)): ?>
        <tr><td colspan="7" class="text-center text-muted py-4">No enquiries yet.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<script>
function showAlert(msg, type='success') {
  document.getElementById('alertBox').innerHTML =
    `<div class="alert alert-${type} alert-dismissible fade show py-2 px-3"><i class="bi bi-${type==='success'?'check-circle':'exclamation-triangle'} me-2"></i>${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}

function markRead(id) {
  fetch(`<?= base_url('admin/contacts/mark_read') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        const badge = document.getElementById('status-' + id);
        badge.className = 'badge bg-success';
        badge.textContent = 'Read';
        document.getElementById('row-' + id).classList.remove('fw-semibold');
        document.querySelector(`#row-${id} button[onclick*="markRead"]`)?.remove();
        showAlert('Marked as read.');
      }
    });
}

function deleteContact(id) {
  if (!confirm('Delete this enquiry?')) return;
  fetch(`<?= base_url('admin/contacts/delete') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        document.getElementById('row-' + id)?.remove();
        showAlert('Enquiry deleted.');
      }
    });
}
</script>
