<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-diagram-3 me-2 text-warning"></i>Categories</h5>
</div>

<div id="alertBox"></div>

<ul class="nav nav-tabs mb-3">
    <li class="nav-item"><a class="nav-link active" href="#catTab" data-bs-toggle="tab"><i class="bi bi-folder me-1"></i>Categories <span class="badge bg-warning text-dark ms-1"><?= count($categories) ?></span></a></li>
    <li class="nav-item"><a class="nav-link" href="#subTab" data-bs-toggle="tab"><i class="bi bi-folder2-open me-1"></i>Subcategories <span class="badge bg-secondary ms-1"><?= count($subcategories) ?></span></a></li>
    <li class="nav-item"><a class="nav-link" href="#titleTab" data-bs-toggle="tab"><i class="bi bi-list-task me-1"></i>Mega Menu Titles <span class="badge bg-info ms-1"><?= count($mega_menu_titles) ?></span></a></li>
  </ul>

<div class="tab-content">

  <!-- ── Categories Tab ── -->
  <div class="tab-pane fade show active" id="catTab">
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-warning btn-sm" onclick="openCat()" data-bs-toggle="modal" data-bs-target="#catModal">
        <i class="bi bi-plus-lg me-1"></i> Add Category
      </button>
    </div>
    <div class="card sk-table-card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
          <thead class="sk-table-head">
            <tr><th>#</th><th>Image</th><th>Nav Image</th><th>Name</th><th>Slug</th><th>Products</th><th>Status</th><th class="text-end">Actions</th></tr>
          </thead>
          <tbody>
            <?php foreach ($categories as $i => $c): ?>
            <tr id="cat-row-<?= $c['id'] ?>">
              <td class="text-muted small"><?= $i+1 ?></td>
              <td>
                <?php if ($c['image']): ?>
                  <img src="<?= base_url($c['image']) ?>" width="40" height="40" class="rounded" style="object-fit:cover;">
                <?php else: ?>
                  <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width:40px;height:40px;"><i class="bi bi-folder text-muted"></i></div>
                <?php endif; ?>
              </td>
              <td>
                <?php if (!empty($c['nav_image'])): ?>
                  <img src="<?= base_url($c['nav_image']) ?>" width="40" height="40" class="rounded border" style="object-fit:cover;" title="Navbar image">
                <?php else: ?>
                  <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width:40px;height:40px;" title="No navbar image"><i class="bi bi-image text-muted" style="font-size:.8rem;"></i></div>
                <?php endif; ?>
              </td>
              <td class="fw-semibold"><?= htmlspecialchars($c['name']) ?></td>
              <td><code class="small"><?= $c['slug'] ?></code></td>
              <td class="text-center"><?= $this->db->where('category_id',$c['id'])->count_all_results('products') ?></td>
              <td><span class="badge <?= $c['status']?'bg-success':'bg-secondary' ?>"><?= $c['status']?'Active':'Inactive' ?></span></td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditCat(<?= json_encode($c) ?>)' data-bs-toggle="modal" data-bs-target="#catModal"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="delCat(<?= $c['id'] ?>,'<?= htmlspecialchars($c['name']) ?>')"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ── Subcategories Tab ── -->
  <div class="tab-pane fade" id="subTab">
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-warning btn-sm" onclick="openSub()" data-bs-toggle="modal" data-bs-target="#subModal">
        <i class="bi bi-plus-lg me-1"></i> Add Subcategory
      </button>
    </div>
    <div class="card sk-table-card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
            <tr><th>#</th><th>Image</th><th>Subcategory</th><th>Parent Category</th><th>Menu Title</th><th>Slug</th><th>Status</th><th class="text-end">Actions</th></tr>
          </thead>
          <tbody>
            <?php
            // Build category lookup
            $catMap = [];
            foreach ($categories as $c) $catMap[$c['id']] = $c['name'];
            // Build title lookup
            $titleMap = [];
            foreach ($mega_menu_titles as $t) $titleMap[$t['id']] = $t['title'];
            foreach ($subcategories as $i => $s):
            ?>
            <tr id="sub-row-<?= $s['id'] ?>">
              <td class="text-muted small"><?= $i+1 ?></td>
              <td>
                <?php if ($s['image']): ?>
                  <img src="<?= base_url($s['image']) ?>" width="40" height="40" class="rounded" style="object-fit:cover;">
                <?php else: ?>
                  <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width:40px;height:40px;"><i class="bi bi-folder2 text-muted"></i></div>
                <?php endif; ?>
              </td>
              <td class="fw-semibold"><?= htmlspecialchars($s['name']) ?></td>
              <td><span class="badge bg-warning text-dark"><?= htmlspecialchars($catMap[$s['category_id']] ?? '—') ?></span></td>
              <td><span class="badge bg-info-subtle text-info-emphasis border border-info-subtle"><?= htmlspecialchars($titleMap[$s['mega_menu_title_id']] ?? '—') ?></span></td>
              <td><code class="small"><?= $s['slug'] ?></code></td>
              <td><span class="badge <?= $s['status']?'bg-success':'bg-secondary' ?>"><?= $s['status']?'Active':'Inactive' ?></span></td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditSub(<?= json_encode($s) ?>)' data-bs-toggle="modal" data-bs-target="#subModal"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="delSub(<?= $s['id'] ?>,'<?= htmlspecialchars($s['name']) ?>')"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ── Mega Menu Titles Tab ── -->
  <div class="tab-pane fade" id="titleTab">
    <div class="d-flex justify-content-end mb-2">
      <button class="btn btn-warning btn-sm" onclick="openTitle()" data-bs-toggle="modal" data-bs-target="#titleModal">
        <i class="bi bi-plus-lg me-1"></i> Add Menu Title
      </button>
    </div>
    <div class="card sk-table-card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
          <thead class="sk-table-head">
            <tr><th>#</th><th>Title</th><th>Sort Order</th><th class="text-end">Actions</th></tr>
          </thead>
          <tbody>
            <?php foreach ($mega_menu_titles as $i => $t): ?>
            <tr id="title-row-<?= $t['id'] ?>">
              <td class="text-muted small"><?= $i+1 ?></td>
              <td class="fw-semibold"><?= htmlspecialchars($t['title']) ?></td>
              <td><?= $t['sort_order'] ?></td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditTitle(<?= json_encode($t) ?>)' data-bs-toggle="modal" data-bs-target="#titleModal"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="delTitle(<?= $t['id'] ?>,'<?= htmlspecialchars($t['title']) ?>')"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</div>

