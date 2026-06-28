<div class="sk-page-header d-flex align-items-center gap-2">
  <a href="<?= site_url('admin/seo') ?>" class="btn btn-sm btn-outline-secondary"><i class="bi bi-arrow-left"></i></a>
  <h5 class="sk-page-title mb-0"><i class="bi bi-search me-2 text-warning"></i><?= htmlspecialchars($page['page_label']) ?> — SEO</h5>
</div>

<form method="post" action="<?= site_url('admin/seo/update_page/'.$page['id']) ?>" enctype="multipart/form-data" class="mt-3">
  <div class="row g-3">
    <div class="col-lg-8">
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header fw-semibold">Meta Tags</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Route</label>
            <input type="text" class="form-control" value="<?= htmlspecialchars($page['route_path']) ?>" readonly disabled>
          </div>
          <div class="mb-3">
            <label class="form-label">Meta Title</label>
            <input type="text" name="meta_title" class="form-control" maxlength="255" value="<?= htmlspecialchars($page['meta_title'] ?? '') ?>">
          </div>
          <div class="mb-3">
            <label class="form-label">Meta Description</label>
            <textarea name="meta_description" class="form-control" rows="3"><?= htmlspecialchars($page['meta_description'] ?? '') ?></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Meta Keywords</label>
            <input type="text" name="meta_keywords" class="form-control" value="<?= htmlspecialchars($page['meta_keywords'] ?? '') ?>">
          </div>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Canonical URL</label>
              <input type="url" name="canonical_url" class="form-control" value="<?= htmlspecialchars($page['canonical_url'] ?? '') ?>" placeholder="https://yoursite.com/page">
            </div>
            <div class="col-md-6">
              <label class="form-label">Robots</label>
              <select name="robots" class="form-select">
                <?php foreach (['index,follow','noindex,follow','index,nofollow','noindex,nofollow'] as $r): ?>
                <option value="<?= $r ?>" <?= ($page['robots'] ?? 'index,follow') === $r ? 'selected' : '' ?>><?= $r ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header fw-semibold">Open Graph (Social)</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">OG Title</label>
            <input type="text" name="og_title" class="form-control" value="<?= htmlspecialchars($page['og_title'] ?? '') ?>" placeholder="Leave blank to use Meta Title">
          </div>
          <div class="mb-3">
            <label class="form-label">OG Description</label>
            <textarea name="og_description" class="form-control" rows="2"><?= htmlspecialchars($page['og_description'] ?? '') ?></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">OG Image URL</label>
            <input type="text" name="og_image" class="form-control" value="<?= htmlspecialchars($page['og_image'] ?? '') ?>">
          </div>
          <div>
            <label class="form-label">Upload OG Image</label>
            <input type="file" name="og_image_file" class="form-control" accept="image/*">
            <?php if (!empty($page['og_image'])): ?>
            <img src="<?= base_url($page['og_image']) ?>" class="mt-2 rounded" style="max-height:80px" alt="">
            <?php endif; ?>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header fw-semibold">Page Scripts</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Head Scripts</label>
            <textarea name="head_scripts" class="form-control font-monospace small" rows="5"><?= htmlspecialchars($page['head_scripts'] ?? '') ?></textarea>
          </div>
          <div>
            <label class="form-label">Footer Scripts</label>
            <textarea name="footer_scripts" class="form-control font-monospace small" rows="5"><?= htmlspecialchars($page['footer_scripts'] ?? '') ?></textarea>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-warning w-100 fw-semibold">
        <i class="bi bi-check-lg me-1"></i> Save Page SEO
      </button>
    </div>
  </div>
</form>
