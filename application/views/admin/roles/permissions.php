<div class="sk-page-header d-flex justify-content-between align-items-center">
  <h5 class="sk-page-title mb-0"><i class="bi bi-shield-check me-2"></i>Permissions — <?= htmlspecialchars($role['name']) ?></h5>
  <a href="<?= site_url('admin/roles') ?>" class="btn btn-sm btn-outline-secondary">Back</a>
</div>

<form method="post" class="card shadow-sm mt-3">
  <div class="card-body">
    <?php foreach ($permissions as $module => $perms): ?>
    <div class="mb-4">
      <h6 class="text-uppercase text-muted small fw-bold"><?= htmlspecialchars($module) ?></h6>
      <div class="row g-2">
        <?php foreach ($perms as $p): ?>
        <div class="col-md-4">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="permissions[]" value="<?= $p['id'] ?>" id="perm<?= $p['id'] ?>"
              <?= in_array((int)$p['id'], $assigned, true) ? 'checked' : '' ?>>
            <label class="form-check-label" for="perm<?= $p['id'] ?>"><?= htmlspecialchars($p['description']) ?></label>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endforeach; ?>
  </div>
  <div class="card-footer"><button type="submit" class="btn btn-primary">Save Permissions</button></div>
</form>
