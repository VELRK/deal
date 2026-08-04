<?php defined('BASEPATH') OR exit('No direct script access allowed');
$this->load->helper('sk_fcm');
?>
<div class="container-fluid py-3">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h5 class="sk-page-title mb-0"><i class="bi bi-bell me-2"></i>Notification #<?= (int)$row['id'] ?></h5>
    <div class="d-flex gap-2">
      <a href="<?= site_url('shopkart/notifications/create') ?>" class="btn btn-sm btn-primary">Compose new</a>
      <a href="<?= site_url('shopkart/notifications') ?>" class="btn btn-sm btn-outline-secondary">List</a>
    </div>
  </div>

  <?php if (!empty($this->session->flashdata('success'))): ?>
    <div class="alert alert-success"><?= htmlspecialchars($this->session->flashdata('success')) ?></div>
  <?php endif; ?>
  <?php if (!empty($this->session->flashdata('error'))): ?>
    <div class="alert alert-danger"><?= htmlspecialchars($this->session->flashdata('error')) ?></div>
  <?php endif; ?>

  <div class="row g-3">
    <div class="col-lg-7">
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h6 class="mb-0"><?= htmlspecialchars($row['title']) ?></h6>
            <span class="badge bg-<?= $row['status']==='sent'?'success':($row['status']==='failed'?'danger':'secondary') ?>"><?= htmlspecialchars($row['status']) ?></span>
          </div>
          <p class="mt-2 mb-2"><?= nl2br(htmlspecialchars($row['body'])) ?></p>
          <dl class="row small mb-0">
            <dt class="col-sm-3">Media</dt><dd class="col-sm-9"><?= htmlspecialchars($row['media_type']) ?></dd>
            <dt class="col-sm-3">Image</dt>
            <dd class="col-sm-9">
              <?php if (!empty($row['image_url'])): ?>
                <a href="<?= htmlspecialchars(sk_fcm_absolute_url($row['image_url'])) ?>" target="_blank" rel="noopener"><?= htmlspecialchars($row['image_url']) ?></a>
                <div class="mt-2"><img src="<?= htmlspecialchars(sk_fcm_absolute_url($row['image_url'])) ?>" alt="" style="max-height:120px;border-radius:8px"></div>
              <?php else: ?>—<?php endif; ?>
            </dd>
            <dt class="col-sm-3">Video</dt>
            <dd class="col-sm-9">
              <?php if (!empty($row['video_url'])): ?>
                <a href="<?= htmlspecialchars(sk_fcm_absolute_url($row['video_url'])) ?>" target="_blank" rel="noopener"><?= htmlspecialchars($row['video_url']) ?></a>
              <?php else: ?>—<?php endif; ?>
            </dd>
            <dt class="col-sm-3">Click URL</dt><dd class="col-sm-9"><?= htmlspecialchars($row['click_url'] ?: '—') ?></dd>
            <dt class="col-sm-3">Audience</dt><dd class="col-sm-9"><?= htmlspecialchars($row['audience']) ?><?= $row['audience_value'] ? ' · ' . htmlspecialchars($row['audience_value']) : '' ?></dd>
            <dt class="col-sm-3">Created</dt><dd class="col-sm-9"><?= htmlspecialchars($row['created_at'] ?? '') ?></dd>
            <dt class="col-sm-3">Sent</dt><dd class="col-sm-9"><?= htmlspecialchars($row['sent_at'] ?? '—') ?></dd>
            <dt class="col-sm-3">Result</dt><dd class="col-sm-9"><code class="small"><?= htmlspecialchars($row['result_json'] ?? '') ?></code></dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="col-lg-5">
      <div class="card shadow-sm mb-3">
        <div class="card-header">Send again / test</div>
        <div class="card-body">
          <?php if (empty($fcm_configured)): ?>
            <div class="alert alert-warning mb-2">Configure <code>firebase.php</code> service account first.</div>
          <?php endif; ?>
          <form method="post" action="<?= site_url('shopkart/notifications/send/'.$row['id']) ?>">
            <div class="mb-2">
              <label class="form-label">Test device token</label>
              <input type="text" name="test_token" class="form-control form-control-sm" placeholder="FCM token">
            </div>
            <div class="mb-3">
              <label class="form-label">Or test user id</label>
              <input type="number" name="test_user_id" class="form-control form-control-sm" min="1" placeholder="user id">
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <button type="submit" name="action" value="send_test" class="btn btn-warning btn-sm">Send test</button>
              <button type="submit" name="action" value="send_all" class="btn btn-primary btn-sm">Send to all</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="card shadow-sm">
    <div class="card-header">Delivery logs</div>
    <div class="table-responsive">
      <table class="table table-sm mb-0">
        <thead><tr><th>Time</th><th>User</th><th>OK</th><th>Token</th><th>Response</th></tr></thead>
        <tbody>
          <?php if (empty($logs)): ?>
            <tr><td colspan="5" class="text-muted text-center py-3">No sends yet.</td></tr>
          <?php else: foreach ($logs as $log): ?>
            <tr>
              <td class="small"><?= htmlspecialchars($log['created_at'] ?? '') ?></td>
              <td><?= $log['user_id'] ? (int)$log['user_id'] : '—' ?></td>
              <td><?= !empty($log['success']) ? '✓' : '✗' ?></td>
              <td class="small text-truncate" style="max-width:140px"><?= htmlspecialchars(mb_strimwidth($log['token'] ?? '', 0, 28, '…')) ?></td>
              <td class="small"><code><?= htmlspecialchars(mb_strimwidth($log['response'] ?? '', 0, 120, '…')) ?></code></td>
            </tr>
          <?php endforeach; endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>
