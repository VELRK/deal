<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>

<div class="sk-page-header">
  <h5 class="sk-page-title">
    <i class="bi bi-receipt me-2 text-warning"></i>
    Order <span class="text-warning"><?= htmlspecialchars($order['order_number']) ?></span>
  </h5>
  <div class="d-flex gap-2">
    <a href="<?= site_url('admin/orders/invoice/'.$order['id']) ?>" target="_blank" class="btn btn-sm btn-outline-secondary">
      <i class="bi bi-printer me-1"></i> Invoice
    </a>
    <button type="button" class="btn btn-sm btn-outline-primary" id="btnSendInvoice" onclick="sendInvoice(<?= (int)$order['id'] ?>)">
      <i class="bi bi-envelope me-1"></i> Email Invoice
    </button>
    <a href="<?= site_url('admin/orders') ?>" class="btn btn-sm btn-outline-secondary">
      <i class="bi bi-arrow-left me-1"></i> Back
    </a>
  </div>
</div>

<div class="row g-3">
  <!-- Order Items -->
  <div class="col-lg-8">
    <div class="card sk-table-card shadow-sm mb-3">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Order Items</div>
      <div class="card-body p-0">
        <table class="table mb-0">
          <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
          <tbody>
            <?php foreach ($order['items'] as $item): ?>
            <tr>
              <td>
                <?php if ($item['thumbnail']): ?>
                  <img src="<?= base_url($item['thumbnail']) ?>" width="40" class="rounded me-2">
                <?php endif; ?>
                <?= htmlspecialchars($item['product_name']) ?>
                <?php if ($item['product_sku']): ?>
                  <small class="text-muted d-block">SKU: <?= $item['product_sku'] ?></small>
                <?php endif; ?>
              </td>
              <td><?= $currency . number_format($item['price'],2) ?></td>
              <td><?= $item['quantity'] ?></td>
              <td><?= $currency . number_format($item['subtotal'],2) ?></td>
            </tr>
            <?php endforeach; ?>
          </tbody>
          <tfoot class="table-light">
            <tr><td colspan="3" class="text-end fw-semibold">Subtotal</td><td><?= $currency . number_format($order['subtotal'],2) ?></td></tr>
            <?php
            $this->load->helper('sk_invoice');
            $disc = sk_order_discount_breakdown($order, $settings ?? []);
            $affDiscPct = (!empty($affiliate['customer_discount_percent']) && (float)$affiliate['customer_discount_percent'] > 0)
                ? rtrim(rtrim(number_format((float)$affiliate['customer_discount_percent'], 2), '0'), '.') . '%'
                : '';
            if (($disc['affiliate'] ?? 0) > 0): ?>
            <tr><td colspan="3" class="text-end text-success">Affiliate checkout discount (<?= htmlspecialchars($disc['affiliate_promo']) ?><?= $affDiscPct ? ', ' . $affDiscPct : '' ?>)</td><td class="text-success">-<?= $currency . number_format($disc['affiliate'], 2) ?></td></tr>
            <?php elseif (($disc['promo'] ?? 0) > 0): ?>
            <tr><td colspan="3" class="text-end text-success">Discount (<?= htmlspecialchars($disc['promo_code']) ?>)</td><td class="text-success">-<?= $currency . number_format($disc['promo'], 2) ?></td></tr>
            <?php endif; ?>
            <?php if (($disc['wallet'] ?? 0) > 0): ?>
            <tr><td colspan="3" class="text-end text-success">Wallet payment discount<?= !empty($disc['wallet_percent']) ? ' (' . rtrim(rtrim(number_format((float)$disc['wallet_percent'], 2), '0'), '.') . '%)' : '' ?></td><td class="text-success">-<?= $currency . number_format($disc['wallet'], 2) ?></td></tr>
            <?php endif; ?>
            <tr><td colspan="3" class="text-end">Shipping</td><td><?= $currency . number_format($order['shipping'],2) ?></td></tr>
            <tr><td colspan="3" class="text-end">Tax</td><td><?= $currency . number_format($order['tax'],2) ?></td></tr>
            <tr><td colspan="3" class="text-end fw-bold fs-6">Total</td><td class="fw-bold fs-6"><?= $currency . number_format($order['total'],2) ?></td></tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Payment Info -->
    <?php if ($order['payment']): $pay = $order['payment']; ?>
    <div class="card sk-table-card shadow-sm">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Payment Details</div>
      <div class="card-body">
        <div class="row g-2">
          <div class="col-6"><small class="text-muted d-block">Razorpay Order ID</small><?= $pay['razorpay_order_id'] ?? '-' ?></div>
          <div class="col-6"><small class="text-muted d-block">Payment ID</small><?= $pay['razorpay_payment_id'] ?? '-' ?></div>
          <div class="col-6"><small class="text-muted d-block">Amount</small><?= $currency . number_format($pay['amount'],2) ?></div>
          <div class="col-6"><small class="text-muted d-block">Status</small>
            <span class="badge badge-<?= $pay['status'] ?>"><?= ucfirst($pay['status']) ?></span>
          </div>
        </div>
      </div>
    </div>
    <?php endif; ?>
  </div>

  <!-- Right column -->
  <div class="col-lg-4">

    <!-- Order Progress Stepper -->
    <?php
    $status_steps = [
      ['key' => 'pending',    'label' => 'Order Placed',     'icon' => 'bi-receipt',       'time' => $order['created_at'] ?? null],
      ['key' => 'confirmed',  'label' => 'Confirmed',        'icon' => 'bi-check2-circle', 'time' => $order['confirmed_at'] ?? null],
      ['key' => 'processing', 'label' => 'Ready to Pick Up', 'icon' => 'bi-box-seam',      'time' => $order['processing_at'] ?? $order['jt_shipment_created_at'] ?? null],
      ['key' => 'shipped',    'label' => 'Shipped',          'icon' => 'bi-truck',         'time' => $order['shipped_at'] ?? null],
      ['key' => 'delivered',  'label' => 'Delivered',        'icon' => 'bi-house-check',   'time' => $order['delivered_at'] ?? null],
    ];
    $step_keys   = array_column($status_steps, 'key');
    $current_idx = array_search($order['status'], $step_keys);
    $is_terminal = in_array($order['status'], ['cancelled', 'returned']);
    ?>
    <div class="card sk-table-card shadow-sm mb-3">
      <div class="card-header bg-white border-0 py-3 fw-semibold">
        <i class="bi bi-list-check me-2 text-warning"></i>Order Progress
      </div>
      <div class="card-body py-3">
        <?php if ($is_terminal): ?>
          <div class="d-flex align-items-center gap-2 p-2 rounded"
            style="background:<?= $order['status']==='cancelled'?'#fee2e2':'#ffedd5' ?>;color:<?= $order['status']==='cancelled'?'#991b1b':'#9a3412' ?>;">
            <i class="bi <?= $order['status']==='cancelled'?'bi-x-circle':'bi-arrow-counterclockwise' ?> fs-5"></i>
            <span class="fw-semibold"><?= $order['status']==='cancelled' ? 'Order Cancelled' : 'Return Requested' ?></span>
          </div>
        <?php else: ?>
          <div class="d-flex align-items-center w-100">
            <?php foreach ($status_steps as $i => $step):
              $done   = ($current_idx !== false) && $i < $current_idx;
              $active = ($current_idx !== false) && $i === $current_idx;
            ?>
              <div class="d-flex align-items-center <?= $i < count($status_steps) - 1 ? 'flex-grow-1' : '' ?>">
                <div class="text-center" style="min-width:54px;">
                  <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1"
                    style="width:38px;height:38px;
                      background:<?= ($done||$active) ? '#0f172a' : '#f1f5f9' ?>;
                      color:<?= ($done||$active) ? '#fff' : '#94a3b8' ?>;
                      border:<?= $active ? '3px solid #0f172a' : ('2px solid '.($done ? '#0f172a' : '#e2e8f0')) ?>;
                      <?= $active ? 'box-shadow:0 0 0 4px rgba(15,23,42,0.15);' : '' ?>
                      font-size:<?= $active ? '16px' : '13px' ?>;">
                    <i class="bi <?= $done ? 'bi-check-lg' : $step['icon'] ?>"></i>
                  </div>
                  <small style="display:block;font-size:10px;white-space:nowrap;color:<?= ($done||$active) ? '#0f172a' : '#94a3b8' ?>;font-weight:<?= ($done||$active) ? 600 : 400 ?>;">
                    <?= $step['label'] ?>
                  </small>
                  <?php if (!empty($step['time']) && ($done || $active)): ?>
                  <small style="display:block;font-size:9px;color:#64748b;margin-top:2px;"><?= sk_jt_format_datetime($step['time']) ?></small>
                  <?php endif; ?>
                </div>
                <?php if ($i < count($status_steps) - 1): ?>
                  <div class="flex-grow-1" style="height:2px;margin-bottom:20px;background:<?= $done ? '#0f172a' : '#e2e8f0' ?>;"></div>
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>

    <!-- Update Status -->
    <div class="card sk-table-card shadow-sm mb-3">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Update Status</div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Order Status</label>
          <select id="orderStatus" class="form-select">
            <?php foreach (['pending','confirmed','processing','shipped','delivered','cancelled','returned'] as $s): ?>
              <option value="<?= $s ?>" <?= $order['status']===$s?'selected':'' ?>><?= $s === 'processing' ? 'Ready to Pick Up (Processing)' : ucfirst($s) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Tracking Number</label>
          <input type="text" id="trackingNum" class="form-control" value="<?= htmlspecialchars($order['tracking_number'] ?? '') ?>">
        </div>
        <button onclick="updateStatus(<?= $order['id'] ?>)" class="btn btn-warning w-100 fw-semibold">
          Update Status
        </button>
      </div>
    </div>

    <?php if (!empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0'): ?>
    <!-- JT Express -->
    <div class="card sk-table-card shadow-sm mb-3 border-warning">
      <div class="card-header bg-white border-0 py-3 fw-semibold">
        <i class="bi bi-truck me-2 text-warning"></i>JT Express
        <?php if (sk_jt_express_is_sandbox($settings)): ?>
          <span class="badge bg-secondary ms-1">Sandbox</span>
        <?php endif; ?>
      </div>
      <div class="card-body">
        <?php $jtTracks = sk_jt_tracks_from_order($order); ?>
        <div class="small mb-3">
          <div><span class="text-muted">AWB:</span> <strong id="jtAwb"><?= htmlspecialchars($order['jt_bill_code'] ?? $order['tracking_number'] ?? '—') ?></strong></div>
          <div><span class="text-muted">Courier status:</span> <?= htmlspecialchars($order['jt_courier_status'] ?? 'not created') ?></div>
          <div><span class="text-muted">Ready to pick up:</span> <?= sk_jt_format_datetime($order['processing_at'] ?? $order['jt_shipment_created_at'] ?? null) ?></div>
          <?php if (!empty($order['confirmed_at'])): ?>
          <div><span class="text-muted">Confirmed:</span> <?= sk_jt_format_datetime($order['confirmed_at']) ?></div>
          <?php endif; ?>
          <?php if (!empty($order['jt_shipment_created_at'])): ?>
          <div><span class="text-muted">JT shipment created:</span> <?= sk_jt_format_datetime($order['jt_shipment_created_at']) ?></div>
          <?php endif; ?>
          <?php if (!empty($order['shipped_at'])): ?>
          <div><span class="text-muted">Shipped:</span> <?= sk_jt_format_datetime($order['shipped_at']) ?></div>
          <?php endif; ?>
          <?php if (!empty($order['delivered_at'])): ?>
          <div><span class="text-muted">Delivered:</span> <?= sk_jt_format_datetime($order['delivered_at']) ?></div>
          <?php endif; ?>
          <?php if (!empty($order['status_updated_at'])): ?>
          <div><span class="text-muted">Last status change:</span> <?= sk_jt_format_datetime($order['status_updated_at']) ?></div>
          <?php endif; ?>
        </div>
        <div class="d-grid gap-2">
          <?php if (empty($order['jt_bill_code'])): ?>
          <button type="button" class="btn btn-warning btn-sm fw-semibold" onclick="jtAction('create', <?= (int)$order['id'] ?>)">
            <i class="bi bi-box-seam me-1"></i> Create JT Shipment
          </button>
          <?php else: ?>
          <a href="<?= site_url('admin/orders/jt_print/'.$order['id']) ?>" target="_blank" class="btn btn-outline-dark btn-sm">
            <i class="bi bi-printer me-1"></i> Print Label
          </a>
          <button type="button" class="btn btn-outline-primary btn-sm" onclick="jtAction('track', <?= (int)$order['id'] ?>)">
            <i class="bi bi-geo-alt me-1"></i> Track Shipment
          </button>
          <?php if (($order['jt_courier_status'] ?? '') !== 'cancelled'): ?>
          <button type="button" class="btn btn-outline-danger btn-sm" onclick="jtAction('cancel', <?= (int)$order['id'] ?>)">
            <i class="bi bi-x-circle me-1"></i> Cancel JT Shipment
          </button>
          <?php endif; ?>
          <?php endif; ?>
        </div>
        <div id="jtTrackBox" class="mt-3 small <?= $jtTracks ? '' : 'd-none' ?>">
          <div class="fw-semibold mb-1">JT Express tracking events</div>
          <ul id="jtTrackList" class="list-unstyled mb-0">
            <?php foreach ($jtTracks as $ev): ?>
            <li class="border-bottom py-1"><?= htmlspecialchars(sk_jt_track_event_label($ev)) ?></li>
            <?php endforeach; ?>
          </ul>
        </div>
      </div>
    </div>
    <?php endif; ?>

    <?php if (!empty($order['affiliate_promo']) || !empty($affiliate)): ?>
    <div class="card sk-table-card shadow-sm mb-3 border-success">
      <div class="card-header bg-white border-0 py-3 fw-semibold">
        <i class="bi bi-link-45deg me-2 text-success"></i>Affiliate
      </div>
      <div class="card-body small">
        <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">Promo code</span>
          <code><?= htmlspecialchars($order['affiliate_promo'] ?? ($affiliate['promo_code'] ?? '')) ?></code>
        </div>
        <?php if (!empty($affiliate['name'])): ?>
        <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">Affiliate</span>
          <strong><?= htmlspecialchars($affiliate['name']) ?></strong>
        </div>
        <?php endif; ?>
        <?php if (!empty($affiliate['commission_rate'])): ?>
        <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">Commission rate</span>
          <strong><?= rtrim(rtrim(number_format((float)$affiliate['commission_rate'], 2), '0'), '.') ?>%</strong>
        </div>
        <?php endif; ?>
        <?php if (!empty($affiliate_commission['commission_amount'])): ?>
        <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">Commission earned</span>
          <strong class="text-success"><?= $currency . number_format((float)$affiliate_commission['commission_amount'], 2) ?></strong>
        </div>
        <?php if (!empty($affiliate_commission['order_total'])): ?>
        <div class="text-muted" style="font-size:11px;">On subtotal <?= $currency . number_format((float)$affiliate_commission['order_total'], 2) ?> (before discount/tax/shipping)</div>
        <?php endif; ?>
        <?php endif; ?>
      </div>
    </div>
    <?php endif; ?>

    <!-- Customer Info -->
    <div class="card sk-table-card shadow-sm mb-3">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Customer</div>
      <div class="card-body">
        <p class="mb-1 fw-semibold"><?= htmlspecialchars($order['customer_name'] ?? '-') ?></p>
        <p class="mb-1 text-muted small"><?= htmlspecialchars($order['customer_email'] ?? '-') ?></p>
        <?php if (!empty($order['invoice_emailed_at'])): ?>
        <p class="mb-0 small text-success"><i class="bi bi-check-circle me-1"></i>Invoice emailed: <?= date('d M Y, h:i A', strtotime($order['invoice_emailed_at'])) ?></p>
        <?php endif; ?>
      </div>
    </div>

    <!-- Shipping Address -->
    <div class="card sk-table-card shadow-sm">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Shipping Address</div>
      <div class="card-body small">
        <strong><?= htmlspecialchars($order['shipping_name'] ?? '') ?></strong><br>
        <?= htmlspecialchars($order['shipping_phone'] ?? '') ?><br>
        <?= htmlspecialchars($order['shipping_line1'] ?? '') ?><br>
        <?php if ($order['shipping_line2']): ?><?= htmlspecialchars($order['shipping_line2']) ?><br><?php endif; ?>
        <?= htmlspecialchars($order['shipping_city'] ?? '') ?>, <?= htmlspecialchars($order['shipping_state'] ?? '') ?> - <?= htmlspecialchars($order['shipping_pincode'] ?? '') ?><br>
        <?= htmlspecialchars($order['shipping_country'] ?? '') ?>
      </div>
    </div>
  </div>
</div>

<div id="statusToast" class="position-fixed bottom-0 end-0 p-3" style="z-index:9999">
  <div class="toast align-items-center text-bg-success border-0" role="alert" data-bs-autohide="true" data-bs-delay="2000">
    <div class="d-flex">
      <div class="toast-body fw-semibold"><i class="bi bi-check-circle me-2"></i>Order status updated!</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  </div>
</div>

<script>
function sendInvoice(orderId) {
  var btn = document.getElementById('btnSendInvoice');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Sending…'; }
  $.post('<?= site_url('admin/orders/send_invoice') ?>/' + orderId, {}, function(res) {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-envelope me-1"></i> Email Invoice'; }
    alert(res.message || (res.success ? 'Invoice sent.' : 'Failed to send invoice.'));
    if (res.success) location.reload();
  }, 'json').fail(function() {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-envelope me-1"></i> Email Invoice'; }
    alert('Network error. Please try again.');
  });
}
function updateStatus(orderId) {
  var btn      = document.querySelector('[onclick="updateStatus(' + orderId + ')"]');
  var status   = document.getElementById('orderStatus').value;
  var tracking = document.getElementById('trackingNum').value;
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  $.post('<?= site_url('admin/orders/update_status') ?>/' + orderId, {
    status: status, tracking_number: tracking
  }, function(res) {
    if (res.success) {
      var toastBody = document.querySelector('#statusToast .toast-body');
      if (toastBody) {
        toastBody.innerHTML = '<i class="bi bi-check-circle me-2"></i>' + (res.message || 'Order status updated!');
      }
      var toast = new bootstrap.Toast(document.querySelector('#statusToast .toast'));
      toast.show();
      setTimeout(function() { location.reload(); }, 1800);
    } else {
      if (btn) { btn.disabled = false; btn.textContent = 'Update Status'; }
      alert(res.message || 'Failed to update status.');
    }
  }, 'json').fail(function() {
    if (btn) { btn.disabled = false; btn.textContent = 'Update Status'; }
    alert('Network error. Please try again.');
  });
}
function jtAction(action, orderId) {
  var urls = {
    create: '<?= site_url('admin/orders/jt_create') ?>/' + orderId,
    track:  '<?= site_url('admin/orders/jt_track') ?>/' + orderId,
    cancel: '<?= site_url('admin/orders/jt_cancel') ?>/' + orderId
  };
  if (action === 'cancel' && !confirm('Cancel this JT Express shipment?')) return;
  var payload = {};
  if (action === 'cancel') payload.reason = 'Cancelled from admin panel';
  $.post(urls[action], payload, function(res) {
    if (action === 'track' && res.success && res.tracks && res.tracks.length) {
      var box = document.getElementById('jtTrackBox');
      var list = document.getElementById('jtTrackList');
      list.innerHTML = '';
      res.tracks.forEach(function(ev) {
        var li = document.createElement('li');
        li.className = 'border-bottom py-1';
        var time = ev.scanTime || ev.time || ev.acceptTime || '';
        var desc = ev.desc || ev.remark || ev.scanType || JSON.stringify(ev);
        li.textContent = (time ? time + ' — ' : '') + desc;
        list.appendChild(li);
      });
      box.classList.remove('d-none');
      setTimeout(function() { location.reload(); }, 1500);
      return;
    }
    alert(res.message || (res.success ? 'Done.' : 'Request failed.'));
    if (res.success && action !== 'track') location.reload();
  }, 'json').fail(function() { alert('Network error.'); });
}
</script>
