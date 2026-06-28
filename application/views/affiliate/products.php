<h4 class="fw-bold mb-4"><i class="bi bi-box-seam text-success me-2"></i>Product Requests</h4>

<div class="row g-3">
  <div class="col-lg-5">
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Request a Product</div>
      <div class="card-body">
        <form method="post">
          <div class="mb-3">
            <label class="form-label">Select Product (optional)</label>
            <select name="product_id" class="form-select form-select-sm">
              <option value="">— Custom request —</option>
              <?php foreach ($products as $p): ?>
              <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['name']) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Product Name</label>
            <input type="text" name="product_name" class="form-control form-control-sm" placeholder="If not in list">
          </div>
          <div class="mb-3">
            <label class="form-label">Notes</label>
            <textarea name="notes" class="form-control form-control-sm" rows="3" placeholder="Why you want to promote this..."></textarea>
          </div>
          <button type="submit" class="btn btn-success btn-sm">Submit Request</button>
        </form>
      </div>
    </div>
  </div>
  <div class="col-lg-7">
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Your Requests</div>
      <div class="card-body p-0">
        <table class="table table-sm mb-0">
          <thead><tr><th>Product</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <?php foreach ($requests as $r): ?>
            <tr>
              <td><?= htmlspecialchars($r['product_name'] ?: ('Product #'.$r['product_id'])) ?></td>
              <td><span class="badge bg-secondary"><?= $r['status'] ?></span></td>
              <td class="small"><?= date('d M Y', strtotime($r['created_at'])) ?></td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($requests)): ?><tr><td colspan="3" class="text-center text-muted py-3">No requests yet.</td></tr><?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
