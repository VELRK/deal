<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-shield-lock me-2 text-primary"></i>Roles & Permissions</h5>
</div>

<div class="row g-3">
  <div class="col-lg-5">
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Roles</div>
      <div class="card-body p-0">
        <table class="table mb-0">
          <thead><tr><th>Role</th><th>Slug</th><th></th></tr></thead>
          <tbody>
            <?php foreach ($roles as $r): ?>
            <tr>
              <td><?= htmlspecialchars($r['name']) ?><?= $r['is_system'] ? ' <span class="badge bg-secondary">System</span>' : '' ?></td>
              <td><code><?= htmlspecialchars($r['slug']) ?></code></td>
              <td><a href="<?= site_url('admin/roles/permissions/'.$r['id']) ?>" class="btn btn-sm btn-outline-primary">Permissions</a></td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="col-lg-7">
    <div class="card shadow-sm">
      <div class="card-header fw-semibold">Admin Users — Assign Role</div>
      <div class="card-body p-0">
        <table class="table mb-0 align-middle">
          <thead><tr><th>Name</th><th>Email</th><th>Current Role</th><th>Assign</th></tr></thead>
          <tbody>
            <?php foreach ($admins as $a): ?>
            <tr>
              <td><?= htmlspecialchars($a['name']) ?></td>
              <td><?= htmlspecialchars($a['email']) ?></td>
              <td><?= htmlspecialchars($a['role_name'] ?? $a['role']) ?></td>
              <td>
                <form method="post" action="<?= site_url('admin/roles/assign_admin') ?>" class="d-flex gap-1">
                  <input type="hidden" name="admin_id" value="<?= $a['id'] ?>">
                  <select name="role_id" class="form-select form-select-sm" style="max-width:140px">
                    <option value="">— Legacy role —</option>
                    <?php foreach ($roles as $r): ?>
                    <option value="<?= $r['id'] ?>" <?= (int)($a['role_id'] ?? 0) === (int)$r['id'] ? 'selected' : '' ?>><?= htmlspecialchars($r['name']) ?></option>
                    <?php endforeach; ?>
                  </select>
                  <button type="submit" class="btn btn-sm btn-primary">Save</button>
                </form>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card shadow-sm mt-3">
      <div class="card-header fw-semibold">Permission Modules</div>
      <div class="card-body">
        <?php foreach ($permissions as $module => $perms): ?>
        <div class="mb-2"><strong class="text-capitalize"><?= htmlspecialchars($module) ?></strong>:
          <?php foreach ($perms as $p): ?><span class="badge bg-light text-dark border me-1"><?= htmlspecialchars($p['action']) ?></span><?php endforeach; ?>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</div>