<!-- ── Category Modal ── -->
<div class="modal fade" id="catModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header border-0">
        <h5 class="modal-title fw-semibold" id="catModalTitle">Add Category</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="catForm" enctype="multipart/form-data">
          <input type="hidden" id="catId">
          <div class="mb-3">
            <label class="form-label fw-medium">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="catName" name="name" required>
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium">Description</label>
            <textarea class="form-control" name="description" id="catDesc" rows="2"></textarea>
          </div>
          <div class="row g-2 mb-3">
            <div class="col">
              <label class="form-label fw-medium">Sort Order</label>
              <input type="number" class="form-control" name="sort_order" id="catOrder" value="0">
            </div>
            <div class="col">
              <label class="form-label fw-medium">Status</label>
              <select class="form-select" name="status" id="catStatus">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium">Category Image <small class="text-muted">(banner / page header)</small></label>
            <input type="file" class="form-control" name="image" accept="image/*" onchange="prevImg(this,'catPrev')">
            <div id="catPrev" class="mt-2"></div>
          </div>

          <!-- ── Navbar Products ── -->
          <div class="mb-2">
            <label class="form-label fw-medium">
              Navbar Products
              <small class="text-muted fw-normal">— select products shown as cards in the nav dropdown</small>
            </label>

            <!-- Search box -->
            <input type="text" class="form-control form-control-sm mb-2" id="navProdSearch"
                   placeholder="Search product…" oninput="filterNavProducts()">

            <!-- Scrollable checklist -->
            <div id="navProdList"
                 style="max-height:220px;overflow-y:auto;border:1px solid #dee2e6;border-radius:6px;padding:8px;">
              <?php foreach ($all_products as $p): ?>
              <div class="form-check nav-prod-item mb-1"
                   data-name="<?= strtolower(htmlspecialchars($p['name'])) ?>">
                <input class="form-check-input nav-prod-cb" type="checkbox"
                       name="nav_product_ids[]"
                       value="<?= $p['id'] ?>"
                       id="np_<?= $p['id'] ?>">
                <label class="form-check-label small" for="np_<?= $p['id'] ?>">
                  <?= htmlspecialchars($p['name']) ?>
                </label>
              </div>
              <?php endforeach; ?>
            </div>
            <small class="text-muted">Max 4 products recommended for best display.</small>
          </div>
        </form>
      </div>
      <div class="modal-footer border-0">
        <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-warning" onclick="saveCat()">
          <span id="catSpin" class="spinner-border spinner-border-sm d-none me-1"></span>Save
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ── Subcategory Modal ── -->
<div class="modal fade" id="subModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header border-0"><h5 class="modal-title fw-semibold" id="subModalTitle">Add Subcategory</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
      <div class="modal-body">
        <form id="subForm" enctype="multipart/form-data">
          <input type="hidden" id="subId">
          <div class="mb-3">
            <label class="form-label fw-medium">Parent Category <span class="text-danger">*</span></label>
            <select class="form-select" name="category_id" id="subParent" required>
              <option value="">— Select Category —</option>
              <?php foreach ($categories as $c): ?>
                <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['name']) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="mb-3"><label class="form-label fw-medium">Name <span class="text-danger">*</span></label><input type="text" class="form-control" id="subName" name="name" required></div>
          <div class="mb-3">
            <label class="form-label fw-medium">Mega Menu Column Title</label>
            <select class="form-select" id="subMegaTitleId" name="mega_menu_title_id">
              <option value="">— Select Column Title —</option>
              <?php foreach ($mega_menu_titles as $t): ?>
                <option value="<?= $t['id'] ?>"><?= htmlspecialchars($t['title']) ?></option>
              <?php endforeach; ?>
            </select>
            <div class="form-text small">Standardize column headers in the mega menu.</div>
          </div>
          <div class="mb-3"><label class="form-label fw-medium">Description</label><textarea class="form-control" name="description" id="subDesc" rows="2"></textarea></div>
          <div class="row g-2 mb-3">
            <div class="col"><label class="form-label fw-medium">Sort Order</label><input type="number" class="form-control" name="sort_order" id="subOrder" value="0"></div>
            <div class="col"><label class="form-label fw-medium">Status</label><select class="form-select" name="status" id="subStatus"><option value="1">Active</option><option value="0">Inactive</option></select></div>
          </div>
          <div class="mb-3"><label class="form-label fw-medium">Image</label><input type="file" class="form-control" name="image" accept="image/*" onchange="prevImg(this,'subPrev')"><div id="subPrev" class="mt-2"></div></div>
        </form>
      </div>
      <div class="modal-footer border-0"><button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-warning" onclick="saveSub()"><span id="subSpin" class="spinner-border spinner-border-sm d-none me-1"></span>Save</button></div>
    </div>
  </div>
