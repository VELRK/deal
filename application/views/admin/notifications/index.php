<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<div class="container-fluid py-3">
  <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
    <div>
      <h5 class="sk-page-title mb-1"><i class="bi bi-bell me-2 text-primary"></i>Push Notifications</h5>
      <small class="text-muted">FCM · project deal-bc4c4 · <?= (int)$token_count ?> device token(s)</small>
    </div>
    <a href="<?= site_url('shopkart/notifications/create') ?>" class="btn btn-primary btn-sm">
      <i class="bi bi-plus-lg me-1"></i> Compose
    </a>
  </div>

  <?php if (!empty($this->session->flashdata('success'))): ?>
    <div class="alert alert-success"><?= htmlspecialchars($this->session->flashdata('success')) ?></div>
  <?php endif; ?>
  <?php if (!empty($this->session->flashdata('error'))): ?>
    <div class="alert alert-danger"><?= htmlspecialchars($this->session->flashdata('error')) ?></div>
  <?php endif; ?>

  <?php if (empty($fcm_configured)): ?>
    <div class="alert alert-warning">
      Firebase Admin service account is not set. Compose and drafts work; <strong>Send</strong> needs credentials in
      <code>application/config/firebase.php</code> (see <code>firebase.php.example</code>).
    </div>
  <?php else: ?>
    <div class="alert alert-success py-2">FCM service account configured for project <code><?= htmlspecialchars($firebase_web['projectId'] ?? 'deal-bc4c4') ?></code>.</div>
  <?php endif; ?>

  <form method="get" class="row g-2 mb-3">
    <div class="col-auto">
      <select name="status" class="form-select form-select-sm">
        <option value="">All statuses</option>
        <?php foreach (['draft','sent','failed'] as $s): ?>
          <option value="<?= $s ?>" <?= ($status ?? '') === $s ? 'selected' : '' ?>><?= ucfirst($s) ?></option>
        <?php endforeach; ?>
      </select>
    </div>
    <div class="col-auto">
      <button class="btn btn-sm btn-outline-secondary" type="submit">Filter</button>
    </div>
  </form>

  <div class="card shadow-sm">
    <div class="table-responsive">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Media</th>
            <th>Audience</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($rows)): ?>
            <tr><td colspan="7" class="text-center text-muted py-4">No notifications yet. Compose one to test image / video / both.</td></tr>
          <?php else: foreach ($rows as $r): ?>
            <tr>
              <td>#<?= (int)$r['id'] ?></td>
              <td>
                <div class="fw-semibold"><?= htmlspecialchars($r['title']) ?></div>
                <div class="small text-muted text-truncate" style="max-width:280px"><?= htmlspecialchars($r['body']) ?></div>
              </td>
              <td><span class="badge bg-secondary"><?= htmlspecialchars($r['media_type']) ?></span></td>
              <td class="small"><?= htmlspecialchars($r['audience']) ?><?= $r['audience_value'] ? ': ' . htmlspecialchars(mb_strimwidth($r['audience_value'], 0, 24, '…')) : '' ?></td>
              <td>
                <?php
                  $cls = $r['status'] === 'sent' ? 'success' : ($r['status'] === 'failed' ? 'danger' : 'secondary');
                ?>
                <span class="badge bg-<?= $cls ?>"><?= htmlspecialchars($r['status']) ?></span>
              </td>
              <td class="small text-muted"><?= htmlspecialchars($r['created_at'] ?? '') ?></td>
              <td class="text-end">
                <a class="btn btn-sm btn-outline-primary" href="<?= site_url('shopkart/notifications/view/'.$r['id']) ?>">Open</a>
              </td>
            </tr>
          <?php endforeach; endif; ?>
        </tbody>
      </table>
    </div>
  </div>

  <?php
    $pages = max(1, (int)ceil(($total ?? 0) / max(1, (int)$limit)));
    if ($pages > 1):
  ?>
    <nav class="mt-3">
      <ul class="pagination pagination-sm">
        <?php for ($p = 1; $p <= $pages; $p++): ?>
          <li class="page-item <?= $p === (int)$page ? 'active' : '' ?>">
            <a class="page-link" href="?page=<?= $p ?>&status=<?= urlencode((string)$status) ?>"><?= $p ?></a>
          </li>
        <?php endfor; ?>
      </ul>
    </nav>
  <?php endif; ?>
</div>
