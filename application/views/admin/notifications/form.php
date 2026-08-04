<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<div class="container-fluid py-3">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h5 class="sk-page-title mb-0"><i class="bi bi-bell-plus me-2 text-primary"></i>Compose Notification</h5>
    <a href="<?= site_url('shopkart/notifications') ?>" class="btn btn-sm btn-outline-secondary">Back</a>
  </div>

  <?php if (!empty($this->session->flashdata('error'))): ?>
    <div class="alert alert-danger"><?= htmlspecialchars($this->session->flashdata('error')) ?></div>
  <?php endif; ?>

  <?php if (empty($fcm_configured)): ?>
    <div class="alert alert-warning">Send will fail until <code>firebase.php</code> has the deal-bc4c4 service account. You can still save drafts.</div>
  <?php endif; ?>

  <div class="card shadow-sm">
    <div class="card-body">
      <form method="post" action="<?= site_url('shopkart/notifications/store') ?>" enctype="multipart/form-data" id="notifForm">
        <div class="mb-3">
          <label class="form-label">Title *</label>
          <input type="text" name="title" class="form-control" maxlength="200" required placeholder="Flash sale tonight">
        </div>
        <div class="mb-3">
          <label class="form-label">Body *</label>
          <textarea name="body" class="form-control" rows="3" required placeholder="Short message shown on the lock screen"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label d-block">Media mode</label>
          <div class="btn-group" role="group">
            <?php foreach (['none' => 'Text only', 'image' => 'Image only', 'video' => 'Video only', 'both' => 'Image + Video'] as $val => $label): ?>
              <input type="radio" class="btn-check" name="media_type" id="media_<?= $val ?>" value="<?= $val ?>" <?= $val === 'none' ? 'checked' : '' ?> autocomplete="off">
              <label class="btn btn-outline-primary btn-sm" for="media_<?= $val ?>"><?= $label ?></label>
            <?php endforeach; ?>
          </div>
          <div class="form-text">FCM shows image in the tray when set. Video is delivered as a data URL for the app to play.</div>
        </div>

        <div class="row g-3 mb-3" id="imageFields">
          <div class="col-md-8">
            <label class="form-label">Image URL</label>
            <input type="url" name="image_url" class="form-control" placeholder="https://…/banner.jpg">
          </div>
          <div class="col-md-4">
            <label class="form-label">Or upload image</label>
            <input type="file" name="image_file" class="form-control" accept="image/*">
          </div>
        </div>

        <div class="row g-3 mb-3" id="videoFields">
          <div class="col-md-8">
            <label class="form-label">Video URL</label>
            <input type="url" name="video_url" class="form-control" placeholder="https://…/clip.mp4">
          </div>
          <div class="col-md-4">
            <label class="form-label">Or upload video</label>
            <input type="file" name="video_file" class="form-control" accept="video/mp4,video/webm,video/quicktime">
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Click / deep link URL (optional)</label>
          <input type="text" name="click_url" class="form-control" placeholder="/shop-default or https://…">
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <label class="form-label">Default audience</label>
            <select name="audience" class="form-select" id="audienceSelect">
              <option value="all">All registered devices</option>
              <option value="user">One user id</option>
              <option value="token">One device token</option>
            </select>
          </div>
          <div class="col-md-8">
            <label class="form-label">Audience value</label>
            <input type="text" name="audience_value" class="form-control" id="audienceValue" placeholder="User id or FCM token (for test)">
          </div>
        </div>

        <div class="mb-3 border rounded p-3 bg-light">
          <label class="form-label">Test send extras</label>
          <div class="row g-2">
            <div class="col-md-8">
              <input type="text" name="test_token" class="form-control form-control-sm" placeholder="Paste FCM device token for Send test">
            </div>
            <div class="col-md-4">
              <input type="number" name="test_user_id" class="form-control form-control-sm" placeholder="Or user id" min="1">
            </div>
          </div>
          <div class="form-text"><?= (int)$token_count ?> token(s) currently registered.</div>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <button type="submit" name="action" value="draft" class="btn btn-outline-secondary">Save draft</button>
          <button type="submit" name="action" value="send_test" class="btn btn-warning">Send test</button>
          <button type="submit" name="action" value="send_all" class="btn btn-primary">Send to all devices</button>
        </div>
      </form>
    </div>
  </div>
</div>
<script>
(function () {
  function syncMedia() {
    var m = (document.querySelector('input[name="media_type"]:checked') || {}).value || 'none';
    document.getElementById('imageFields').style.display = (m === 'image' || m === 'both') ? '' : 'none';
    document.getElementById('videoFields').style.display = (m === 'video' || m === 'both') ? '' : 'none';
  }
  document.querySelectorAll('input[name="media_type"]').forEach(function (el) {
    el.addEventListener('change', syncMedia);
  });
  syncMedia();
})();
</script>
