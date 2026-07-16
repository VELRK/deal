<?php $is_edit = !empty($affiliate); $a = $affiliate ?? []; $is_vendor = !empty($is_vendor_scope); ?>
<div class="sk-page-header"><h5 class="sk-page-title"><?= $is_edit ? 'Edit Affiliate' : 'Add Affiliate' ?></h5></div>
<div class="card shadow-sm" style="max-width:640px;">
  <div class="card-body">
    <form action="<?= site_url($is_edit ? 'admin/affiliates/update/'.$a['id'] : 'admin/affiliates/store') ?>" method="post">
      <?php if (!$is_vendor && !empty($vendors)): ?>
      <div class="mb-3">
        <label class="form-label">Vendor (optional)</label>
        <select name="vendor_id" class="form-select">
          <option value="">Platform affiliate</option>
          <?php foreach ($vendors as $v): ?>
          <option value="<?= (int)$v['id'] ?>" <?= ((int)($a['vendor_id']??0) === (int)$v['id']) ? 'selected' : '' ?>><?= htmlspecialchars($v['business_name'] ?: $v['owner_name']) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <?php endif; ?>
      <div class="mb-3"><label class="form-label">Name</label><input type="text" name="name" id="affName" class="form-control" required value="<?= htmlspecialchars($a['name']??'') ?>"></div>
      <div class="mb-3"><label class="form-label">Email</label><input type="email" name="email" class="form-control" required value="<?= htmlspecialchars($a['email']??'') ?>"></div>
      <div class="mb-3"><label class="form-label">Phone</label><input type="text" name="phone" id="affPhone" class="form-control" required value="<?= htmlspecialchars($a['phone']??'') ?>"></div>
      <div class="mb-3"><label class="form-label">Address</label><input type="text" name="address_line1" class="form-control mb-2" placeholder="Line 1" value="<?= htmlspecialchars($a['address_line1']??'') ?>"><input type="text" name="address_line2" class="form-control" placeholder="Line 2" value="<?= htmlspecialchars($a['address_line2']??'') ?>"></div>
      <div class="row">
        <div class="col-md-4 mb-3"><label class="form-label">City</label><input type="text" name="city" class="form-control" value="<?= htmlspecialchars($a['city']??'') ?>"></div>
        <div class="col-md-4 mb-3"><label class="form-label">State</label><input type="text" name="state" class="form-control" value="<?= htmlspecialchars($a['state']??'') ?>"></div>
        <div class="col-md-4 mb-3"><label class="form-label">Pincode</label><input type="text" name="pincode" class="form-control" value="<?= htmlspecialchars($a['pincode']??'') ?>"></div>
      </div>
      <div class="mb-3"><label class="form-label">About</label><textarea name="about" class="form-control" rows="2"><?= htmlspecialchars($a['about']??'') ?></textarea></div>
      <hr><small class="text-muted fw-semibold">Bank (payouts)</small>
      <div class="row mt-2">
        <div class="col-md-6 mb-3"><label class="form-label">Account Name</label><input type="text" name="bank_account_name" class="form-control" value="<?= htmlspecialchars($a['bank_account_name']??'') ?>"></div>
        <div class="col-md-6 mb-3"><label class="form-label">Account No.</label><input type="text" name="bank_account_number" class="form-control" value="<?= htmlspecialchars($a['bank_account_number']??'') ?>"></div>
        <div class="col-md-6 mb-3"><label class="form-label">IFSC</label><input type="text" name="bank_ifsc" class="form-control" value="<?= htmlspecialchars($a['bank_ifsc']??'') ?>"></div>
        <div class="col-md-6 mb-3"><label class="form-label">Bank</label><input type="text" name="bank_name" class="form-control" value="<?= htmlspecialchars($a['bank_name']??'') ?>"></div>
      </div>
      <div class="mb-3">
        <label class="form-label">Promo Code</label>
        <div class="input-group">
          <input type="text" name="promo_code" id="affPromo" class="form-control text-uppercase" value="<?= htmlspecialchars($a['promo_code']??'') ?>" placeholder="Auto: first 4 of name + last 4 of phone" <?= $is_edit ? '' : 'readonly' ?>>
          <?php if ($is_edit): ?>
          <button type="button" class="btn btn-outline-secondary" id="checkPromoBtn">Check</button>
          <?php else: ?>
          <button type="button" class="btn btn-outline-secondary" id="genPromoBtn" title="Regenerate">Auto</button>
          <?php endif; ?>
        </div>
        <small id="promoStatus" class="text-muted"><?= $is_edit ? '' : 'Generated from name (first 4 letters, padded with 0) + phone (last 4 digits).' ?></small>
      </div>
      <div class="row">
        <div class="col-md-4 mb-3"><label class="form-label">Affiliate Commission %</label><input type="number" step="0.01" name="commission_rate" class="form-control" value="<?= htmlspecialchars($a['commission_rate']??'5') ?>"><small class="text-muted">Earned by affiliate on each sale</small></div>
        <div class="col-md-4 mb-3"><label class="form-label">Customer Checkout Discount %</label><input type="number" step="0.01" min="0" max="100" name="customer_discount_percent" class="form-control" value="<?= htmlspecialchars($a['customer_discount_percent']??'0') ?>"><small class="text-muted">Deducted from order subtotal</small></div>
        <div class="col-md-4 mb-3">
          <label class="form-label">Checkout Discount</label>
          <div class="form-check form-switch mt-2">
            <input class="form-check-input" type="checkbox" name="discount_active" id="discActive" value="1" <?= !empty($a['discount_active']) ? 'checked' : '' ?>>
            <label class="form-check-label" for="discActive">Active at cart/checkout</label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Status</label>
          <select name="status" class="form-select">
            <?php foreach (['pending','approved','rejected','suspended'] as $st): ?>
            <option value="<?= $st ?>" <?= ($a['status']??'approved')===$st?'selected':'' ?>><?= ucfirst($st) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">KYC Status</label>
        <select name="kyc_status" class="form-select">
          <?php foreach (['pending','verified','rejected'] as $k): ?>
          <option value="<?= $k ?>" <?= ($a['kyc_status']??'pending')===$k?'selected':'' ?>><?= ucfirst($k) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <?php if ($is_edit): ?>
      <div class="mb-3">
        <label class="form-label">Password <span class="text-muted small">(leave blank to keep)</span></label>
        <input type="password" name="password" class="form-control" autocomplete="new-password">
        <small class="text-muted">Prefer sending an invite link instead of setting a password here.</small>
      </div>
      <?php else: ?>
      <div class="alert alert-info py-2 small mb-3">
        <i class="bi bi-envelope-check me-1"></i>
        No password needed. After create, a <strong>verification link</strong> is emailed so the affiliate sets their own password on first login.
      </div>
      <?php endif; ?>
      <div class="mb-3"><label class="form-label">Notes</label><textarea name="notes" class="form-control" rows="2"><?= htmlspecialchars($a['notes']??'') ?></textarea></div>
      <button type="submit" class="btn btn-success"><?= $is_edit ? 'Update' : 'Create' ?></button>
      <a href="<?= site_url('admin/affiliates') ?>" class="btn btn-outline-secondary">Cancel</a>
    </form>
  </div>
