<h4 class="fw-bold mb-4"><i class="bi bi-person-circle text-success me-2"></i>My Profile</h4>

<div class="row g-3">
  <div class="col-lg-7">
    <div class="card shadow-sm mb-3">
      <div class="card-header fw-semibold">Basic Details</div>
      <div class="card-body">
        <form method="post">
          <input type="hidden" name="action" value="profile">
          <div class="row g-2">
            <div class="col-md-6 mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" name="name" class="form-control" required value="<?= htmlspecialchars($affiliate['name']) ?>">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" value="<?= htmlspecialchars($affiliate['email']) ?>" readonly disabled>
              <small class="text-muted">Contact admin to change email.</small>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Phone</label>
              <input type="text" name="phone" class="form-control" required value="<?= htmlspecialchars($affiliate['phone']) ?>">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Promo Code</label>
              <input type="text" class="form-control" value="<?= htmlspecialchars($affiliate['promo_code']) ?>" readonly disabled>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Address Line 1</label>
              <input type="text" name="address_line1" class="form-control" value="<?= htmlspecialchars($affiliate['address_line1'] ?? '') ?>">
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Address Line 2</label>
              <input type="text" name="address_line2" class="form-control" value="<?= htmlspecialchars($affiliate['address_line2'] ?? '') ?>">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">City</label>
              <input type="text" name="city" class="form-control" value="<?= htmlspecialchars($affiliate['city'] ?? '') ?>">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">State</label>
              <input type="text" name="state" class="form-control" value="<?= htmlspecialchars($affiliate['state'] ?? '') ?>">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Pincode</label>
              <input type="text" name="pincode" class="form-control" value="<?= htmlspecialchars($affiliate['pincode'] ?? '') ?>">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Country</label>
              <input type="text" name="country" class="form-control" value="<?= htmlspecialchars($affiliate['country'] ?? 'India') ?>">
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">About / Bio</label>
              <textarea name="about" class="form-control" rows="3" placeholder="Short intro for your affiliate profile"><?= htmlspecialchars($affiliate['about'] ?? '') ?></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-success">Save Profile</button>
        </form>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Bank Details (for payouts)</div>
      <div class="card-body">
        <form method="post">
          <input type="hidden" name="action" value="profile">
          <div class="mb-3"><label class="form-label">Account Name</label><input type="text" name="bank_account_name" class="form-control" value="<?= htmlspecialchars($affiliate['bank_account_name'] ?? '') ?>"></div>
          <div class="mb-3"><label class="form-label">Account Number</label><input type="text" name="bank_account_number" class="form-control" value="<?= htmlspecialchars($affiliate['bank_account_number'] ?? '') ?>"></div>
          <div class="row g-2">
            <div class="col-md-6 mb-3"><label class="form-label">IFSC</label><input type="text" name="bank_ifsc" class="form-control" value="<?= htmlspecialchars($affiliate['bank_ifsc'] ?? '') ?>"></div>
            <div class="col-md-6 mb-3"><label class="form-label">Bank Name</label><input type="text" name="bank_name" class="form-control" value="<?= htmlspecialchars($affiliate['bank_name'] ?? '') ?>"></div>
          </div>
          <input type="hidden" name="name" value="<?= htmlspecialchars($affiliate['name']) ?>">
          <input type="hidden" name="phone" value="<?= htmlspecialchars($affiliate['phone']) ?>">
          <button type="submit" class="btn btn-outline-success btn-sm">Save Bank Details</button>
        </form>
      </div>
    </div>
  </div>

  <div class="col-lg-5">
    <div class="card shadow-sm" id="password">
      <div class="card-header fw-semibold">Change Password</div>
      <div class="card-body">
        <p class="small text-muted">For security, password changes require a 6-digit code sent to <strong><?= htmlspecialchars($affiliate['email']) ?></strong>.</p>
        <form method="post" class="mb-3">
          <input type="hidden" name="action" value="send_code">
          <button type="submit" class="btn btn-outline-primary btn-sm w-100">Send Verification Code to Email</button>
        </form>
        <form method="post">
          <input type="hidden" name="action" value="change_password">
          <div class="mb-3">
            <label class="form-label">Email Code</label>
            <input type="text" name="code" class="form-control" maxlength="6" pattern="\d{6}" placeholder="6-digit code" required>
          </div>
          <div class="mb-3">
            <label class="form-label">New Password</label>
            <input type="password" name="password" class="form-control" minlength="6" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Confirm Password</label>
            <input type="password" name="password_confirm" class="form-control" minlength="6" required>
          </div>
          <button type="submit" class="btn btn-success w-100">Update Password</button>
        </form>
        <p class="small mt-3 mb-0"><a href="<?= site_url('admin/affiliate/forgot-password') ?>">Forgot password?</a></p>
      </div>
    </div>

    <div class="card shadow-sm mt-3">
      <div class="card-body small">
        <div class="d-flex justify-content-between"><span class="text-muted">Commission</span><strong><?= $affiliate['commission_rate'] ?>%</strong></div>
        <div class="d-flex justify-content-between"><span class="text-muted">Checkout discount</span><strong><?= !empty($affiliate['discount_active']) ? number_format((float)($affiliate['customer_discount_percent']??0),1).'%' : 'Off' ?></strong></div>
        <div class="d-flex justify-content-between"><span class="text-muted">KYC</span><strong><?= ucfirst($affiliate['kyc_status']) ?></strong></div>
      </div>
    </div>
  </div>
</div>
