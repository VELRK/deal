<?php
/** Reusable SEO fields partial. Expects optional $seo array with keys.
 *  Optional: $seo_entity = 'product'|'blog' for canonical preview prefix.
 */
$seo = $seo ?? [];
$seo_entity = $seo_entity ?? 'product';
$canonical_prefix = $seo_entity === 'blog' ? '/blog/' : '/product/';
$faqs = [];
if (!empty($seo['faq_json'])) {
    $decoded = is_string($seo['faq_json']) ? json_decode($seo['faq_json'], true) : $seo['faq_json'];
    if (is_array($decoded)) $faqs = $decoded;
} elseif (!empty($seo['faqs']) && is_array($seo['faqs'])) {
    $faqs = $seo['faqs'];
}
if (!$faqs) {
    $faqs = [['question' => '', 'answer' => '']];
}
$slug_val = htmlspecialchars($seo['slug'] ?? '');
?>
<div class="card sk-table-card shadow-sm mb-3" id="seo">
  <div class="card-header bg-white border-0 py-3 fw-semibold">
    <i class="bi bi-search me-1 text-warning"></i> SEO
  </div>
  <div class="card-body">
    <div class="mb-3">
      <label class="form-label">URL Slug</label>
      <div class="input-group">
        <span class="input-group-text text-muted"><?= htmlspecialchars($canonical_prefix) ?></span>
        <input type="text" name="slug" id="seoSlugInput" class="form-control" maxlength="200"
               value="<?= $slug_val ?>"
               placeholder="auto-from-title" pattern="[a-z0-9\-]*"
               autocomplete="off">
      </div>
      <div class="form-text">
        Canonical:
        <code id="seoCanonicalPreview"><?= htmlspecialchars($canonical_prefix) ?><span id="seoSlugPreview"><?= $slug_val ?: '…' ?></span></code>
        <span class="text-muted">· Changing the slug records a 301 from the old URL.</span>
      </div>
    </div>
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
    <div class="mb-4">
      <label class="form-label">OG Image URL <small class="text-muted">(social share image)</small></label>
      <input type="text" name="og_image" class="form-control"
             value="<?= htmlspecialchars($seo['og_image'] ?? '') ?>"
             placeholder="assets/uploads/... or full URL">
    </div>

    <div class="border-top pt-3">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <label class="form-label mb-0 fw-semibold">FAQ <small class="text-muted fw-normal">(FAQPage schema)</small></label>
        <button type="button" class="btn btn-sm btn-outline-primary" id="seoFaqAddBtn">
          <i class="bi bi-plus-lg"></i> Add FAQ
        </button>
      </div>
      <div id="seoFaqList">
        <?php foreach ($faqs as $i => $faq): ?>
        <div class="seo-faq-row border rounded p-3 mb-2 bg-light" data-faq-index="<?= (int)$i ?>">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="small text-muted">FAQ #<?= (int)$i + 1 ?></span>
            <button type="button" class="btn btn-sm btn-link text-danger p-0 seo-faq-remove" title="Remove">Remove</button>
          </div>
          <div class="mb-2">
            <input type="text" name="faq_question[]" class="form-control form-control-sm"
                   value="<?= htmlspecialchars($faq['question'] ?? '') ?>"
                   placeholder="Question">
          </div>
          <div>
            <textarea name="faq_answer[]" class="form-control form-control-sm" rows="2"
                      placeholder="Answer"><?= htmlspecialchars($faq['answer'] ?? '') ?></textarea>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</div>
<script>
(function () {
  var input = document.getElementById('seoSlugInput');
  var preview = document.getElementById('seoSlugPreview');
  if (input && preview) {
    var sanitize = function (v) {
      return String(v || '').toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };
    input.addEventListener('input', function () {
      var clean = sanitize(input.value);
      if (input.value !== clean) input.value = clean;
      preview.textContent = clean || '…';
    });
  }
  var list = document.getElementById('seoFaqList');
  var addBtn = document.getElementById('seoFaqAddBtn');
  if (list && addBtn) {
    addBtn.addEventListener('click', function () {
      var n = list.querySelectorAll('.seo-faq-row').length + 1;
      var wrap = document.createElement('div');
      wrap.className = 'seo-faq-row border rounded p-3 mb-2 bg-light';
      wrap.innerHTML =
        '<div class="d-flex justify-content-between align-items-start mb-2">' +
        '<span class="small text-muted">FAQ #' + n + '</span>' +
        '<button type="button" class="btn btn-sm btn-link text-danger p-0 seo-faq-remove" title="Remove">Remove</button>' +
        '</div>' +
        '<div class="mb-2"><input type="text" name="faq_question[]" class="form-control form-control-sm" placeholder="Question"></div>' +
        '<div><textarea name="faq_answer[]" class="form-control form-control-sm" rows="2" placeholder="Answer"></textarea></div>';
      list.appendChild(wrap);
    });
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.seo-faq-remove');
      if (!btn) return;
      var row = btn.closest('.seo-faq-row');
      if (row) row.remove();
      if (!list.querySelector('.seo-faq-row')) addBtn.click();
    });
  }
})();
</script>
