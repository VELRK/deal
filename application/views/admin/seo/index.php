<div class="sk-page-header d-flex align-items-center justify-content-between flex-wrap gap-2">
  <h5 class="sk-page-title mb-0"><i class="bi bi-search me-2 text-warning"></i>SEO Manager</h5>
  <a href="<?= site_url('admin/settings') ?>#tab-seo" class="btn btn-outline-secondary btn-sm">
    <i class="bi bi-gear me-1"></i> Global Settings
  </a>
</div>

<?php if (!$pages): ?>
<div class="alert alert-warning mt-3">
  SEO tables not ready. Run:
  <code>php database/run_seo_migration.php</code>
  or open <a href="<?= base_url('database/run_seo_migration.php?key=shopkart_migrate') ?>">migration in browser</a>.
</div>
<?php else: ?>

<div class="row g-3 mt-1 mb-4">
  <div class="col-6 col-md-3">
    <div class="card shadow-sm"><div class="card-body py-3">
      <div class="text-muted small">Site Pages</div>
      <div class="fs-4 fw-bold"><?= (int)$audit['pages'] ?></div>
    </div></div>
  </div>
  <div class="col-6 col-md-3">
    <div class="card shadow-sm border-warning"><div class="card-body py-3">
      <div class="text-muted small">Pages missing SEO</div>
      <div class="fs-4 fw-bold text-warning"><?= (int)$audit['pages_missing'] ?></div>
    </div></div>
  </div>
  <div class="col-6 col-md-3">
    <div class="card shadow-sm border-danger"><div class="card-body py-3">
      <div class="text-muted small">Products missing SEO</div>
      <div class="fs-4 fw-bold text-danger"><?= (int)$audit['products_missing'] ?></div>
    </div></div>
  </div>
  <div class="col-6 col-md-3">
    <div class="card shadow-sm border-info"><div class="card-body py-3">
      <div class="text-muted small">Blogs missing SEO</div>
      <div class="fs-4 fw-bold text-info"><?= (int)$audit['blogs_missing'] ?></div>
    </div></div>
  </div>
</div>

<!-- Global SEO -->
<div class="card sk-table-card shadow-sm mb-4">
  <div class="card-header fw-semibold"><i class="bi bi-globe me-1"></i> Global SEO & Scripts</div>
  <div class="card-body">
    <form method="post" action="<?= site_url('admin/seo/update_global') ?>" enctype="multipart/form-data">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Default Meta Title</label>
          <input type="text" name="meta_title" class="form-control" value="<?= htmlspecialchars($globals['meta_title'] ?? '') ?>">
        </div>
        <div class="col-md-6">
          <label class="form-label">Default OG Image URL</label>
          <input type="text" name="seo_og_image" class="form-control" value="<?= htmlspecialchars($globals['og_image'] ?? '') ?>" placeholder="assets/uploads/seo/...">
        </div>
        <div class="col-12">
          <label class="form-label">Default Meta Description</label>
          <textarea name="meta_desc" class="form-control" rows="2"><?= htmlspecialchars($globals['meta_description'] ?? '') ?></textarea>
        </div>
        <div class="col-12">
          <label class="form-label">Meta Keywords</label>
          <input type="text" name="meta_keywords" class="form-control" value="<?= htmlspecialchars($globals['meta_keywords'] ?? '') ?>">
        </div>
        <div class="col-md-6">
          <label class="form-label">Google Analytics ID</label>
          <input type="text" name="google_analytics" class="form-control" value="<?= htmlspecialchars($globals['google_analytics'] ?? '') ?>" placeholder="G-XXXXXXXXXX">
        </div>
        <div class="col-md-6">
          <label class="form-label">Upload Default OG Image</label>
          <input type="file" name="seo_og_image_file" class="form-control" accept="image/*">
        </div>
        <div class="col-md-6">
          <label class="form-label">Head Scripts <small class="text-muted">(GTM, meta pixels — injected in &lt;head&gt;)</small></label>
          <textarea name="head_scripts" class="form-control font-monospace small" rows="4" placeholder="&lt;script&gt;...&lt;/script&gt;"><?= htmlspecialchars($globals['head_scripts'] ?? '') ?></textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label">Footer Scripts <small class="text-muted">(chat widgets, tracking)</small></label>
          <textarea name="footer_scripts" class="form-control font-monospace small" rows="4"><?= htmlspecialchars($globals['footer_scripts'] ?? '') ?></textarea>
        </div>
      </div>
      <button type="submit" class="btn btn-warning mt-3"><i class="bi bi-check-lg me-1"></i> Save Global SEO</button>
    </form>
  </div>
