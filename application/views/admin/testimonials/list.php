<div class="sk-page-header d-flex align-items-center justify-content-between">
  <h5 class="sk-page-title mb-0"><i class="bi bi-chat-quote me-2 text-warning"></i>Testimonials</h5>
  <button class="btn btn-warning btn-sm" onclick="openAdd()" data-bs-toggle="modal" data-bs-target="#testiModal">
    <i class="bi bi-plus-lg me-1"></i> Add Testimonial
  </button>
</div>

<div id="alertBox" class="mt-2"></div>

<div class="card sk-table-card shadow-sm mt-3">
  <div class="card-body p-0">
    <table class="table table-hover align-middle mb-0">
      <thead class="sk-table-head">
        <tr>
          <th style="width:40px">#</th>
          <th>Author</th>
          <th>Quote</th>
          <th>Rating</th>
          <th>Product</th>
          <th style="width:80px">Order</th>
          <th style="width:90px">Status</th>
          <th class="text-end" style="width:120px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($testimonials as $i => $t): ?>
        <tr id="row-<?= $t['id'] ?>">
          <td class="text-muted small"><?= $i + 1 ?></td>
          <td>
            <div class="fw-semibold"><?= htmlspecialchars($t['author_name']) ?></div>
            <?php if ($t['author_title']): ?>
            <small class="text-muted"><?= htmlspecialchars($t['author_title']) ?></small>
            <?php endif; ?>
          </td>
          <td class="text-muted small" style="max-width:300px;">
            <span title="<?= htmlspecialchars($t['quote']) ?>">
              <?= htmlspecialchars(mb_substr($t['quote'], 0, 100)) ?><?= mb_strlen($t['quote']) > 100 ? '…' : '' ?>
            </span>
          </td>
          <td>
            <?php for ($s = 1; $s <= 5; $s++): ?>
              <i class="bi bi-star<?= $s <= $t['rating'] ? '-fill text-warning' : '' ?>" style="font-size:.75rem;"></i>
            <?php endfor; ?>
          </td>
          <td class="small text-muted">
            <?= isset($products_map[$t['product_id']]) ? htmlspecialchars($products_map[$t['product_id']]) : '—' ?>
          </td>
          <td class="text-center"><?= (int)$t['sort_order'] ?></td>
          <td>
            <span class="badge <?= $t['status'] ? 'bg-success' : 'bg-secondary' ?>" id="status-<?= $t['id'] ?>">
              <?= $t['status'] ? 'Active' : 'Hidden' ?>
            </span>
          </td>
          <td class="text-end">
            <button class="btn btn-outline-secondary btn-sm me-1" title="Toggle" onclick="toggleTesti(<?= $t['id'] ?>)"><i class="bi bi-toggle-on"></i></button>
            <button class="btn btn-outline-primary btn-sm me-1" title="Edit" onclick="openEdit(<?= $t['id'] ?>)" data-bs-toggle="modal" data-bs-target="#testiModal"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-sm" title="Delete" onclick="deleteTesti(<?= $t['id'] ?>)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($testimonials)): ?>
        <tr><td colspan="8" class="text-center text-muted py-4">No testimonials yet. Add one above.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Modal -->
<div class="modal fade" id="testiModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-semibold" id="testiModalTitle">Add Testimonial</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="testiForm">
          <input type="hidden" id="testiId" name="testi_id" value="">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label fw-medium">Author Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="testiAuthor" name="author_name" placeholder="e.g. Priya Sharma" required>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-medium">Author Title / Label</label>
              <input type="text" class="form-control" id="testiTitle" name="author_title" placeholder="e.g. Verified Buyer">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium">Quote <span class="text-danger">*</span></label>
            <textarea class="form-control" id="testiQuote" name="quote" rows="3" placeholder="What did the customer say?" required></textarea>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label fw-medium">Rating</label>
              <select class="form-select" id="testiRating" name="rating">
                <option value="5">★★★★★ (5)</option>
                <option value="4">★★★★☆ (4)</option>
                <option value="3">★★★☆☆ (3)</option>
                <option value="2">★★☆☆☆ (2)</option>
                <option value="1">★☆☆☆☆ (1)</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-medium">Linked Product</label>
              <select class="form-select" id="testiProduct" name="product_id">
                <option value="">— None —</option>
                <?php foreach ($products as $p): ?>
                <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['name']) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-medium">Sort Order</label>
              <input type="number" class="form-control" id="testiSort" name="sort_order" value="0" min="0" style="width:100px">
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer border-0 pt-0">
        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-warning" id="saveBtn" onclick="saveTesti()">
          <span id="saveSpinner" class="spinner-border spinner-border-sm d-none me-1"></span>
          Save
        </button>
      </div>
    </div>
  </div>
</div>

<script>
function showAlert(msg, type='success') {
  document.getElementById('alertBox').innerHTML =
    `<div class="alert alert-${type} alert-dismissible fade show"><i class="bi bi-${type==='success'?'check-circle':'exclamation-triangle'} me-2"></i>${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}

function openAdd() {
  document.getElementById('testiModalTitle').textContent = 'Add Testimonial';
  document.getElementById('testiForm').reset();
  document.getElementById('testiId').value = '';
}

function openEdit(id) {
  fetch(`<?= base_url('admin/testimonials/edit') ?>/${id}`)
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      const t = res.data;
      document.getElementById('testiModalTitle').textContent = 'Edit Testimonial';
      document.getElementById('testiId').value = t.id;
      document.getElementById('testiAuthor').value = t.author_name;
      document.getElementById('testiTitle').value = t.author_title || '';
      document.getElementById('testiQuote').value = t.quote;
      document.getElementById('testiRating').value = t.rating;
      document.getElementById('testiProduct').value = t.product_id || '';
      document.getElementById('testiSort').value = t.sort_order || 0;
    });
}

function saveTesti() {
  const form = document.getElementById('testiForm');
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const btn = document.getElementById('saveBtn');
  const spin = document.getElementById('saveSpinner');
  btn.disabled = true; spin.classList.remove('d-none');
  const id = document.getElementById('testiId').value;
  const fd = new FormData(form);
  const url = id
    ? `<?= base_url('admin/testimonials/update') ?>/${id}`
    : '<?= base_url('admin/testimonials/store') ?>';
  fetch(url, { method: 'POST', body: fd })
    .then(r => r.json())
    .then(res => {
      btn.disabled = false; spin.classList.add('d-none');
      if (res.success) {
        bootstrap.Modal.getInstance(document.getElementById('testiModal')).hide();
        showAlert(id ? 'Testimonial updated.' : 'Testimonial added.');
        setTimeout(() => location.reload(), 700);
      } else {
        showAlert(res.message || 'Error saving.', 'danger');
      }
    })
    .catch(() => { btn.disabled = false; spin.classList.add('d-none'); showAlert('Network error.', 'danger'); });
}

function toggleTesti(id) {
  fetch(`<?= base_url('admin/testimonials/toggle') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        const badge = document.getElementById('status-' + id);
        badge.className = 'badge ' + (res.status ? 'bg-success' : 'bg-secondary');
        badge.textContent = res.status ? 'Active' : 'Hidden';
      }
    });
}

function deleteTesti(id) {
  if (!confirm('Delete this testimonial?')) return;
  fetch(`<?= base_url('admin/testimonials/delete') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        document.getElementById('row-' + id)?.remove();
        showAlert('Testimonial deleted.');
      }
    });
}
</script>
