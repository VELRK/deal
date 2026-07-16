<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-rulers me-2 text-warning"></i>Variant Units</h5>
  <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#unitModal" onclick="openAddUnit()">
    <i class="bi bi-plus-lg me-1"></i> Add Unit
  </button>
</div>

<?php if ($this->session->flashdata('success')): ?>
  <div class="alert alert-success alert-dismissible fade show"><?= $this->session->flashdata('success') ?><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
<?php endif; ?>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover align-middle mb-0">
      <thead class="sk-table-head">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Type</th>
          <th>Sort</th>
          <th>Status</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($units as $i => $u): ?>
        <tr id="row-<?= $u['id'] ?>">
          <td class="text-muted small"><?= $i + 1 ?></td>
          <td class="fw-semibold"><?= htmlspecialchars($u['name']) ?></td>
          <td><code><?= htmlspecialchars($u['symbol']) ?></code></td>
          <td><span class="badge bg-light text-dark border text-capitalize"><?= htmlspecialchars($u['unit_type']) ?></span></td>
          <td><?= (int)$u['sort_order'] ?></td>
          <td>
            <span class="badge <?= $u['status'] ? 'bg-success' : 'bg-secondary' ?>">
              <?= $u['status'] ? 'Active' : 'Inactive' ?>
            </span>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-warning me-1"
              onclick='editUnit(<?= json_encode($u, JSON_HEX_APOS | JSON_HEX_QUOT) ?>)'>
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger"
              onclick="skConfirmDelete('<?= site_url('shopkart/variant-units/delete/'.$u['id']) ?>', 'row-<?= $u['id'] ?>')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($units)): ?>
          <tr><td colspan="7" class="text-center py-5 text-muted">No units yet. Add kg, gram, box, litre, etc.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<div class="modal fade" id="unitModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-semibold" id="unitModalTitle">Add Unit</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form id="unitForm">
        <div class="modal-body">
          <input type="hidden" id="unit_id" name="unit_id">
          <div class="mb-3">
            <label class="form-label">Name <span class="text-danger">*</span></label>
            <input type="text" name="name" id="unit_name" class="form-control" required placeholder="e.g. Kilogram, Box, Dozen">
          </div>
          <div class="mb-3">
            <label class="form-label">Symbol / Abbreviation</label>
            <input type="text" name="symbol" id="unit_symbol" class="form-control" placeholder="e.g. kg, g, box">
          </div>
          <div class="mb-3">
            <label class="form-label">Unit Type</label>
            <select name="unit_type" id="unit_type" class="form-select">
              <option value="weight">Weight</option>
              <option value="volume">Volume</option>
              <option value="count">Count / Pack</option>
              <option value="length">Length</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Sort Order</label>
            <input type="number" name="sort_order" id="unit_sort" class="form-control" value="0">
          </div>
          <div class="mb-3" id="statusRow" style="display:none;">
            <label class="form-label">Status</label>
            <select name="status" id="unit_status" class="form-select">
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-warning fw-semibold px-4">Save Unit</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>
function openAddUnit() {
  document.getElementById('unitModalTitle').textContent = 'Add Unit';
  document.getElementById('unitForm').reset();
  document.getElementById('unit_id').value = '';
  document.getElementById('statusRow').style.display = 'none';
}

function editUnit(u) {
  document.getElementById('unitModalTitle').textContent = 'Edit Unit';
  document.getElementById('unit_id').value = u.id;
  document.getElementById('unit_name').value = u.name;
  document.getElementById('unit_symbol').value = u.symbol;
  document.getElementById('unit_type').value = u.unit_type;
  document.getElementById('unit_sort').value = u.sort_order;
  document.getElementById('unit_status').value = u.status;
  document.getElementById('statusRow').style.display = 'block';
  new bootstrap.Modal(document.getElementById('unitModal')).show();
}

document.getElementById('unitForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fd = new FormData(this);
  const id = document.getElementById('unit_id').value;
  const url = id
    ? '<?= site_url('shopkart/variant-units/update') ?>/' + id
    : '<?= site_url('shopkart/variant-units/store') ?>';
  fetch(url, { method: 'POST', body: fd })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        bootstrap.Modal.getInstance(document.getElementById('unitModal')).hide();
        location.reload();
      } else {
        alert(data.message || 'Error saving unit');
      }
    });
});
</script>