</div>

<!-- Site pages -->
<div class="card sk-table-card shadow-sm mb-4">
  <div class="card-header fw-semibold"><i class="bi bi-file-earmark-text me-1"></i> Site Pages</div>
  <div class="card-body p-0">
    <table class="table table-hover mb-0 align-middle">
      <thead class="sk-table-head">
        <tr><th>Page</th><th>Route</th><th>Meta Title</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        <?php foreach ($pages as $p): ?>
        <tr>
          <td class="fw-semibold"><?= htmlspecialchars($p['page_label']) ?></td>
          <td><code><?= htmlspecialchars($p['route_path']) ?></code></td>
          <td class="small text-muted"><?= htmlspecialchars(mb_strimwidth($p['meta_title'] ?? '—', 0, 50, '…')) ?></td>
          <td>
            <?php if (!empty($p['meta_title']) && !empty($p['meta_description'])): ?>
              <span class="badge bg-success">OK</span>
            <?php else: ?>
              <span class="badge bg-warning text-dark">Incomplete</span>
            <?php endif; ?>
          </td>
          <td class="text-end">
            <a href="<?= site_url('admin/seo/edit_page/'.$p['id']) ?>" class="btn btn-sm btn-outline-primary">Edit SEO</a>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Products & Blogs quick links -->
<div class="row g-3">
  <div class="col-lg-6">
    <div class="card sk-table-card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span class="fw-semibold"><i class="bi bi-box-seam me-1"></i> Product SEO</span>
        <a href="<?= site_url('admin/products') ?>" class="btn btn-sm btn-outline-secondary">All Products</a>
      </div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <tbody>
            <?php foreach ($products as $pr): ?>
            <tr>
              <td><?= htmlspecialchars(mb_strimwidth($pr['name'], 0, 40, '…')) ?></td>
              <td><?= empty($pr['meta_title']) ? '<span class="badge bg-warning text-dark">Missing</span>' : '<span class="badge bg-success">OK</span>' ?></td>
              <td class="text-end"><a href="<?= site_url('admin/products/edit/'.$pr['id']) ?>#seo" class="btn btn-xs btn-link btn-sm">Edit</a></td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card sk-table-card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span class="fw-semibold"><i class="bi bi-journal-richtext me-1"></i> Blog SEO</span>
        <a href="<?= site_url('admin/blogs') ?>" class="btn btn-sm btn-outline-secondary">All Blogs</a>
      </div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <tbody>
            <?php if (empty($blogs)): ?>
            <tr><td class="text-muted p-3">No published blogs yet.</td></tr>
            <?php else: foreach ($blogs as $b): ?>
            <tr>
              <td><?= htmlspecialchars(mb_strimwidth($b['title'], 0, 40, '…')) ?></td>
              <td><?= empty($b['meta_title']) ? '<span class="badge bg-warning text-dark">Missing</span>' : '<span class="badge bg-success">OK</span>' ?></td>
              <td class="text-end"><a href="<?= site_url('admin/blogs') ?>" class="btn btn-xs btn-link btn-sm" onclick="sessionStorage.setItem('editBlogId','<?= $b['id'] ?>')">Edit</a></td>
            </tr>
            <?php endforeach; endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php endif; ?>
