<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-people me-2 text-warning"></i>Customers</h5>
</div>

<div class="card sk-table-card shadow-sm mb-3">
  <div class="card-body py-2">
    <form method="GET" class="d-flex gap-2">
      <input type="text" name="search" class="form-control form-control-sm" style="max-width:250px;"
             placeholder="Search by name or email..." value="<?= htmlspecialchars($search ?? '') ?>">
      <button class="btn btn-sm btn-outline-warning px-3">Search</button>
      <a href="<?= site_url('admin/customers') ?>" class="btn btn-sm btn-outline-secondary">Reset</a>
    </form>
  </div>
</div>

<div class="card sk-table-card shadow-sm">
  <div class="card-body p-0">
    <table class="table table-hover align-middle mb-0">
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        <?php foreach ($customers as $c): ?>
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold"
                   style="width:36px;height:36px;font-size:14px;">
                <?= strtoupper(substr($c['name'],0,1)) ?>
              </div>
              <span class="fw-semibold"><?= htmlspecialchars($c['name']) ?></span>
            </div>
          </td>
          <td><?= htmlspecialchars($c['email']) ?></td>
          <td><?= $c['phone'] ?? '-' ?></td>
          <td><?= date('d M Y', strtotime($c['created_at'])) ?></td>
          <td>
            <span class="badge <?= $c['status'] ? 'bg-success' : 'bg-danger' ?>">
              <?= $c['status'] ? 'Active' : 'Blocked' ?>
            </span>
          </td>
          <td class="d-flex gap-1">
            <a href="<?= site_url('admin/customers/view/'.$c['id']) ?>" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-eye"></i>
            </a>
            <button onclick="skToggleStatus('<?= site_url('admin/customers/toggle/'.$c['id']) ?>')"
                    class="btn btn-sm <?= $c['status'] ? 'btn-outline-danger' : 'btn-outline-success' ?>">
              <i class="bi bi-<?= $c['status'] ? 'slash-circle' : 'check-circle' ?>"></i>
            </button>
          </td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($customers)): ?>
        <tr><td colspan="6" class="text-center py-5 text-muted">No customers found.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
  <?php $pages = ceil($total / $limit); if ($pages > 1): ?>
  <div class="card-footer bg-white d-flex justify-content-between align-items-center">
    <small class="text-muted"><?= $total ?> total customers</small>
    <nav><ul class="pagination pagination-sm mb-0">
      <?php for ($i=1; $i<=$pages; $i++): ?>
        <li class="page-item <?= $i===$page?'active':'' ?>">
          <a class="page-link" href="?page=<?= $i ?>&search=<?= urlencode($search??'') ?>"><?= $i ?></a>
        </li>
      <?php endfor; ?>
    </ul></nav>
  </div>
  <?php endif; ?>
</div>
