<div class="sk-page-header d-flex align-items-center justify-content-between">
  <h5 class="sk-page-title mb-0"><i class="bi bi-journal-richtext me-2 text-primary"></i>Blogs</h5>
  <button class="btn btn-primary btn-sm" onclick="openAdd()" data-bs-toggle="modal" data-bs-target="#blogModal">
    <i class="bi bi-plus-lg me-1"></i> Add Blog
  </button>
</div>

<div id="alertBox" class="mt-2"></div>

<div class="card sk-table-card shadow-sm mt-3">
  <div class="card-body p-0">
    <table class="table table-hover align-middle mb-0">
      <thead class="sk-table-head">
        <tr>
          <th style="width:40px">#</th>
          <th style="width:80px">Image</th>
          <th>Title</th>
          <th>Author</th>
          <th>Tags</th>
          <th style="width:90px">Status</th>
          <th style="width:130px">Date</th>
          <th class="text-end" style="width:120px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($blogs as $i => $b): ?>
        <tr id="row-<?= $b['id'] ?>">
          <td class="text-muted small"><?= $i + 1 ?></td>
          <td>
            <img src="<?= $b['image'] ? base_url() . $b['image'] : '' ?>"
                 style="width:60px;height:45px;object-fit:cover;border-radius:4px;<?= $b['image'] ? '' : 'display:none;' ?>"
                 id="img-<?= $b['id'] ?>"
                 onerror="this.style.display='none';document.getElementById('ph-<?= $b['id'] ?>').style.display='flex';"
                 alt="">
            <div id="ph-<?= $b['id'] ?>" class="bg-light rounded align-items-center justify-content-center"
                 style="width:60px;height:45px;<?= $b['image'] ? 'display:none;' : 'display:flex;' ?>">
              <i class="bi bi-image text-muted"></i>
            </div>
          </td>
          <td>
            <div class="fw-semibold"><?= htmlspecialchars($b['title']) ?></div>
            <small class="text-muted">/blog-single/<?= htmlspecialchars($b['slug']) ?></small>
          </td>
          <td class="text-muted small"><?= htmlspecialchars($b['author']) ?></td>
          <td class="small text-muted"><?= htmlspecialchars((string)$b['tags']) ?></td>
          <td>
            <span class="badge <?= $b['status'] ? 'bg-success' : 'bg-secondary' ?>" id="status-<?= $b['id'] ?>">
              <?= $b['status'] ? 'Published' : 'Draft' ?>
            </span>
          </td>
          <td class="small text-muted"><?= date('d M Y', strtotime($b['created_at'])) ?></td>
          <td class="text-end">
            <button class="btn btn-outline-secondary btn-sm me-1" title="Toggle Status" onclick="toggleBlog(<?= $b['id'] ?>)"><i class="bi bi-toggle-on"></i></button>
            <button class="btn btn-outline-primary btn-sm me-1" title="Edit" onclick="openEdit(<?= $b['id'] ?>)" data-bs-toggle="modal" data-bs-target="#blogModal"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-sm" title="Delete" onclick="deleteBlog(<?= $b['id'] ?>)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($blogs)): ?>
        <tr><td colspan="8" class="text-center text-muted py-4">No blogs yet. Add one above.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Modal -->
<div class="modal fade" id="blogModal" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header border-0 pb-0">
        <h5 class="modal-title fw-semibold" id="blogModalTitle">Add Blog</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="blogForm" enctype="multipart/form-data">
          <input type="hidden" id="blogId" name="blog_id" value="">
          <input type="hidden" id="blogContent" name="content" value="">

          <ul class="nav nav-tabs mb-3" role="tablist">
            <li class="nav-item"><button type="button" class="nav-link active" data-bs-toggle="tab" data-bs-target="#blogTabContent">Content</button></li>
            <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#blogTabSeo">SEO</button></li>
          </ul>

          <div class="tab-content">
            <div class="tab-pane fade show active" id="blogTabContent">
              <div class="row mb-3">
                <div class="col-md-8">
                  <label class="form-label fw-medium">Title <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="blogTitle" name="title" placeholder="Blog post title" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Author</label>
                  <input type="text" class="form-control" id="blogAuthor" name="author" placeholder="e.g. Admin" value="Admin">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium">Excerpt <small class="text-muted">(listing summary)</small></label>
                <textarea class="form-control" id="blogExcerpt" name="excerpt" rows="2" placeholder="Brief summary..."></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label fw-medium">Content <span class="text-danger">*</span></label>
                <div id="quill-blog-content" style="min-height:220px;background:#fff;"></div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Featured Image</label>
                  <input type="file" class="form-control" id="blogImage" name="image" accept="image/*">
                  <div id="imagePreview" class="mt-2 d-none">
                    <img id="previewImg" src="" style="max-height:120px;border-radius:6px;" alt="Preview">
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Tags <small class="text-muted">(comma separated)</small></label>
                  <input type="text" class="form-control" id="blogTags" name="tags" placeholder="saree, fashion, trends">
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="blogTabSeo">
              <div class="mb-3">
                <label class="form-label">Meta Title</label>
                <input type="text" class="form-control" id="blogMetaTitle" name="meta_title" maxlength="255">
              </div>
              <div class="mb-3">
                <label class="form-label">Meta Description</label>
                <textarea class="form-control" id="blogMetaDesc" name="meta_desc" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Meta Keywords</label>
                <input type="text" class="form-control" id="blogMetaKeywords" name="meta_keywords">
              </div>
              <div>
                <label class="form-label">OG Image URL</label>
                <input type="text" class="form-control" id="blogOgImage" name="og_image" placeholder="Leave blank to use featured image">
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer border-0 pt-0">
        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="saveBtn" onclick="saveBlog()">
          <span id="saveSpinner" class="spinner-border spinner-border-sm d-none me-1"></span>
          Save Blog
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