</div>
<script>
function buildPromo() {
  var name = (document.getElementById('affName')?.value || '').replace(/[^a-zA-Z]/g, '');
  var four = name.substring(0, 4).toUpperCase();
  while (four.length < 4) four += '0';
  var digits = (document.getElementById('affPhone')?.value || '').replace(/\D/g, '');
  var last4 = digits.length >= 4 ? digits.slice(-4) : digits.padStart(4, '0');
  if (!last4) last4 = '0000';
  return four + last4;
}
function refreshPromo() {
  var el = document.getElementById('affPromo');
  if (!el || el.readOnly === false && <?= $is_edit ? 'true' : 'false' ?>) return;
  if (!<?= $is_edit ? 'true' : 'false' ?>) el.value = buildPromo();
}
document.getElementById('affName')?.addEventListener('input', refreshPromo);
document.getElementById('affPhone')?.addEventListener('input', refreshPromo);
document.getElementById('genPromoBtn')?.addEventListener('click', function() {
  document.getElementById('affPromo').value = buildPromo();
});
document.getElementById('checkPromoBtn')?.addEventListener('click', function() {
  var code = document.getElementById('affPromo').value.trim();
  if (!code) { document.getElementById('promoStatus').textContent = 'Enter a code first.'; return; }
  fetch('<?= site_url('admin/affiliates/check_promo') ?>?code=' + encodeURIComponent(code) + '&exclude=<?= (int)($a['id']??0) ?>')
    .then(r => r.json()).then(d => {
      document.getElementById('promoStatus').textContent = d.available ? '✓ Available' : '✗ Already taken';
      document.getElementById('promoStatus').className = d.available ? 'text-success' : 'text-danger';
    });
});
<?php if (!$is_edit): ?>refreshPromo();<?php endif; ?>
</script>
