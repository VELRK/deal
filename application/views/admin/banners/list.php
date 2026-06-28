<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-images me-2 text-warning"></i>Banners</h5>
</div>

<div id="alertBox"></div>

<!-- Tabs -->
<ul class="nav nav-tabs mb-3" id="bannerTabs">
  <li class="nav-item">
    <a class="nav-link active" href="#heroTab" data-bs-toggle="tab">
      <i class="bi bi-aspect-ratio me-1"></i> Hero Slides
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#offerTab" data-bs-toggle="tab">
      <i class="bi bi-gift me-1"></i> Offer Popup
    </a>
  </li>
</ul>

<div class="tab-content">

  <!-- ── Hero Banners Tab ── -->
  <div class="tab-pane fade show active" id="heroTab">
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-warning btn-sm" onclick="openAddBanner('hero')" data-bs-toggle="modal" data-bs-target="#bannerModal">
        <i class="bi bi-plus-lg me-1"></i> Add Slide
      </button>
    </div>
    <div class="card sk-table-card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
          <thead class="sk-table-head">
            <tr>
              <th style="width:50px">#</th>
              <th style="width:140px">Image</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th style="width:70px">Order</th>
              <th style="width:90px">Status</th>
              <th class="text-end" style="width:120px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($hero_banners as $i => $b): ?>
            <tr id="row-<?= $b['id'] ?>">
              <td class="text-muted small"><?= $i + 1 ?></td>
              <td>
                <img src="<?= base_url($b['image']) ?>" height="50" style="width:110px;object-fit:cover;border-radius:5px;border:1px solid #eee;" onerror="this.src='/assets/images/product/product-placeholder.jpg'">
              </td>
              <td class="fw-semibold"><?= htmlspecialchars($b['title']) ?></td>
              <td class="text-muted small"><?= htmlspecialchars($b['subtitle']) ?></td>
              <td class="text-center"><?= (int)$b['sort_order'] ?></td>
              <td><span class="badge <?= $b['status'] ? 'bg-success' : 'bg-secondary' ?>" id="status-<?= $b['id'] ?>"><?= $b['status'] ? 'Active' : 'Inactive' ?></span></td>
              <td class="text-end">
                <button class="btn btn-outline-secondary btn-sm me-1" title="Toggle" onclick="toggleBanner(<?= $b['id'] ?>)"><i class="bi bi-toggle-on"></i></button>
                <button class="btn btn-outline-primary btn-sm me-1" title="Edit" onclick="openEditBanner(<?= $b['id'] ?>)"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger btn-sm" title="Delete" onclick="deleteBanner(<?= $b['id'] ?>)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($hero_banners)): ?>
            <tr><td colspan="7" class="text-center text-muted py-4">No hero slides yet.</td></tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ── Offer Popup Tab ── -->
  <div class="tab-pane fade" id="offerTab">
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-warning btn-sm" onclick="openAddBanner('offer')" data-bs-toggle="modal" data-bs-target="#bannerModal">
        <i class="bi bi-plus-lg me-1"></i> Add Offer Popup
      </button>
    </div>
    <div class="card sk-table-card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
          <thead class="sk-table-head">
            <tr>
              <th style="width:50px">#</th>
              <th style="width:160px">Image</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th style="width:90px">Status</th>
              <th class="text-end" style="width:120px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($offer_banners as $i => $b): ?>
            <tr id="row-<?= $b['id'] ?>">
              <td class="text-muted small"><?= $i + 1 ?></td>
              <td>
                <img src="<?= base_url($b['image']) ?>" height="60" style="width:130px;object-fit:cover;border-radius:5px;border:1px solid #eee;" onerror="this.src='/assets/images/product/product-placeholder.jpg'">
              </td>
              <td class="fw-semibold"><?= htmlspecialchars($b['title']) ?></td>
              <td class="text-muted small"><?= htmlspecialchars($b['subtitle']) ?></td>
              <td><span class="badge <?= $b['status'] ? 'bg-success' : 'bg-secondary' ?>" id="status-<?= $b['id'] ?>"><?= $b['status'] ? 'Active' : 'Inactive' ?></span></td>
              <td class="text-end">
                <button class="btn btn-outline-secondary btn-sm me-1" title="Toggle" onclick="toggleBanner(<?= $b['id'] ?>)"><i class="bi bi-toggle-on"></i></button>
                <button class="btn btn-outline-primary btn-sm me-1" title="Edit" onclick="openEditBanner(<?= $b['id'] ?>)"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger btn-sm" title="Delete" onclick="deleteBanner(<?= $b['id'] ?>)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($offer_banners)): ?>
            <tr><td colspan="6" class="text-center text-muted py-4">No offer popup set. Add one to show a popup when visitors arrive.</td></tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
    <p class="text-muted small mt-2"><i class="bi bi-info-circle me-1"></i>Only the first <strong>Active</strong> offer popup is shown. It appears once per browser session.</p>
  </div>

