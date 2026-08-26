<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-gear me-2 text-warning"></i>Settings</h5>
</div>

<form action="<?= site_url('admin/settings/update') ?>" method="POST" enctype="multipart/form-data">
  <input type="hidden" name="settings_tab" id="settingsTabInput" value="general">

  <!-- Contact fields first so phone/email always POST (large settings form can drop late fields). -->
  <div class="card sk-table-card shadow-sm mb-3 border-warning">
    <div class="card-body py-3">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <h6 class="mb-0"><i class="bi bi-telephone me-1 text-warning"></i> Invoice phone / email / address</h6>
        <span class="text-muted small">Saved with Settings — used on every invoice</span>
      </div>
      <div class="row g-2">
        <div class="col-md-4">
          <label class="form-label mb-1">Phone</label>
          <input type="text" name="site_phone" id="site_phone" class="form-control" value="<?= htmlspecialchars($settings['site_phone'] ?? '') ?>" placeholder="03-6242 2232" autocomplete="tel">
        </div>
        <div class="col-md-4">
          <label class="form-label mb-1">Email</label>
          <input type="text" name="site_email" id="site_email" class="form-control" value="<?= htmlspecialchars($settings['site_email'] ?? '') ?>" placeholder="golden2deal@gmail.com" autocomplete="email">
        </div>
        <div class="col-md-4">
          <label class="form-label mb-1">Address</label>
          <textarea name="site_address" id="site_address" class="form-control" rows="1" placeholder="Company address"><?= htmlspecialchars($settings['site_address'] ?? '') ?></textarea>
        </div>
      </div>
    </div>
  </div>

  <!-- Nav Tabs -->
  <ul class="nav nav-tabs mb-3" id="settingsTabs">
    <li class="nav-item"><button type="button" class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-general">General</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-whatsapp"><i class="bi bi-whatsapp me-1"></i>Order WhatsApp</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-invoice">Invoice</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-payment">Payment</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-email">Email</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-shipping">JT Express</button></li>
    <li class="nav-item"><button type="button" class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-sms">SMS OTP (iSMS)</button></li>
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
              <input type="text" name="site_name" class="form-control" value="<?= htmlspecialchars($settings['site_name'] ?? '2DEAL') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Currency Symbol</label>
              <input type="text" name="currency_symbol" class="form-control" value="<?= htmlspecialchars($settings['currency_symbol'] ?? 'RM') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Tax Rate (%)</label>
              <input type="number" name="tax_rate" class="form-control" step="0.01" value="<?= $settings['tax_rate'] ?? '18' ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Shipping Charge (RM)</label>
              <input type="number" name="shipping_charge" class="form-control" value="<?= $settings['shipping_charge'] ?? '50' ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Free Shipping Above (RM)</label>
              <input type="number" name="free_shipping_above" class="form-control" value="<?= $settings['free_shipping_above'] ?? '999' ?>">
            </div>
            <div class="col-12">
              <div class="alert alert-secondary small mb-0 py-2">
                Phone, email and address are edited in the yellow box above this form (always visible).
              </div>
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
                  <div class="form-text small text-muted">Malaysia country code without + (default 60). Order status alerts are under the <strong>Order WhatsApp</strong> tab.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order WhatsApp (Syncr) — visible to admin + vendor accounts -->
    <div class="tab-pane fade" id="tab-whatsapp">
      <div class="card sk-table-card shadow-sm">
        <div class="card-body">
          <h6 class="mb-1"><i class="bi bi-whatsapp text-success me-1"></i>Order WhatsApp (Syncr)</h6>
          <p class="text-muted small mb-3">Send WhatsApp messages to customers when order status changes (pending, confirmed, processing, shipped, delivered, cancelled). Uses Syncr <code>waadmin.syncr.in</code> for all vendors.</p>
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" name="askeva_whatsapp_enabled" id="askevaToggle" value="1"
              <?= (!isset($settings['askeva_whatsapp_enabled']) || $settings['askeva_whatsapp_enabled'] == '1') ? 'checked' : '' ?>>
            <label class="form-check-label" for="askevaToggle">Send WhatsApp on every order status change</label>
          </div>
          <div class="row g-3">
            <div class="col-md-8">
              <label class="form-label">API URL</label>
              <input type="text" name="askeva_api_url" class="form-control"
                value="<?= htmlspecialchars($settings['askeva_api_url'] ?? 'https://waadmin.syncr.in/v1/message/send-message') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Template language</label>
              <input type="text" name="askeva_template_lang" class="form-control"
                value="<?= htmlspecialchars($settings['askeva_template_lang'] ?? 'en') ?>">
            </div>
            <div class="col-12">
              <label class="form-label">API Token</label>
              <input type="text" name="askeva_api_token" class="form-control font-monospace" autocomplete="off"
                value="" placeholder="<?= !empty($settings['askeva_api_token']) ? '•••• saved (leave blank to keep)' : 'Paste Syncr API token' ?>">
              <?php if (!empty($settings['askeva_api_token'])): ?>
                <div class="form-text text-success">
                  Saved in DB (<?= strlen((string)$settings['askeva_api_token']) ?> chars, ends …<?= htmlspecialchars(substr((string)$settings['askeva_api_token'], -6)) ?>).
                </div>
              <?php else: ?>
                <div class="form-text text-warning">No token in database yet — paste and Save Settings.</div>
              <?php endif; ?>
            </div>
            <div class="col-12">
              <label class="form-label">Fallback utility template name (optional)</label>
              <input type="text" name="askeva_order_template" class="form-control"
                value="<?= htmlspecialchars($settings['askeva_order_template'] ?? '') ?>"
                placeholder="order_status_update">
              <div class="form-text">
                Per-status templates are configured in code (<code>application/config/whatsapp.php</code>).
                Create them from <code>database/whatsapp_order_templates.txt</code>
                ({{1}}=name, {{2}}=order no). This field is only an optional fallback.
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
          <p class="text-muted small mb-3">Company legal name and tax IDs for invoices. Phone / email / address are in the yellow box at the top of this page.</p>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Legal / Company Name</label>
              <input type="text" name="company_legal_name" class="form-control" value="<?= htmlspecialchars($settings['company_legal_name'] ?? $settings['site_name'] ?? '') ?>" placeholder="GOLDEN 2 DEAL (M) SDN. BHD.">
            </div>
            <div class="col-md-6">
              <label class="form-label">Tax ID</label>
              <input type="text" name="gstin" class="form-control" value="<?= htmlspecialchars($settings['gstin'] ?? '') ?>" placeholder="202101029427">
            </div>
            <div class="col-md-4">
              <label class="form-label">Company No. (SSM)</label>
              <input type="text" name="pan_no" class="form-control" value="<?= htmlspecialchars($settings['pan_no'] ?? '') ?>" placeholder="1429727-A">
            </div>
            <div class="col-md-4">
              <label class="form-label">State Code</label>
              <input type="text" name="state_code" class="form-control" value="<?= htmlspecialchars($settings['state_code'] ?? '') ?>" placeholder="e.g. WP">
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
            Malaysia payments use <strong>Razorpay Curlec</strong>. Get API keys from the
            <a href="https://curlec.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/" target="_blank">Curlec dashboard</a>
            (MYR, keys like <code>rzp_test_...</code>). Checkout needs a valid Malaysian mobile on the delivery address (<code>+60...</code>).
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
            <div class="col-md-6">
              <label class="form-label">Razorpay Webhook Secret</label>
              <input type="password" name="razorpay_webhook_secret" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['razorpay_webhook_secret'] ?? '') ?>"
                     placeholder="whsec_...">
              <div class="form-text">
                Webhook URL (register in Curlec Dashboard → Webhooks, events: <code>payment.captured</code>, <code>payment.authorized</code>, <code>order.paid</code>):
                <br><code class="user-select-all"><?= site_url('shopkart-api/payment/razorpay-webhook') ?></code>
                <br>Checkout return URL (used automatically as Curlec <code>callback_url</code>):
                <br><code class="user-select-all"><?= site_url('shopkart-api/payment/razorpay-return') ?></code>
              </div>
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
              <input type="text" name="smtp_from_name" class="form-control" value="<?= htmlspecialchars($settings['smtp_from_name'] ?? '2DEAL') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">SMTP Username</label>
              <input type="text" name="smtp_user" class="form-control" value="<?= htmlspecialchars($settings['smtp_user'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">SMTP Password</label>
              <input type="password" name="smtp_pass" class="form-control" value="<?= htmlspecialchars($settings['smtp_pass'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Admin Email</label>
              <input type="email" name="admin_email" class="form-control" value="<?= htmlspecialchars($settings['admin_email'] ?? '') ?>" placeholder="admin@yourdomain.com">
              <div class="form-text">Every customer/affiliate mail also notifies this inbox with a separate admin summary (not the same customer email).</div>
            </div>
            <div class="col-12">
              <div class="alert alert-info small mb-0">
                Use your mailbox SMTP (e.g. Hostinger: <code>smtp.hostinger.com</code>, port <code>465</code> SSL or <code>587</code> TLS).
                <strong>Site Email</strong> (General tab) must match the mailbox address you send from.
                Set <strong>Admin Email</strong> to receive admin digests for orders, invoices, status, affiliates, contact, etc.
              </div>
            </div>
            <div class="col-12">
              <button type="submit" formaction="<?= site_url('admin/settings/test_smtp') ?>" formmethod="post" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-envelope-check me-1"></i> Send SMTP test email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- JT Express Shipping -->
    <div class="tab-pane fade" id="tab-shipping">
      <div class="card sk-table-card shadow-sm">
        <div class="card-body">
          <?php
            $jtCfg = isset($jt_config) && is_array($jt_config) ? $jt_config : [];
            $jtUrls = is_array($jtCfg['api_urls'] ?? null) ? $jtCfg['api_urls'] : [];
            $isSandbox = sk_jt_express_is_sandbox($settings);
          ?>
          <div class="alert alert-info small">
            <i class="bi bi-truck me-1"></i>
            JT Express Malaysia Open Platform — create AWB, print label, track &amp; cancel from Admin → JT Express.
            All API credentials and sender details are stored in the <strong>database</strong> (saved below). No secrets in code.
            Turn <strong>Sandbox</strong> OFF for live orders (uses the same fields with your production account).
            <br><span class="text-muted">Database setup runs automatically when you open this page (no PHP CLI needed). Or import <code>database/jt_express.sql</code> in phpMyAdmin.</span>
            <hr class="my-2">
            <strong>Status sync webhook</strong> (register in JT Open Platform → Tracking Callback / Joint-Debugging):
            <br><code class="user-select-all"><?= site_url('shopkart-api/shipping/jt-webhook') ?></code>
            <div class="small text-muted mt-2">
              Expected ACK: <code>{"code":"1","msg":"success","data":"SUCCESS"}</code>
              · Encoding UTF-8 · Method POST (form <code>bizContent</code>)
            </div>
            <br><span class="text-muted">JT pushes <code>bizContent</code> (AWB + scan details) to this URL after each tracking change. Also auto-syncs when you open an order or click Track. Fill sender phone/address/city/state/postcode below.</span>
          </div>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" name="jt_express_enabled" value="1" id="jtEnabled"
                  <?= !empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0' ? 'checked' : '' ?>>
                <label class="form-check-label" for="jtEnabled">Enable JT Express</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" name="jt_express_sandbox" value="1" id="jtSandbox"
                  <?= $isSandbox ? 'checked' : '' ?>>
                <label class="form-check-label" for="jtSandbox">Sandbox (demo API)</label>
              </div>
              <div class="form-text">Uncheck for live production orders. Switch credentials below when changing mode.</div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Default parcel weight (kg)</label>
              <input type="text" name="jt_express_default_weight" class="form-control"
                     value="<?= htmlspecialchars($settings['jt_express_default_weight'] ?? '1') ?>">
            </div>

            <div class="col-12"><hr class="my-1">
              <h6 class="text-muted mb-0">
                API credentials
                <span class="badge bg-primary">From database</span>
                <?php if ($isSandbox): ?>
                  <span class="badge bg-secondary">Sandbox mode</span>
                <?php else: ?>
                  <span class="badge bg-success">Production mode</span>
                <?php endif; ?>
              </h6>
              <div class="form-text mb-2">
                Saved in the <code>settings</code> table. Use sandbox account when Sandbox is ON; production account when OFF.
                <?php if (!empty($jtUrls['sandbox']) || !empty($jtUrls['production'])): ?>
                  API:
                  <?= $isSandbox
                    ? '<code>' . htmlspecialchars($jtUrls['sandbox'] ?? 'https://demoopenapi.jtexpress.my/webopenplatformapi') . '</code>'
                    : '<code>' . htmlspecialchars($jtUrls['production'] ?? 'https://ylopenapi.jtexpress.my/webopenplatformapi') . '</code>' ?>
                <?php endif; ?>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">API Account <span class="text-danger">*</span></label>
              <input type="text" name="jt_express_api_account" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['jt_express_api_account'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Private Key <span class="text-danger">*</span></label>
              <input type="password" name="jt_express_private_key" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['jt_express_private_key'] ?? '') ?>"
                     autocomplete="new-password">
              <div class="form-text">Leave blank when saving to keep the current key.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Customer / Source Code <span class="text-danger">*</span></label>
              <input type="text" name="jt_express_customer_code" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['jt_express_customer_code'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Source Name</label>
              <input type="text" name="jt_express_customer_name" class="form-control"
                     value="<?= htmlspecialchars($settings['jt_express_customer_name'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Customer Password <span class="text-danger">*</span></label>
              <input type="password" name="jt_express_customer_password" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['jt_express_customer_password'] ?? '') ?>"
                     autocomplete="new-password">
              <div class="form-text">Sandbox: plaintext (hashed as MD5(password + jadada369t3)). Production: use the Open Platform password hash if JT provided one. Leave blank to keep current.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Demo UUID <span class="text-muted">(sandbox only)</span></label>
              <input type="text" name="jt_express_demo_uuid" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['jt_express_demo_uuid'] ?? '') ?>">
            </div>
            <div class="col-12"><hr class="my-1"><h6 class="text-muted mb-0">Sender (pickup) address</h6></div>
            <div class="col-md-6">
              <label class="form-label">Sender Name</label>
              <input type="text" name="jt_express_sender_name" class="form-control"
                     value="<?= htmlspecialchars($settings['jt_express_sender_name'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Sender Phone</label>
              <input type="text" name="jt_express_sender_phone" class="form-control"
                     value="<?= htmlspecialchars($settings['jt_express_sender_phone'] ?? '') ?>" placeholder="60123456789">
            </div>
            <div class="col-12">
              <label class="form-label">Sender Address</label>
              <input type="text" name="jt_express_sender_address" class="form-control"
                     value="<?= htmlspecialchars($settings['jt_express_sender_address'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">City</label>
              <input type="text" name="jt_express_sender_city" class="form-control"
                     value="<?= htmlspecialchars($settings['jt_express_sender_city'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">State</label>
              <input type="text" name="jt_express_sender_state" class="form-control"
                     value="<?= htmlspecialchars($settings['jt_express_sender_state'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Postcode</label>
              <input type="text" name="jt_express_sender_postcode" class="form-control"
                     value="<?= htmlspecialchars($settings['jt_express_sender_postcode'] ?? '') ?>">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- iSMS Malaysia OTP -->
    <div class="tab-pane fade" id="tab-sms">
      <div class="card sk-table-card shadow-sm">
        <div class="card-body">
          <div class="alert alert-info small">
            <i class="bi bi-phone me-1"></i>
            Login OTP via <a href="https://www.isms.com.my/" target="_blank" rel="noopener">iSMS Malaysia</a>.
            Use sub-account <strong>Username</strong> <code>2DEAL1</code> (or main portal username — not your email) plus either your
            <strong>portal login password</strong> or the <strong>API Key</strong> from your iSMS account page (both are sent as <code>pwd</code> to iSMS).
            If the portal lets you sign in with <em>email</em>, open your iSMS profile and copy the <strong>Username</strong> field for API use.
            Buy SMS credits in the iSMS portal before sending OTPs.
            <br><span class="text-muted">Test phone <code>0180000000</code> always uses OTP <code>1234</code> without sending SMS.</span>
          </div>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" name="isms_enabled" value="1" id="ismsEnabled"
                  <?= !empty($settings['isms_enabled']) && $settings['isms_enabled'] !== '0' ? 'checked' : '' ?>>
                <label class="form-check-label" for="ismsEnabled">Enable iSMS OTP (production)</label>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Country code</label>
              <input type="text" name="isms_country_code" class="form-control"
                     value="<?= htmlspecialchars($settings['isms_country_code'] ?? '60') ?>" placeholder="60">
            </div>
            <div class="col-md-4">
              <label class="form-label">OTP expiry (minutes)</label>
              <input type="number" name="isms_otp_interval" class="form-control" min="1" max="30"
                     value="<?= htmlspecialchars($settings['isms_otp_interval'] ?? '5') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">iSMS Username</label>
              <input type="text" name="isms_username" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['isms_username'] ?? '') ?>" autocomplete="off"
                     placeholder="Sub-account username e.g. 2DEAL1">
              <?php if (!empty($settings['isms_username'])): ?>
                <div class="form-text">Saved: <?= htmlspecialchars(sk_isms_mask_username($settings['isms_username'])) ?> (<?= strlen($settings['isms_username']) ?> chars)</div>
              <?php endif; ?>
            </div>
            <div class="col-md-6">
              <label class="form-label">iSMS Password <span class="text-muted">(portal login)</span></label>
              <input type="password" name="isms_password" class="form-control font-monospace"
                     value="" placeholder="<?= !empty($settings['isms_password']) ? 'Saved — enter only to change' : 'Portal login password' ?>"
                     autocomplete="new-password">
              <?php if (!empty($settings['isms_password'])): ?>
                <div class="form-text text-success">Portal password saved. Leave blank when saving other settings.</div>
              <?php endif; ?>
            </div>
            <div class="col-md-6">
              <label class="form-label">iSMS API Key</label>
              <input type="password" name="isms_api_key" class="form-control font-monospace"
                     value="" placeholder="<?= !empty($settings['isms_api_key']) ? 'Saved — enter only to change' : 'API Key from iSMS account page' ?>"
                     autocomplete="new-password">
              <?php if (!empty($settings['isms_api_key'])): ?>
                <div class="form-text text-success">API key saved. Used as <code>pwd</code> if portal password is empty or fails.</div>
              <?php else: ?>
                <div class="form-text">From iSMS account → API Key. Either password or API key is required.</div>
              <?php endif; ?>
            </div>
            <div class="col-md-6">
              <label class="form-label">Sender ID <span class="text-muted">(optional)</span></label>
              <input type="text" name="isms_sender_id" class="form-control font-monospace" maxlength="11"
                     value="<?= htmlspecialchars($settings['isms_sender_id'] ?? 'GOLDEN2DEAL') ?>" placeholder="GOLDEN2DEAL">
              <div class="form-text">Alphanumeric 3–11 chars. Malaysia shortcode may not show custom sender ID.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">SMS message template</label>
              <input type="text" name="isms_message" class="form-control"
                     value="<?= htmlspecialchars($settings['isms_message'] ?? 'Your OTP is %OTP%. Valid for 5 minutes.') ?>">
              <div class="form-text">Must include <code>%OTP%</code> — replaced with a new random 4-digit code each request (e.g. <em>Your OTP is 4839. Valid for 5 minutes.</em>).</div>
            </div>
            <div class="col-12"><hr class="my-1"><h6 class="text-muted mb-0">Developer testing</h6></div>
            <div class="col-12">
              <div class="alert alert-secondary small mb-0 py-2">
                <strong>Default dev login:</strong> mobile <code>0180000000</code> (or <code>60180000000</code>) + OTP <code>1234</code>.
                Works without iSMS credits. This number never sends real SMS even when iSMS is enabled.
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Test OTP code</label>
              <input type="text" name="isms_test_otp" class="form-control font-monospace" maxlength="4"
                     value="<?= htmlspecialchars($settings['isms_test_otp'] ?? '1234') ?>">
              <div class="form-text">Used for test phone and when iSMS is disabled.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Test mobile number</label>
              <input type="text" name="isms_test_phone" class="form-control font-monospace"
                     value="<?= htmlspecialchars($settings['isms_test_phone'] ?? '60180000000') ?>" placeholder="60180000000">
              <div class="form-text">Always uses test OTP above — no SMS sent for this number.</div>
            </div>
            <div class="col-12">
              <div class="border rounded p-3 bg-light">
                <div class="fw-semibold mb-2"><i class="bi bi-wallet2 me-1"></i>Test account wallet (for checkout wallet pay)</div>
                <p class="small text-muted mb-2">
                  <?php if (!empty($test_wallet_user)): ?>
                    User #<?= (int)$test_wallet_user['id'] ?>
                    · <?= htmlspecialchars($test_wallet_user['phone'] ?? '') ?>
                    · balance <strong>RM <?= number_format((float)($test_wallet_balance ?? 0), 2) ?></strong>
                  <?php else: ?>
                    No test user yet — crediting will create the <code>0180000000</code> account.
                  <?php endif; ?>
                </p>
                <div class="row g-2 align-items-end">
                  <div class="col-md-4">
                    <label class="form-label small mb-1">Add amount (RM)</label>
                    <input type="number" name="test_wallet_amount" class="form-control form-control-sm" min="1" step="0.01" value="500">
                  </div>
                  <div class="col-md-8">
                    <button type="submit" formaction="<?= site_url('admin/settings/credit_test_wallet') ?>" formmethod="post" class="btn btn-success btn-sm">
                      <i class="bi bi-plus-circle me-1"></i>Add wallet funds to test account
                    </button>
                    <span class="text-muted small ms-2">Then login as 0180000000 / OTP 1234 and pay with wallet.</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <button type="submit" formaction="<?= site_url('admin/settings/save_isms') ?>" formmethod="post" class="btn btn-warning btn-sm">
                <i class="bi bi-shield-lock me-1"></i>Save iSMS credentials
              </button>
              <button type="submit" formaction="<?= site_url('admin/settings/test_isms') ?>" formmethod="post" class="btn btn-outline-primary btn-sm ms-2">
                <i class="bi bi-plug me-1"></i>Test iSMS connection
              </button>
              <span class="text-muted small ms-2">Save credentials first, then test balance (~4,921 credits expected).</span>
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

<script>
(function () {
  var tabInput = document.getElementById('settingsTabInput');
  var params = new URLSearchParams(window.location.search);
  var tab = params.get('tab');
  if (tab) {
    var btn = document.querySelector('[data-bs-target="#tab-' + tab + '"]');
    if (btn && window.bootstrap) {
      bootstrap.Tab.getOrCreateInstance(btn).show();
    }
    if (tabInput) tabInput.value = tab;
  }
  document.querySelectorAll('#settingsTabs [data-bs-toggle="tab"]').forEach(function (el) {
    el.addEventListener('shown.bs.tab', function (e) {
      if (!tabInput) return;
      var target = e.target.getAttribute('data-bs-target') || '';
      tabInput.value = target.replace('#tab-', '');
    });
  });
})();
</script>
