<h4 class="fw-bold mb-4"><i class="bi bi-shield-check text-success me-2"></i>KYC Verification</h4>

<div class="alert alert-<?= ($affiliate['kyc_status'] ?? '') === 'verified' ? 'success' : 'warning' ?> py-2">
  KYC Status: <strong><?= ucfirst($affiliate['kyc_status'] ?? 'pending') ?></strong>
</div>

<div class="row g-3">
  <div class="col-lg-5">
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Upload Document</div>
      <div class="card-body">
        <form method="post" enctype="multipart/form-data">
          <div class="mb-3">
            <label class="form-label">Document Type</label>
            <select name="doc_type" class="form-select form-select-sm">
              <option value="aadhaar">Aadhaar</option>
              <option value="pan">PAN</option>
              <option value="bank_proof">Bank Proof</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">File (JPG, PNG, PDF)</label>
            <input type="file" name="document" class="form-control form-control-sm" required accept=".jpg,.jpeg,.png,.pdf">
          </div>
          <button type="submit" class="btn btn-success btn-sm">Upload</button>
        </form>
      </div>
    </div>
  </div>
  <div class="col-lg-7">
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Uploaded Documents</div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead><tr><th>Type</th><th>Status</th><th>Uploaded</th><th></th></tr></thead>
          <tbody>
            <?php foreach ($documents as $d): ?>
            <tr>
              <td><?= ucfirst($d['doc_type']) ?></td>
              <td><span class="badge bg-secondary"><?= $d['status'] ?></span></td>
              <td class="small"><?= date('d M Y', strtotime($d['created_at'])) ?></td>
              <td><a href="<?= base_url($d['file_path']) ?>" target="_blank" class="btn btn-sm btn-outline-primary">View</a></td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($documents)): ?><tr><td colspan="4" class="text-center text-muted py-3">No documents uploaded.</td></tr><?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