</div><!-- end tab-content -->

<!-- ── Shared Modal ── -->
<div class="modal fade" id="bannerModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-semibold" id="bannerModalTitle">Add Banner</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div id="modalAlert" class="d-none mb-3"></div>
        <form id="bannerForm" enctype="multipart/form-data" novalidate>
          <input type="hidden" id="bannerId" name="banner_id" value="">
          <input type="hidden" id="bannerType" name="type" value="hero">

          <div class="mb-3">
            <label class="form-label fw-medium">Title <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="bannerTitle" name="title" placeholder="e.g. Find Your Signature Style">
            <div class="invalid-feedback" id="titleError">Title is required.</div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium">Subtitle</label>
            <input type="text" class="form-control" id="bannerSubtitle" name="subtitle" placeholder="e.g. DISCOVER THE ART OF MODERN DRESSING">
          </div>
          <div class="row" id="ctaRow">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-medium">Button Text</label>
              <input type="text" class="form-control" id="bannerCtaText" name="cta_text" placeholder="Shop Styles" value="Shop Styles">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label fw-medium">Button Link</label>
              <input type="text" class="form-control" id="bannerCtaLink" name="cta_link" placeholder="/shop-default" value="/shop-default">
            </div>
          </div>
          <div class="mb-3" id="sortRow">
            <label class="form-label fw-medium">Sort Order</label>
            <input type="number" class="form-control" id="bannerSort" name="sort_order" value="0" min="0" style="width:120px">
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium">Banner Image <span id="imgRequiredNote" class="text-danger">*</span></label>
            <input type="file" class="form-control" id="bannerImage" name="image" accept=".jpg,.jpeg,.png,.gif,.webp" onchange="previewImg(this)">
            <div class="form-text" id="imgHint">Recommended: 1920×730 px. Allowed: JPG, PNG, GIF, WebP. Max 2MB.</div>
            <div class="invalid-feedback" id="imageError">Please select a valid image.</div>
            <div id="imgPreviewWrap" class="mt-2 d-none">
              <img id="imgPreview" src="" style="max-height:140px;border-radius:6px;border:1px solid #ddd;">
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer border-0 pt-0">
        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-warning" id="saveBannerBtn" onclick="saveBanner()">
          <span id="saveBannerSpinner" class="spinner-border spinner-border-sm d-none me-1"></span>
          Save
        </button>
      </div>
    </div>
  </div>
</div>

<script>
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

function showAlert(msg, type = 'success') {
  document.getElementById('alertBox').innerHTML =
    `<div class="alert alert-${type} alert-dismissible fade show mt-2"><i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}

function showModalAlert(msg, type = 'danger') {
  const el = document.getElementById('modalAlert');
  el.className = `alert alert-${type} d-flex align-items-center mb-3`;
  el.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i><span>${msg}</span>`;
}

function clearModalErrors() {
  const el = document.getElementById('modalAlert');
  el.className = 'd-none mb-3';
  el.innerHTML = '';
  document.querySelectorAll('#bannerForm .is-invalid').forEach(f => f.classList.remove('is-invalid'));
}

function setFieldError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errorId);
  if (field) field.classList.add('is-invalid');
  if (err && msg) err.textContent = msg;
}

function previewImg(input) {
  clearModalErrors();
  const file = input.files && input.files[0];
  if (!file) return;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    setFieldError('bannerImage', 'imageError', 'Only JPG, PNG, GIF, and WebP images are allowed.');
    input.value = '';
    document.getElementById('imgPreviewWrap').classList.add('d-none');
    return;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    setFieldError('bannerImage', 'imageError', 'Image file size must be less than 2MB.');
    input.value = '';
    document.getElementById('imgPreviewWrap').classList.add('d-none');
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('imgPreview').src = e.target.result;
    document.getElementById('imgPreviewWrap').classList.remove('d-none');
  };
  reader.readAsDataURL(file);
}

