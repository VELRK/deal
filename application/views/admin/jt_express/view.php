<?php
/** @var array $order */ /** @var array $settings */ /** @var array $tracks */
$awb = $order['jt_bill_code'] ?? $order['tracking_number'] ?? '';
$hasAwb = $awb !== '';
?>
<div class="sk-page-header d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
  <div>
    <h5 class="sk-page-title mb-0">
      <i class="bi bi-truck text-warning me-2"></i>JT Express — <?= htmlspecialchars($order['order_number'] ?? '') ?>
    </h5>
    <div class="small text-muted mt-1">Create shipment, print label, and detailed tracking</div>
  </div>
  <div class="d-flex gap-2">
    <a href="<?= site_url('shopkart/jt-express') ?>" class="btn btn-sm btn-outline-secondary">
      <i class="bi bi-arrow-left me-1"></i> All shipments
    </a>
    <a href="<?= site_url('shopkart/orders/view/'.$order['id']) ?>" class="btn btn-sm btn-outline-primary">
      <i class="bi bi-cart-check me-1"></i> Open order
    </a>
  </div>
</div>

<?php if (empty($enabled)): ?>
<div class="alert alert-warning">JT Express is disabled in Settings.</div>
<?php endif; ?>

<?php if (!empty($status_changed)): ?>
<div class="alert alert-success">
  <i class="bi bi-arrow-repeat me-1"></i>
  Order status auto-updated from JT tracking:
  <strong><?= htmlspecialchars(ucfirst($status_before ?? '')) ?></strong>
  →
  <strong><?= htmlspecialchars(ucfirst($synced_status ?? ($order['status'] ?? ''))) ?></strong>
  (customer notified; admin email sent)
</div>
<?php endif; ?>

