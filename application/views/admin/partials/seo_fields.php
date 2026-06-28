<?php
/** Reusable SEO fields partial. Expects optional $seo array with keys. */
$seo = $seo ?? [];
?>
<div class="card sk-table-card shadow-sm mb-3" id="seo">
  <div class="card-header bg-white border-0 py-3 fw-semibold">
    <i class="bi bi-search me-1 text-warning"></i> SEO
  </div>
  <div class="card-body">
    <div class="mb-3">
      <label class="form-label">Meta Title</label>
      <input type="text" name="meta_title" class="form-control" maxlength="255"
             value="<?= htmlspecialchars($seo['meta_title'] ?? '') ?>"
             placeholder="Page title for search engines (50–60 chars)">
    </div>
    <div class="mb-3">
      <label class="form-label">Meta Description</label>
      <textarea name="meta_desc" class="form-control" rows="2" maxlength="500"
                placeholder="Short description for Google (150–160 chars)"><?= htmlspecialchars($seo['meta_desc'] ?? $seo['meta_description'] ?? '') ?></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Meta Keywords</label>
      <input type="text" name="meta_keywords" class="form-control"
             value="<?= htmlspecialchars($seo['meta_keywords'] ?? '') ?>"
             placeholder="saree, silk, kanjivaram (comma separated)">
    </div>
    <div>
      <label class="form-label">OG Image URL <small class="text-muted">(social share image)</small></label>
      <input type="text" name="og_image" class="form-control"
             value="<?= htmlspecialchars($seo['og_image'] ?? '') ?>"
             placeholder="assets/uploads/... or full URL">
    </div>
  </div>
</div>