function openAddBanner(type) {
  document.getElementById('bannerModalTitle').textContent = type === 'offer' ? 'Add Offer Popup' : 'Add Hero Slide';
  document.getElementById('bannerForm').reset();
  document.getElementById('bannerId').value = '';
  document.getElementById('bannerType').value = type;
  document.getElementById('bannerCtaText').value = 'Shop Now';
  document.getElementById('bannerCtaLink').value = '/shop-default';
  document.getElementById('imgPreviewWrap').classList.add('d-none');
  document.getElementById('imgRequiredNote').style.display = '';
  document.getElementById('imgHint').textContent = type === 'offer'
    ? 'Recommended: 600×700 px. Allowed: JPG, PNG, GIF, WebP. Max 2MB.'
    : 'Recommended: 1920×730 px. Allowed: JPG, PNG, GIF, WebP. Max 2MB.';
  clearModalErrors();
}

function openEditBanner(id) {
  fetch(`<?= base_url('admin/banners/edit') ?>/${id}`)
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      const b = res.data;
      document.getElementById('bannerModalTitle').textContent = b.type === 'offer' ? 'Edit Offer Popup' : 'Edit Hero Slide';
      document.getElementById('bannerId').value = b.id;
      document.getElementById('bannerType').value = b.type || 'hero';
      document.getElementById('bannerTitle').value = b.title;
      document.getElementById('bannerSubtitle').value = b.subtitle || '';
      document.getElementById('bannerCtaText').value = b.cta_text || 'Shop Now';
      document.getElementById('bannerCtaLink').value = b.cta_link || '/shop-default';
      document.getElementById('bannerSort').value = b.sort_order || 0;
      document.getElementById('imgRequiredNote').style.display = 'none';
      document.getElementById('imgHint').textContent = b.type === 'offer'
        ? 'Leave empty to keep current image. Allowed: JPG, PNG, GIF, WebP. Max 2MB.'
        : 'Leave empty to keep current image. Allowed: JPG, PNG, GIF, WebP. Max 2MB.';
      if (b.image) {
        document.getElementById('imgPreview').src = '<?= base_url() ?>' + b.image;
        document.getElementById('imgPreviewWrap').classList.remove('d-none');
      } else {
        document.getElementById('imgPreviewWrap').classList.add('d-none');
      }
      clearModalErrors();
      new bootstrap.Modal(document.getElementById('bannerModal')).show();
    });
}

function saveBanner() {
  clearModalErrors();
  let valid = true;

  const title = document.getElementById('bannerTitle').value.trim();
  if (!title) {
    setFieldError('bannerTitle', 'titleError', 'Title is required.');
    valid = false;
  }

  const imageInput = document.getElementById('bannerImage');
  const id = document.getElementById('bannerId').value;
  if (!id && (!imageInput.files || !imageInput.files.length)) {
    setFieldError('bannerImage', 'imageError', 'Please select a banner image.');
    valid = false;
  } else if (imageInput.files && imageInput.files.length) {
    const file = imageInput.files[0];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFieldError('bannerImage', 'imageError', 'Only JPG, PNG, GIF, and WebP images are allowed.');
      valid = false;
    } else if (file.size > MAX_IMAGE_SIZE) {
      setFieldError('bannerImage', 'imageError', 'Image file size must be less than 2MB.');
      valid = false;
    }
  }

  if (!valid) return;

  const btn = document.getElementById('saveBannerBtn');
  const spin = document.getElementById('saveBannerSpinner');
  btn.disabled = true;
  spin.classList.remove('d-none');

  const fd = new FormData(document.getElementById('bannerForm'));
  const url = id
    ? `<?= base_url('admin/banners/update') ?>/${id}`
    : '<?= base_url('admin/banners/store') ?>';

  fetch(url, { method: 'POST', body: fd })
    .then(r => r.json())
    .then(res => {
      btn.disabled = false;
      spin.classList.add('d-none');
      if (res.success) {
        bootstrap.Modal.getInstance(document.getElementById('bannerModal')).hide();
        showAlert(id ? 'Banner updated successfully.' : 'Banner added successfully.');
        setTimeout(() => location.reload(), 700);
      } else {
        showModalAlert(res.message || 'Error saving banner. Please try again.');
      }
    })
    .catch(() => {
      btn.disabled = false;
      spin.classList.add('d-none');
      showModalAlert('Network error. Please check your connection and try again.');
    });
}

function toggleBanner(id) {
  fetch(`<?= base_url('admin/banners/toggle') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        const badge = document.getElementById('status-' + id);
        badge.className = 'badge ' + (res.status ? 'bg-success' : 'bg-secondary');
        badge.textContent = res.status ? 'Active' : 'Inactive';
      }
    });
}

function deleteBanner(id) {
  if (!confirm('Delete this banner?')) return;
  fetch(`<?= base_url('admin/banners/delete') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        const row = document.getElementById('row-' + id);
        if (row) row.remove();
        showAlert('Banner deleted.');
      }
    });
}
</script>