</div>

<!-- ── Mega Menu Title Modal ── -->
<div class="modal fade" id="titleModal" tabindex="-1">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header border-0"><h5 class="modal-title fw-semibold" id="titleModalTitle">Add Menu Title</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
      <div class="modal-body">
        <form id="titleForm">
          <input type="hidden" id="titleId">
          <div class="mb-3"><label class="form-label fw-medium">Title <span class="text-danger">*</span></label><input type="text" class="form-control" id="titleName" name="title" required placeholder="e.g. Popular"></div>
          <div class="mb-3"><label class="form-label fw-medium">Sort Order</label><input type="number" class="form-control" name="sort_order" id="titleOrder" value="0"></div>
        </form>
      </div>
      <div class="modal-footer border-0"><button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-warning" onclick="saveTitle()"><span id="titleSpin" class="spinner-border spinner-border-sm d-none me-1"></span>Save</button></div>
    </div>
  </div>
</div>

<script>
function showAlert(msg,type='success'){document.getElementById('alertBox').innerHTML=`<div class="alert alert-${type} alert-dismissible fade show mt-2">${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;}
function prevImg(input,id){if(input.files&&input.files[0]){const r=new FileReader();r.onload=e=>document.getElementById(id).innerHTML=`<img src="${e.target.result}" style="max-height:80px;border-radius:5px;">`;r.readAsDataURL(input.files[0]);}}

// ── Category ──────────────────────────────────────────────────
function uncheckAllNavProds() {
  document.querySelectorAll('.nav-prod-cb').forEach(cb => cb.checked = false);
}

function openCat() {
  document.getElementById('catModalTitle').textContent = 'Add Category';
  document.getElementById('catForm').reset();
  document.getElementById('catId').value = '';
  document.getElementById('catPrev').innerHTML = '';
  document.getElementById('navProdSearch').value = '';
  uncheckAllNavProds();
  filterNavProducts();
}

function openEditCat(c) {
  document.getElementById('catModalTitle').textContent = 'Edit Category';
  document.getElementById('catId').value     = c.id;
  document.getElementById('catName').value   = c.name;
  document.getElementById('catDesc').value   = c.description || '';
  document.getElementById('catOrder').value  = c.sort_order || 0;
  document.getElementById('catStatus').value = c.status;
  document.getElementById('catPrev').innerHTML = c.image
    ? `<img src="<?= base_url() ?>${c.image}" style="max-height:60px;border-radius:5px;">` : '';
  document.getElementById('navProdSearch').value = '';
  uncheckAllNavProds();
  filterNavProducts();

  // Pre-check products already saved for this category
  fetch(`<?= base_url('admin/categories/edit') ?>/${c.id}`)
    .then(r => r.json())
    .then(res => {
      (res.selected_product_ids || []).forEach(pid => {
        const cb = document.getElementById('np_' + pid);
        if (cb) cb.checked = true;
      });
    });

  new bootstrap.Modal(document.getElementById('catModal')).show();
}

function filterNavProducts() {
  const q = (document.getElementById('navProdSearch')?.value || '').toLowerCase();
  document.querySelectorAll('.nav-prod-item').forEach(el => {
    el.style.display = el.dataset.name.includes(q) ? '' : 'none';
  });
}
function saveCat(){
  const form=document.getElementById('catForm');if(!form.checkValidity()){form.reportValidity();return;}
  const id=document.getElementById('catId').value;
  const fd=new FormData(form);
  const url=id?`<?= base_url('admin/categories/update') ?>/${id}`:'<?= base_url('admin/categories/store') ?>';
  const spin=document.getElementById('catSpin');spin.classList.remove('d-none');
  fetch(url,{method:'POST',body:fd}).then(r=>r.json()).then(res=>{spin.classList.add('d-none');if(res.success){bootstrap.Modal.getInstance(document.getElementById('catModal')).hide();showAlert(id?'Category updated.':'Category added.');setTimeout(()=>location.reload(),700);}else showAlert(res.message||'Error','danger');}).catch(()=>{spin.classList.add('d-none');showAlert('Network error','danger');});
}
function delCat(id,name){if(!confirm(`Delete category "${name}"? Its subcategories will also be deleted.`))return;fetch(`<?= base_url('admin/categories/delete') ?>/${id}`,{method:'POST'}).then(r=>r.json()).then(res=>{if(res.success){document.getElementById('cat-row-'+id)?.remove();showAlert('Deleted.');}});}

// ── Subcategory ───────────────────────────────────────────────
function openSub(){document.getElementById('subModalTitle').textContent='Add Subcategory';document.getElementById('subForm').reset();document.getElementById('subId').value='';document.getElementById('subMegaTitleId').value='';document.getElementById('subPrev').innerHTML='';}
function openEditSub(s){document.getElementById('subModalTitle').textContent='Edit Subcategory';document.getElementById('subId').value=s.id;document.getElementById('subParent').value=s.category_id;document.getElementById('subName').value=s.name;document.getElementById('subMegaTitleId').value=s.mega_menu_title_id||'';document.getElementById('subDesc').value=s.description||'';document.getElementById('subOrder').value=s.sort_order||0;document.getElementById('subStatus').value=s.status;document.getElementById('subPrev').innerHTML=s.image?`<img src="<?= base_url() ?>${s.image}" style="max-height:60px;border-radius:5px;">`:'';new bootstrap.Modal(document.getElementById('subModal')).show();}
function saveSub(){
  const form=document.getElementById('subForm');if(!form.checkValidity()){form.reportValidity();return;}
  const id=document.getElementById('subId').value;
  const fd=new FormData(form);
  const url=id?`<?= base_url('admin/subcategories/update') ?>/${id}`:'<?= base_url('admin/subcategories/store') ?>';
  const spin=document.getElementById('subSpin');spin.classList.remove('d-none');
  fetch(url,{method:'POST',body:fd}).then(r=>r.json()).then(res=>{spin.classList.add('d-none');if(res.success){bootstrap.Modal.getInstance(document.getElementById('subModal')).hide();showAlert(id?'Subcategory updated.':'Subcategory added.');setTimeout(()=>location.reload(),700);}else showAlert(res.message||'Error','danger');}).catch(()=>{spin.classList.add('d-none');showAlert('Network error','danger');});
}
function delSub(id,name){if(!confirm(`Delete subcategory "${name}"?`))return;fetch(`<?= base_url('admin/subcategories/delete') ?>/${id}`,{method:'POST'}).then(r=>r.json()).then(res=>{if(res.success){document.getElementById('sub-row-'+id)?.remove();showAlert('Deleted.');}});}

// ── Mega Menu Title ───────────────────────────────────────────
function openTitle(){document.getElementById('titleModalTitle').textContent='Add Title';document.getElementById('titleForm').reset();document.getElementById('titleId').value='';}
function openEditTitle(t){document.getElementById('titleModalTitle').textContent='Edit Title';document.getElementById('titleId').value=t.id;document.getElementById('titleName').value=t.title;document.getElementById('titleOrder').value=t.sort_order||0;new bootstrap.Modal(document.getElementById('titleModal')).show();}
function saveTitle(){
  const form=document.getElementById('titleForm');if(!form.checkValidity()){form.reportValidity();return;}
  const id=document.getElementById('titleId').value;
  const fd=new FormData(form);
  const url=id?`<?= base_url('admin/categories/title_update') ?>/${id}`:'<?= base_url('admin/categories/title_store') ?>';
  const spin=document.getElementById('titleSpin');spin.classList.remove('d-none');
  fetch(url,{method:'POST',body:fd}).then(r=>r.json()).then(res=>{spin.classList.add('d-none');if(res.success){bootstrap.Modal.getInstance(document.getElementById('titleModal')).hide();showAlert(id?'Title updated.':'Title added.');setTimeout(()=>location.reload(),700);}else showAlert(res.message||'Error','danger');}).catch(()=>{spin.classList.add('d-none');showAlert('Network error','danger');});
}
function delTitle(id,name){if(!confirm(`Delete title "${name}"?`))return;fetch(`<?= base_url('admin/categories/title_delete') ?>/${id}`,{method:'POST'}).then(r=>r.json()).then(res=>{if(res.success){document.getElementById('title-row-'+id)?.remove();showAlert('Deleted.');}});}
</script>
