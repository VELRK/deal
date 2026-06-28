<?php

$currency = $settings['currency_symbol'] ?? '₹';

$st = $stats;

$is_vendor = !empty($is_vendor_scope);

$tab = $tab ?? 'dashboard';

$qs = 'from=' . urlencode($from) . '&to=' . urlencode($to);

$daily_checkouts = $daily_checkouts ?? $daily_clicks ?? [];

?>

<div class="sk-page-header d-flex flex-wrap align-items-center justify-content-between gap-2">

  <div>

    <h5 class="sk-page-title mb-1"><i class="bi bi-graph-up me-2 text-success"></i><?= $is_vendor ? 'Affiliate Performance Reports' : 'Affiliate Analytics' ?></h5>

    <?php if ($is_vendor): ?><small class="text-muted">Promo code checkout performance for your affiliates</small><?php else: ?><small class="text-muted">Metrics based on affiliate promo codes used at checkout</small><?php endif; ?>

  </div>

  <div class="d-flex gap-2 flex-wrap">

    <a href="<?= site_url('admin/affiliate-reports/export?type=commissions&'.$qs) ?>" class="btn btn-outline-secondary btn-sm">Export Commissions</a>

    <a href="<?= site_url('admin/affiliate-reports/export?type=sales&'.$qs) ?>" class="btn btn-outline-secondary btn-sm">Export Sales</a>

    <a href="<?= site_url('admin/affiliate-reports/export?type=conversions&'.$qs) ?>" class="btn btn-outline-secondary btn-sm">Export Checkouts</a>

    <a href="<?= site_url('admin/affiliate-reports/export?type=checkouts&'.$qs) ?>" class="btn btn-outline-secondary btn-sm">Export Daily Checkouts</a>

  </div>

</div>



<form method="get" class="row g-2 mb-3 align-items-end">

  <input type="hidden" name="tab" value="<?= htmlspecialchars($tab) ?>">

  <div class="col-md-3"><label class="form-label small">From</label><input type="date" name="from" class="form-control form-control-sm" value="<?= $from ?>"></div>

  <div class="col-md-3"><label class="form-label small">To</label><input type="date" name="to" class="form-control form-control-sm" value="<?= $to ?>"></div>

  <div class="col-md-2"><button class="btn btn-sm btn-dark w-100">Apply</button></div>

</form>



<ul class="nav nav-tabs mb-3">

  <li class="nav-item"><a class="nav-link <?= $tab==='dashboard'?'active':'' ?>" href="?tab=dashboard&<?= $qs ?>">Dashboard</a></li>

  <li class="nav-item"><a class="nav-link <?= $tab==='sales'?'active':'' ?>" href="?tab=sales&<?= $qs ?>">Sales</a></li>

  <li class="nav-item"><a class="nav-link <?= $tab==='commissions'?'active':'' ?>" href="?tab=commissions&<?= $qs ?>">Commissions</a></li>

  <li class="nav-item"><a class="nav-link <?= $tab==='conversions'?'active':'' ?>" href="?tab=conversions&<?= $qs ?>">Checkouts</a></li>

</ul>



<?php if ($tab === 'dashboard'): ?>

<div class="row g-3 mb-4">

  <div class="col-md-3"><div class="card p-3 text-center"><div class="text-muted small">Checkout Orders</div><div class="fs-4 fw-bold"><?= number_format($st['checkout_orders'] ?? $st['conversions'] ?? 0) ?></div></div></div>

  <div class="col-md-3"><div class="card p-3 text-center"><div class="text-muted small">Sales Amount</div><div class="fs-5 fw-bold"><?= $currency . number_format($st['sales_amount']??0,0) ?></div></div></div>

  <div class="col-md-3"><div class="card p-3 text-center"><div class="text-muted small">Commission</div><div class="fs-5 fw-bold"><?= $currency . number_format($st['commission_earned']??0,0) ?></div></div></div>

  <div class="col-md-3"><div class="card p-3 text-center"><div class="text-muted small">Affiliates</div><div class="fs-5 fw-bold"><?= number_format($st['approved_affiliates']??0) ?> / <?= number_format($st['total_affiliates']??0) ?></div></div></div>

  <div class="col-md-3"><div class="card p-3 text-center"><div class="text-muted small">Paid Out</div><div class="fs-5 fw-bold text-success"><?= $currency . number_format($st['payouts_paid']??0,0) ?></div></div></div>

</div>



