<?php
$pages = (int)ceil(($total ?? 0) / max(1, (int)($limit ?? 15)));
$page = (int)($page ?? 1);
$limit = (int)($limit ?? 15);
$total = (int)($total ?? 0);
if ($pages <= 1 && $total <= $limit):
?>
<div class="card-footer bg-white d-flex justify-content-between align-items-center">
  <small class="text-muted"><?= $total > 0 ? ('Showing 1–' . $total . ' of ' . $total) : 'No products' ?></small>
</div>
<?php return; endif; ?>
<div class="card-footer bg-white d-flex justify-content-between align-items-center">
  <small class="text-muted">Showing <?= ($page - 1) * $limit + 1 ?>–<?= min($page * $limit, $total) ?> of <?= $total ?></small>
  <nav>
    <ul class="pagination pagination-sm mb-0" id="productListPagination">
      <?php for ($i = 1; $i <= $pages; $i++): ?>
        <li class="page-item <?= $i === $page ? 'active' : '' ?>">
          <a class="page-link sk-product-page-link" href="#" data-page="<?= $i ?>"><?= $i ?></a>
        </li>
      <?php endfor; ?>
    </ul>
  </nav>
</div>