document.getElementById('blogImage').addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('imagePreview').classList.remove('d-none');
    };
    reader.readAsDataURL(file);
  }
});

function openAdd() {
  document.getElementById('blogModalTitle').textContent = 'Add Blog';
  document.getElementById('blogForm').reset();
  document.getElementById('blogId').value = '';
  document.getElementById('imagePreview').classList.add('d-none');
  if (window.blogQuill) window.blogQuill.setContents([]);
}

function openEdit(id) {
  fetch(`<?= base_url('admin/blogs/edit') ?>/${id}`)
    .then(r => r.json())
    .then(res => {
      if (!res.success) return;
      const b = res.data;
      document.getElementById('blogModalTitle').textContent = 'Edit Blog';
      document.getElementById('blogId').value = b.id;
      document.getElementById('blogTitle').value = b.title;
      document.getElementById('blogAuthor').value = b.author || 'Admin';
      document.getElementById('blogExcerpt').value = b.excerpt || '';
      document.getElementById('blogMetaTitle').value = b.meta_title || '';
      document.getElementById('blogMetaDesc').value = b.meta_desc || '';
      document.getElementById('blogMetaKeywords').value = b.meta_keywords || '';
      document.getElementById('blogOgImage').value = b.og_image || '';
      document.getElementById('blogTags').value = b.tags || '';
      if (window.blogQuill) {
        window.blogQuill.root.innerHTML = b.content || '';
      }
      const baseUrl = '<?= rtrim(base_url(), '/') ?>/';
      if (b.image) {
        document.getElementById('previewImg').src = baseUrl + b.image;
        document.getElementById('previewImg').onerror = function() { document.getElementById('imagePreview').classList.add('d-none'); };
        document.getElementById('imagePreview').classList.remove('d-none');
      } else {
        document.getElementById('imagePreview').classList.add('d-none');
      }
    });
}

function saveBlog() {
  const form = document.getElementById('blogForm');
  if (window.blogQuill) {
    const html = window.blogQuill.root.innerHTML.trim();
    if (!html || html === '<p><br></p>') {
      showAlert('Content is required.', 'danger');
      return;
    }
    document.getElementById('blogContent').value = html;
  }
  if (!document.getElementById('blogTitle').value.trim()) {
    showAlert('Title is required.', 'danger');
    return;
  }
  const btn = document.getElementById('saveBtn');
  const spin = document.getElementById('saveSpinner');
  btn.disabled = true; spin.classList.remove('d-none');
  const id = document.getElementById('blogId').value;
  const fd = new FormData(form);
  const url = id
    ? `<?= base_url('admin/blogs/update') ?>/${id}`
    : '<?= base_url('admin/blogs/store') ?>';
  fetch(url, { method: 'POST', body: fd })
    .then(r => r.json())
    .then(res => {
      btn.disabled = false; spin.classList.add('d-none');
      if (res.success) {
        bootstrap.Modal.getInstance(document.getElementById('blogModal')).hide();
        showAlert(id ? 'Blog updated.' : 'Blog added.');
        setTimeout(() => location.reload(), 700);
      } else {
        showAlert(res.message || 'Error saving.', 'danger');
      }
    })
    .catch(() => { btn.disabled = false; spin.classList.add('d-none'); showAlert('Network error.', 'danger'); });
}

function toggleBlog(id) {
  fetch(`<?= base_url('admin/blogs/toggle') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        const badge = document.getElementById('status-' + id);
        badge.className = 'badge ' + (res.status ? 'bg-success' : 'bg-secondary');
        badge.textContent = res.status ? 'Published' : 'Draft';
      }
    });
}

function deleteBlog(id) {
  if (!confirm('Delete this blog post?')) return;
  fetch(`<?= base_url('admin/blogs/delete') ?>/${id}`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        document.getElementById('row-' + id)?.remove();
        showAlert('Blog deleted.');
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const editId = sessionStorage.getItem('editBlogId');
  if (editId) {
    sessionStorage.removeItem('editBlogId');
    openEdit(editId);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('blogModal')).show();
  }
});
</script>
