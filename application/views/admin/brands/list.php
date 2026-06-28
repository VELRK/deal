<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-shop me-2 text-warning"></i>Brands</h5>
  <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#brandModal" onclick="openAddBrand()">
    <i class="bi bi-plus-lg me-1"></i> Add Brand
  </button>
</div>

<?php if ($this->session->flashdata('success')): ?>
  <div class="alert alert-success alert-dismissible fade show"><i class="bi bi-check-circle me-2"></i><?= $this->session->flashdata('success') ?><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
<?php endif; ?>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover align-middle mb-0" id="brandsTable">
      <thead class="sk-table-head">
        <tr>
          <th>#</th>
          <th>Logo</th>
          <th>Brand Name</th>
          <th>Slug</th>
          <th>Status</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($brands as $i => $b): ?>
        <tr id="row-<?= $b['id'] ?>">
          <td class="text-muted small"><?= $i + 1 ?></td>
          <td>
            <?php if ($b['logo']): ?>
              <img src="<?= base_url($b['logo']) ?>" height="36" class="rounded border" style="object-fit:contain;">
            <?php else: ?>
              <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width:36px;height:36px;">
                <i class="bi bi-shop text-muted"></i>
              </div>
            <?php endif; ?>
          </td>
          <td class="fw-semibold"><?= htmlspecialchars($b['name']) ?></td>
          <td><code class="text-muted small"><?= htmlspecialchars($b['slug']) ?></code></td>
          <td>
            <span class="badge <?= $b['status'] ? 'bg-success' : 'bg-secondary' ?>">
              <?= $b['status'] ? 'Active' : 'Inactive' ?>
            </span>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-warning me-1"
              onclick="editBrand(<?= $b['id'] ?>, '<?= htmlspecialchars(addslashes($b['name'])) ?>', <?= $b['status'] ?>)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger"
              onclick="skConfirmDelete('<?= site_url('admin/brands/delete/'.$b['id']) ?>', 'row-<?= $b['id'] ?>')">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($brands)): ?>
          <tr><td colspan="6" class="text-center py-5 text-muted">No brands yet. Add your first brand.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Brand Modal -->
<div class="modal fade" id="brandModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-semibold" id="brandModalTitle">Add Brand</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form id="brandForm" enctype="multipart/form-data">
        <div class="modal-body">
          <input type="hidden" id="brand_id" name="brand_id">
          <div class="mb-3">
            <label class="form-label">Brand Name <span class="text-danger">*</span></label>
            <input type="text" name="name" id="brand_name" class="form-control" required placeholder="e.g. Nalli, Kankatala">
          </div>
          <div class="mb-3" id="statusRow" style="display:none;">
            <label class="form-label">Status</label>
            <select name="status" id="brand_status" class="form-select">
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Logo <small class="text-muted">(optional, PNG/JPG)</small></label>
            <input type="file" name="logo" class="form-control form-control-sm" accept="image/*">
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-warning fw-semibold px-4">Save Brand</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>
let editMode = false;

function openAddBrand() {
  editMode = false;
  document.getElementById('brandModalTitle').textContent = 'Add Brand';
  document.getElementById('brandForm').reset();
  document.getElementById('brand_id').value = '';
  document.getElementById('statusRow').style.display = 'none';
}

function editBrand(id, name, status) {
  editMode = true;
  document.getElementById('brandModalTitle').textContent = 'Edit Brand';
  document.getElementById('brand_id').value = id;
  document.getElementById('brand_name').value = name;
  document.getElementById('brand_status').value = status;
  document.getElementById('statusRow').style.display = 'block';
  new bootstrap.Modal(document.getElementById('brandModal')).show();
}

document.getElementById('brandForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fd  = new FormData(this);
  const id  = document.getElementById('brand_id').value;
  const url = id
    ? '<?= site_url('admin/brands/update') ?>/' + id
    : '<?= site_url('admin/brands/store') ?>';

  fetch(url, { method: 'POST', body: fd })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        bootstrap.Modal.getInstance(document.getElementById('brandModal')).hide();
        location.reload();
      } else {
        alert(data.message || 'Error saving brand');
      }
    });
});
</script>
