<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-gear me-2 text-warning"></i>Settings</h5>
</div>

<form action="<?= site_url('admin/settings/update') ?>" method="POST" enctype="multipart/form-data">

  <!-- Nav Tabs -->
  <ul class="nav nav-tabs mb-3" id="settingsTabs">
    <li class="nav-item"><button type="button" class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-general">General</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-invoice">Invoice</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-payment">Payment</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-email">Email</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-seo">SEO</button></li>
  </ul>

  <div class="tab-content">

    <!-- General -->
    <div class="tab-pane fade show active" id="tab-general">
      <div class="card sk-table-card shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Site Name</label>
              <input type="text" name="site_name" class="form-control" value="<?= htmlspecialchars($settings['site_name'] ?? 'ShopKart') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Site Email</label>
              <input type="email" name="site_email" class="form-control" value="<?= htmlspecialchars($settings['site_email'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Phone</label>
              <input type="text" name="site_phone" class="form-control" value="<?= htmlspecialchars($settings['site_phone'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Currency Symbol</label>
              <input type="text" name="currency_symbol" class="form-control" value="<?= htmlspecialchars($settings['currency_symbol'] ?? '₹') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Tax Rate (%)</label>
              <input type="number" name="tax_rate" class="form-control" step="0.01" value="<?= $settings['tax_rate'] ?? '18' ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Shipping Charge (₹)</label>
              <input type="number" name="shipping_charge" class="form-control" value="<?= $settings['shipping_charge'] ?? '50' ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Free Shipping Above (₹)</label>
              <input type="number" name="free_shipping_above" class="form-control" value="<?= $settings['free_shipping_above'] ?? '999' ?>">
            </div>
            <div class="col-12">
              <label class="form-label">Address</label>
              <textarea name="site_address" class="form-control" rows="2"><?= htmlspecialchars($settings['site_address'] ?? '') ?></textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label">Site Logo</label>
              <?php if (!empty($settings['site_logo'])): ?>
                <img src="<?= base_url($settings['site_logo']) ?>" height="40" class="d-block mb-2 rounded">
              <?php endif; ?>
              <input type="file" name="site_logo" class="form-control" accept="image/*">
            </div>
            <div class="col-12">
              <label class="form-label fw-medium">Homepage Popups</label>
              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" name="newsletter_popup_enabled" id="newsletterPopupToggle" value="1"
                  <?= (!isset($settings['newsletter_popup_enabled']) || $settings['newsletter_popup_enabled'] == '1') ? 'checked' : '' ?>>
                <label class="form-check-label" for="newsletterPopupToggle">
                  Show newsletter subscribe popup on homepage
                </label>
              </div>
            </div>

            <div class="col-12">
              <label class="form-label fw-medium">Top Announcement Bar</label>
              <div class="card bg-light border-0 shadow-none">
                <div class="card-body">
                  <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" name="top_bar_enabled" id="topBarToggle" value="1"
                      <?= (!isset($settings['top_bar_enabled']) || $settings['top_bar_enabled'] == '1') ? 'checked' : '' ?>>
                    <label class="form-check-label" for="topBarToggle">Show Top Bar</label>
                  </div>
                  <input type="text" name="top_bar_text" class="form-control form-control-sm" 
                    value="<?= htmlspecialchars($settings['top_bar_text'] ?? '20% Off – Auto Applied at Checkout – Limited Time Only') ?>"
                    placeholder="Enter announcement text...">
                </div>
              </div>
            </div>

            <div class="col-12">
              <label class="form-label fw-medium">WhatsApp Support</label>
              <div class="card bg-light border-0 shadow-none">
                <div class="card-body">
                  <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" name="whatsapp_enabled" id="waToggle" value="1"
                      <?= (!isset($settings['whatsapp_enabled']) || $settings['whatsapp_enabled'] == '1') ? 'checked' : '' ?>>
                    <label class="form-check-label" for="waToggle">Enable Floating WhatsApp Button</label>
                  </div>
                  <div class="input-group input-group-sm">
                    <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
                    <input type="text" name="whatsapp_number" class="form-control" 
                      value="<?= htmlspecialchars($settings['whatsapp_number'] ?? '') ?>"
                      placeholder="e.g. 919876543210">
                  </div>
                  <div class="form-text small text-muted">Include country code without + (e.g. 91 for India).</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice (platform default) -->
    <div class="tab-pane fade" id="tab-invoice">
      <div class="card sk-table-card shadow-sm">
        <div class="card-body">
          <p class="text-muted small mb-3">These details appear on tax invoices when an order contains products from multiple vendors or platform-owned products. Vendors can set their own invoice details under <strong>Store Settings</strong>.</p>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Legal / Company Name</label>
              <input type="text" name="company_legal_name" class="form-control" value="<?= htmlspecialchars($settings['company_legal_name'] ?? $settings['site_name'] ?? '') ?>" placeholder="Registered business name on invoice">
            </div>
            <div class="col-md-6">
              <label class="form-label">GSTIN</label>
              <input type="text" name="gstin" class="form-control" value="<?= htmlspecialchars($settings['gstin'] ?? '') ?>" placeholder="22AAAAA0000A1Z5">
            </div>
            <div class="col-md-4">
              <label class="form-label">PAN</label>
              <input type="text" name="pan_no" class="form-control" value="<?= htmlspecialchars($settings['pan_no'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">State Code</label>
              <input type="text" name="state_code" class="form-control" value="<?= htmlspecialchars($settings['state_code'] ?? '') ?>" placeholder="e.g. TN, KA">
            </div>
            <div class="col-md-4">
              <label class="form-label">Invoice Prefix</label>
              <input type="text" name="invoice_prefix" class="form-control" value="<?= htmlspecialchars($settings['invoice_prefix'] ?? 'INV') ?>" maxlength="20">
            </div>
            <div class="col-12">
              <label class="form-label">Invoice Footer Note</label>
              <textarea name="invoice_footer" class="form-control" rows="2" placeholder="Thank you for your business."><?= htmlspecialchars($settings['invoice_footer'] ?? '') ?></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment -->
    <div class="tab-pane fade" id="tab-payment">
      <div class="card sk-table-card shadow-sm">
        <div class="card-body">
          <div class="alert alert-info small">
            <i class="bi bi-info-circle me-1"></i>
            Get your keys from <a href="https://dashboard.razorpay.com/app/keys" target="_blank">Razorpay Dashboard</a>.
          </div>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Razorpay Key ID</label>
              <input type="text" name="razorpay_key_id" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['razorpay_key_id'] ?? '') ?>" placeholder="rzp_test_...">
            </div>
            <div class="col-md-6">
              <label class="form-label">Razorpay Key Secret</label>
              <input type="password" name="razorpay_key_secret" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['razorpay_key_secret'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Mode</label>
              <select name="razorpay_mode" class="form-select">
                <option value="test" <?= ($settings['razorpay_mode']??'test')==='test'?'selected':'' ?>>Test</option>
                <option value="live" <?= ($settings['razorpay_mode']??'')==='live'?'selected':'' ?>>Live</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Email -->
    <div class="tab-pane fade" id="tab-email">
      <div class="card sk-table-card shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">SMTP Host</label>
              <input type="text" name="smtp_host" class="form-control" value="<?= htmlspecialchars($settings['smtp_host'] ?? '') ?>" placeholder="smtp.gmail.com">
            </div>
            <div class="col-md-3">
              <label class="form-label">SMTP Port</label>
              <input type="number" name="smtp_port" class="form-control" value="<?= $settings['smtp_port'] ?? '587' ?>">
            </div>
            <div class="col-md-3">
              <label class="form-label">From Name</label>
              <input type="text" name="smtp_from_name" class="form-control" value="<?= htmlspecialchars($settings['smtp_from_name'] ?? 'ShopKart') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">SMTP Username</label>
              <input type="text" name="smtp_user" class="form-control" value="<?= htmlspecialchars($settings['smtp_user'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">SMTP Password</label>
              <input type="password" name="smtp_pass" class="form-control" value="<?= htmlspecialchars($settings['smtp_pass'] ?? '') ?>">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SEO -->
    <div class="tab-pane fade" id="tab-seo">
      <div class="card sk-table-card shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Default Meta Title</label>
              <input type="text" name="meta_title" class="form-control" value="<?= htmlspecialchars($settings['meta_title'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Default OG Image URL</label>
              <input type="text" name="seo_og_image" class="form-control" value="<?= htmlspecialchars($settings['seo_og_image'] ?? '') ?>">
            </div>
            <div class="col-12">
              <label class="form-label">Default Meta Description</label>
              <textarea name="meta_desc" class="form-control" rows="3"><?= htmlspecialchars($settings['meta_desc'] ?? '') ?></textarea>
            </div>
            <div class="col-12">
              <label class="form-label">Meta Keywords</label>
              <input type="text" name="meta_keywords" class="form-control" value="<?= htmlspecialchars($settings['meta_keywords'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Google Analytics ID</label>
              <input type="text" name="google_analytics" class="form-control" value="<?= htmlspecialchars($settings['google_analytics'] ?? '') ?>" placeholder="G-XXXXXXXXXX">
            </div>
            <div class="col-md-6">
              <label class="form-label">Upload Default OG Image</label>
              <input type="file" name="seo_og_image_file" class="form-control" accept="image/*">
            </div>
            <div class="col-md-6">
              <label class="form-label">Head Scripts</label>
              <textarea name="head_scripts" class="form-control font-monospace small" rows="4"><?= htmlspecialchars($settings['head_scripts'] ?? '') ?></textarea>
              <div class="form-text">GTM, Facebook Pixel, etc. Injected in &lt;head&gt; on all pages.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Footer Scripts</label>
              <textarea name="footer_scripts" class="form-control font-monospace small" rows="4"><?= htmlspecialchars($settings['footer_scripts'] ?? '') ?></textarea>
            </div>
          </div>
          <div class="alert alert-info small mt-3 mb-0">
            <i class="bi bi-info-circle me-1"></i>
            Manage per-page SEO in <a href="<?= site_url('admin/seo') ?>">SEO Manager</a>.
          </div>
        </div>
      </div>
    </div>

  </div><!-- end tab-content -->

  <div class="mt-3">
    <button type="submit" class="btn btn-warning fw-semibold px-4">
      <i class="bi bi-check-lg me-1"></i> Save Settings
    </button>
  </div>

</form>