<div class="row g-3">
  <div class="col-lg-5">
    <div class="card shadow-sm border-warning mb-3">
      <div class="card-header bg-white fw-semibold">
        Shipment
        <?php if (sk_jt_express_is_sandbox($settings)): ?>
          <span class="badge bg-secondary ms-1">Sandbox</span>
        <?php endif; ?>
      </div>
      <div class="card-body small">
        <div class="mb-2"><span class="text-muted">AWB:</span> <strong id="jtAwb"><?= htmlspecialchars($awb ?: '—') ?></strong></div>
        <div class="mb-2"><span class="text-muted">Courier status:</span> <span id="jtCourier"><?= htmlspecialchars($order['jt_courier_status'] ?? 'not created') ?></span></div>
        <div class="mb-2">
          <span class="text-muted">Order status:</span>
          <span class="badge bg-dark" id="jtOrderStatus"><?= htmlspecialchars(ucfirst($order['status'] ?? '')) ?></span>
          <span class="text-muted small ms-1">(auto-updates from JT scans)</span>
        </div>
        <div class="mb-2"><span class="text-muted">Ready to pick up:</span> <?= sk_jt_format_datetime($order['processing_at'] ?? $order['jt_shipment_created_at'] ?? null) ?></div>
        <?php if (!empty($order['jt_shipment_created_at'])): ?>
        <div class="mb-2"><span class="text-muted">JT created:</span> <?= sk_jt_format_datetime($order['jt_shipment_created_at']) ?></div>
        <?php endif; ?>
        <?php if (!empty($order['shipped_at'])): ?>
        <div class="mb-2"><span class="text-muted">Shipped:</span> <?= sk_jt_format_datetime($order['shipped_at']) ?></div>
        <?php endif; ?>
        <?php if (!empty($order['delivered_at'])): ?>
        <div class="mb-2"><span class="text-muted">Delivered:</span> <?= sk_jt_format_datetime($order['delivered_at']) ?></div>
        <?php endif; ?>
        <div class="mb-0"><span class="text-muted">Tx ID:</span> <code><?= htmlspecialchars($order['jt_txlogistic_id'] ?? $order['order_number'] ?? '—') ?></code></div>
      </div>
      <div class="card-body border-top pt-3">
        <div class="d-grid gap-2" id="jtActions">
          <?php if (!$hasAwb): ?>
          <button type="button" class="btn btn-warning fw-semibold" onclick="jtAction('create')">
            <i class="bi bi-box-seam me-1"></i> Create JT Shipment
          </button>
          <?php else: ?>
          <a href="<?= site_url('shopkart/orders/jt_print/'.$order['id']) ?>" target="_blank" class="btn btn-outline-dark">
            <i class="bi bi-printer me-1"></i> Print Label
          </a>
          <button type="button" class="btn btn-outline-primary" onclick="jtAction('track')">
            <i class="bi bi-geo-alt me-1"></i> Refresh Tracking
          </button>
          <?php if (($order['jt_courier_status'] ?? '') !== 'cancelled'): ?>
          <button type="button" class="btn btn-outline-danger" onclick="jtAction('cancel')">
            <i class="bi bi-x-circle me-1"></i> Cancel JT Shipment
          </button>
          <?php endif; ?>
          <?php endif; ?>
        </div>
        <div id="jtMsg" class="small mt-2 text-muted"></div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-white fw-semibold">Receiver</div>
      <div class="card-body small">
        <strong><?= htmlspecialchars($order['shipping_name'] ?? '') ?></strong><br>
        <?= htmlspecialchars($order['shipping_phone'] ?? '') ?><br>
        <?= htmlspecialchars($order['shipping_line1'] ?? '') ?><br>
        <?php if (!empty($order['shipping_line2'])): ?><?= htmlspecialchars($order['shipping_line2']) ?><br><?php endif; ?>
        <?= htmlspecialchars($order['shipping_city'] ?? '') ?>,
        <?= htmlspecialchars($order['shipping_state'] ?? '') ?> —
        <?= htmlspecialchars($order['shipping_pincode'] ?? '') ?><br>
        <?= htmlspecialchars($order['shipping_country'] ?? '') ?>
      </div>
    </div>
  </div>

  <div class="col-lg-7">
    <div class="card shadow-sm h-100">
      <div class="card-header bg-white fw-semibold d-flex justify-content-between align-items-center">
        <span><i class="bi bi-geo-alt me-1 text-primary"></i> Detailed tracking</span>
        <?php if ($hasAwb): ?>
        <button type="button" class="btn btn-sm btn-outline-primary" onclick="jtAction('track')">Refresh</button>
        <?php endif; ?>
      </div>
      <div class="card-body" style="max-height:70vh;overflow:auto">
        <div id="jtTrackBox" class="<?= !empty($tracks) ? '' : 'd-none' ?>">
          <ul id="jtTrackList" class="list-unstyled mb-0">
            <?php foreach ($tracks as $ev): ?>
            <li class="border-bottom py-2">
              <div class="fw-semibold"><?= htmlspecialchars(sk_jt_track_event_label($ev)) ?></div>
            </li>
            <?php endforeach; ?>
          </ul>
        </div>
        <div id="jtTrackEmpty" class="text-muted text-center py-5 <?= empty($tracks) ? '' : 'd-none' ?>">
          <?php if ($hasAwb): ?>
            No scan events yet. Click <strong>Refresh Tracking</strong> after pickup.
          <?php else: ?>
            Create a JT shipment first to see tracking events here.
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function jtAction(action) {
  var orderId = <?= (int)$order['id'] ?>;
  var urls = {
    create: '<?= site_url('shopkart/orders/jt_create') ?>/' + orderId,
    track:  '<?= site_url('shopkart/orders/jt_track') ?>/' + orderId,
    cancel: '<?= site_url('shopkart/orders/jt_cancel') ?>/' + orderId
  };
  if (action === 'cancel' && !confirm('Cancel this JT Express shipment?')) return;
  var msg = document.getElementById('jtMsg');
  if (msg) msg.textContent = 'Working…';
  var payload = {};
  if (action === 'cancel') payload.reason = 'Cancelled from JT Express module';
  $.post(urls[action], payload, function(res) {
    if (action === 'track' && res.success) {
      var box = document.getElementById('jtTrackBox');
      var empty = document.getElementById('jtTrackEmpty');
      var list = document.getElementById('jtTrackList');
      list.innerHTML = '';
      (res.tracks || []).forEach(function(ev) {
        var li = document.createElement('li');
        li.className = 'border-bottom py-2';
        var time = ev.scanTime || ev.time || ev.acceptTime || '';
        var desc = ev.desc || ev.remark || ev.scanType || JSON.stringify(ev);
        li.innerHTML = '<div class="fw-semibold">' + (time ? time + ' — ' : '') + desc + '</div>';
        list.appendChild(li);
      });
      if ((res.tracks || []).length) {
        box.classList.remove('d-none');
        empty.classList.add('d-none');
      }
      if (msg) msg.textContent = res.message || 'Tracking updated.';
      if (res.bill_code) document.getElementById('jtAwb').textContent = res.bill_code;
      if (res.courier_status) {
        var c = document.getElementById('jtCourier');
        if (c) c.textContent = res.courier_status;
      }
      if (res.status) {
        var s = document.getElementById('jtOrderStatus');
        if (s) s.textContent = res.status.charAt(0).toUpperCase() + res.status.slice(1);
      }
      setTimeout(function() { location.reload(); }, 1200);
      return;
    }
    alert(res.message || (res.success ? 'Done.' : 'Request failed.'));
    if (res.success) location.reload();
  }, 'json').fail(function() {
    if (msg) msg.textContent = '';
    alert('Network error.');
  });
}
</script>