<div class="row g-3">

  <div class="col-lg-7">

    <div class="card shadow-sm">

      <div class="card-header fw-semibold">Top Affiliates</div>

      <div class="card-body p-0">

        <table class="table table-sm mb-0">

          <thead><tr><th>Name</th><th>Promo</th><th>Checkout Orders</th><th>Commission</th><th>Pending</th></tr></thead>

          <tbody>

            <?php foreach ($top_affiliates as $a): ?>

            <tr>

              <td><a href="<?= site_url('admin/affiliates/view/'.$a['id']) ?>"><?= htmlspecialchars($a['name']) ?></a></td>

              <td><code><?= htmlspecialchars($a['promo_code']) ?></code></td>

              <td><?= number_format($a['total_sales']) ?></td>

              <td><?= $currency . number_format($a['total_commission'],0) ?></td>

              <td><?= $currency . number_format($a['pending_commission'],0) ?></td>

            </tr>

            <?php endforeach; ?>

            <?php if (empty($top_affiliates)): ?><tr><td colspan="5" class="text-muted text-center py-3">No affiliates yet</td></tr><?php endif; ?>

          </tbody>

        </table>

      </div>

    </div>

  </div>

  <div class="col-lg-5">

    <div class="card shadow-sm">

      <div class="card-header fw-semibold">Daily Checkout Orders</div>

      <div class="card-body p-0" style="max-height:320px;overflow:auto;">

        <table class="table table-sm mb-0">

          <thead><tr><th>Date</th><th>Orders</th></tr></thead>

          <tbody>

            <?php foreach ($daily_checkouts as $d): ?>

            <tr><td><?= date('d M Y', strtotime($d['d'])) ?></td><td><?= number_format($d['cnt']) ?></td></tr>

            <?php endforeach; ?>

            <?php if (empty($daily_checkouts)): ?><tr><td colspan="2" class="text-muted text-center py-3">No checkout data in this period</td></tr><?php endif; ?>

          </tbody>

        </table>

      </div>

    </div>

  </div>

</div>



<?php elseif ($tab === 'sales'): ?>

<div class="card shadow-sm">

  <div class="card-header fw-semibold">Sales Report (Promo Checkout)</div>

  <div class="card-body p-0">

    <table class="table table-sm table-hover mb-0">

      <thead><tr><th>Date</th><th>Order</th><th>Affiliate</th><th>Promo</th><th>Order Total</th><th>Commission</th><th>Status</th></tr></thead>

      <tbody>

        <?php foreach ($sales_rows as $r): ?>

        <tr>

          <td><?= date('d M Y', strtotime($r['created_at'])) ?></td>

          <td>#<?= (int)$r['order_id'] ?></td>

          <td><?= htmlspecialchars($r['affiliate_name']) ?></td>

          <td><code><?= htmlspecialchars($r['promo_code']) ?></code></td>

          <td><?= $currency . number_format($r['order_total'], 2) ?></td>

          <td><?= $currency . number_format($r['commission_amount'], 2) ?></td>

          <td><?= ucfirst($r['status']) ?></td>

        </tr>

        <?php endforeach; ?>

        <?php if (empty($sales_rows)): ?><tr><td colspan="7" class="text-muted text-center py-4">No promo checkout sales in this period.</td></tr><?php endif; ?>

      </tbody>

    </table>

  </div>

</div>



<?php elseif ($tab === 'commissions'): ?>

<div class="card shadow-sm">

  <div class="card-header fw-semibold">Commission Report</div>

  <div class="card-body p-0">

    <table class="table table-sm table-hover mb-0">

      <thead><tr><th>Date</th><th>Order</th><th>Affiliate</th><th>Promo</th><th>Rate</th><th>Order Total</th><th>Commission</th><th>Status</th></tr></thead>

      <tbody>

        <?php foreach ($commission_rows as $r): ?>

        <tr>

          <td><?= date('d M Y', strtotime($r['created_at'])) ?></td>

          <td>#<?= (int)$r['order_id'] ?></td>

          <td><?= htmlspecialchars($r['affiliate_name']) ?></td>

          <td><code><?= htmlspecialchars($r['promo_code']) ?></code></td>

          <td><?= number_format((float)$r['commission_rate'], 1) ?>%</td>

          <td><?= $currency . number_format($r['order_total'], 2) ?></td>

          <td><?= $currency . number_format($r['commission_amount'], 2) ?></td>

          <td><?= ucfirst($r['status']) ?></td>

        </tr>

        <?php endforeach; ?>

        <?php if (empty($commission_rows)): ?><tr><td colspan="8" class="text-muted text-center py-4">No commissions in this period.</td></tr><?php endif; ?>

      </tbody>

    </table>

  </div>

</div>



<?php else: ?>

<div class="card shadow-sm">

  <div class="card-header fw-semibold">Promo Checkout Report</div>

  <div class="card-body p-0">

    <table class="table table-sm table-hover mb-0">

      <thead><tr><th>Affiliate</th><th>Promo</th><th>Period Orders</th><th>Period Sales</th><th>Lifetime Orders</th></tr></thead>

      <tbody>

        <?php foreach ($conversion_rows as $r): ?>

        <tr>

          <td><a href="<?= site_url('admin/affiliates/view/'.$r['id']) ?>"><?= htmlspecialchars($r['name']) ?></a></td>

          <td><code><?= htmlspecialchars($r['promo_code']) ?></code></td>

          <td><?= number_format($r['period_checkouts'] ?? $r['period_sales'] ?? 0) ?></td>

          <td><?= $currency . number_format($r['period_sales_amount'] ?? 0, 0) ?></td>

          <td><?= number_format($r['total_sales']) ?></td>

        </tr>

        <?php endforeach; ?>

        <?php if (empty($conversion_rows)): ?><tr><td colspan="5" class="text-muted text-center py-4">No promo checkout data.</td></tr><?php endif; ?>

      </tbody>

    </table>

  </div>

</div>

<?php endif; ?>

