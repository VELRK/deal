<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-bank me-2 text-warning"></i>Banks</h5>
  <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#bankModal" onclick="openAddBank()">
    <i class="bi bi-plus-lg me-1"></i> Add Bank
  </button>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover align-middle mb-0">
      <thead class="sk-table-head">
        <tr>
          <th>#</th>
          <th>Bank Name</th>
          <th>Code</th>
          <th>Sort</th>
          <th>Status</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($banks as $i => $b): ?>
        <tr id="row-<?= (int)$b['id'] ?>">
          <td class="text-muted small"><?= $i + 1 ?></td>
          <td class="fw-semibold"><?= htmlspecialchars($b['name']) ?></td>
          <td><code class="text-muted small"><?= htmlspecialchars($b['code'] ?? '—') ?></code></td>
          <td><?= (int)$b['sort_order'] ?></td>
          <td>
            <span class="badge <?= !empty($b['status']) ? 'bg-success' : 'bg-secondary' ?>">
              <?= !empty($b['status']) ? 'Active' : 'Inactive' ?>
            </span>
          </td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-outline-warning me-1"
              onclick='editBank(<?= json_encode($b, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>)'>
              <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-danger"
              onclick="deleteBank(<?= (int)$b['id'] ?>)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($banks)): ?>
          <tr><td colspan="6" class="text-center py-5 text-muted">No banks yet. Add your first bank.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<div class="modal fade" id="bankModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-semibold" id="bankModalTitle">Add Bank</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form id="bankForm">
        <div class="modal-body">
          <input type="hidden" id="bank_id" name="bank_id">
          <div class="mb-3">
            <label class="form-label">Bank Name <span class="text-danger">*</span></label>
            <input type="text" name="name" id="bank_name" class="form-control" required placeholder="e.g. Maybank">
          </div>
          <div class="mb-3">
            <label class="form-label">Code <small class="text-muted">(optional)</small></label>
            <input type="text" name="code" id="bank_code" class="form-control" placeholder="e.g. MBB">
          </div>
          <div class="mb-3">
            <label class="form-label">Sort order</label>
            <input type="number" name="sort_order" id="bank_sort" class="form-control" value="0">
          </div>
          <div class="mb-3" id="bankStatusRow" style="display:none;">
            <label class="form-label">Status</label>
            <select name="status" id="bank_status" class="form-select">
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-warning fw-semibold px-4">Save Bank</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>
function openAddBank() {
  document.getElementById('bankModalTitle').textContent = 'Add Bank';
  document.getElementById('bankForm').reset();
  document.getElementById('bank_id').value = '';
  document.getElementById('bankStatusRow').style.display = 'none';
}

function editBank(b) {
  document.getElementById('bankModalTitle').textContent = 'Edit Bank';
  document.getElementById('bank_id').value = b.id;
  document.getElementById('bank_name').value = b.name || '';
  document.getElementById('bank_code').value = b.code || '';
  document.getElementById('bank_sort').value = b.sort_order || 0;
  document.getElementById('bank_status').value = b.status ? 1 : 0;
  document.getElementById('bankStatusRow').style.display = 'block';
  new bootstrap.Modal(document.getElementById('bankModal')).show();
}

function deleteBank(id) {
  if (!confirm('Delete this bank?')) return;
  fetch('<?= site_url('admin/banks/delete') ?>/' + id, { method: 'POST' })
    .then(r => r.json())
    .then(data => {
      if (data.success) location.reload();
      else alert(data.message || 'Delete failed');
    });
}

document.getElementById('bankForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fd = new FormData(this);
  const id = document.getElementById('bank_id').value;
  const url = id
    ? '<?= site_url('admin/banks/update') ?>/' + id
    : '<?= site_url('admin/banks/store') ?>';
  fetch(url, { method: 'POST', body: fd })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        bootstrap.Modal.getInstance(document.getElementById('bankModal')).hide();
        location.reload();
      } else {
        alert(data.message || 'Error saving bank');
      }
    });
});
</script>
