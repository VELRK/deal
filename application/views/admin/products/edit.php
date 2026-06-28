<?php
function opt_e($list, $selected) {
    $out = '';
    foreach ($list as $v) {
        $label = is_array($v) ? htmlspecialchars($v['name'] . ($v['state'] ? ' (' . $v['state'] . ')' : '')) : htmlspecialchars($v);
        $value = is_array($v) ? htmlspecialchars($v['name']) : htmlspecialchars($v);
        $sel   = $value === htmlspecialchars($selected ?? '') ? 'selected' : '';
        $out  .= "<option value=\"$value\" $sel>$label</option>";
    }
    return $out;
}
$p = $product; // shorthand
$saleStartLocal = !empty($p['sale_start_at']) ? date('Y-m-d\TH:i', strtotime($p['sale_start_at'])) : '';
$saleEndLocal = !empty($p['sale_end_at']) ? date('Y-m-d\TH:i', strtotime($p['sale_end_at'])) : '';
?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-pencil me-2 text-warning"></i>Edit: <?= htmlspecialchars($p['name']) ?></h5>
  <a href="<?= site_url('admin/products') ?>" class="btn btn-sm btn-outline-secondary">
    <i class="bi bi-arrow-left me-1"></i> Back
  </a>
</div>

<form action="<?= site_url('admin/products/update/'.$p['id']) ?>" method="POST" enctype="multipart/form-data">

  <div class="row g-3">

    <!-- ── LEFT COLUMN ─────────────────────────────────────── -->
    <div class="col-lg-8">

      <!-- Basic Info -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">
          <i class="bi bi-info-circle me-1 text-warning"></i> Basic Information
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Product Name <span class="text-danger">*</span></label>
            <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($p['name']) ?>" required>
          </div>
          <div class="row g-2">
            <div class="col-md-4">
              <label class="form-label">SKU</label>
              <input type="text" name="sku" class="form-control" value="<?= htmlspecialchars($p['sku'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Category <span class="text-danger">*</span></label>
              <select name="category_id" class="form-select" required>
                <?php foreach ($categories as $c): ?>
                  <option value="<?= $c['id'] ?>" <?= $c['id']==$p['category_id']?'selected':'' ?>>
                    <?= htmlspecialchars($c['name']) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Brand</label>
              <select name="brand_id" class="form-select">
                <option value="">No Brand</option>
                <?php foreach ($brands as $b): ?>
                  <option value="<?= $b['id'] ?>" <?= $b['id']==$p['brand_id']?'selected':'' ?>>
                    <?= htmlspecialchars($b['name']) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
          <div class="row g-2 mt-1" id="subcategory-row" <?= empty($subcategories) ? 'style="display:none;"' : '' ?>>
            <div class="col-md-4">
              <label class="form-label">Sub Category</label>
              <select name="subcategory_id" id="subcategory_id" class="form-select">
                <option value="">-- Select Sub Category --</option>
                <?php foreach ($subcategories as $sub): ?>
                  <option value="<?= $sub['id'] ?>" <?= $sub['id'] == ($p['subcategory_id'] ?? '') ? 'selected' : '' ?>>
                    <?= htmlspecialchars($sub['name']) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label">Subtitle</label>
            <input type="text" name="subtitle" class="form-control" value="<?= htmlspecialchars($p['subtitle'] ?? '') ?>">
          </div>
          <div class="mt-3">
            <label class="form-label">Short Description</label>
            <div id="quill-short-desc"></div>
            <input type="hidden" name="short_desc" value="<?= htmlspecialchars($p['short_desc'] ?? '') ?>">
          </div>
          <div class="mt-3">
            <label class="form-label">Full Description <small class="text-muted">(HTML editor)</small></label>
            <div id="quill-description"></div>
            <input type="hidden" name="description" value="<?= htmlspecialchars($p['description'] ?? '') ?>">
          </div>
          <div class="mt-3">
            <label class="form-label">Tags</label>
            <input type="text" name="tags" class="form-control" value="<?= htmlspecialchars($p['tags'] ?? '') ?>">
          </div>
        </div>
      </div>

      <!-- Saree Attributes -->
      <div class="card sk-table-card shadow-sm mb-3" style="border-left:4px solid #f59e0b;">
        <div class="card-header bg-white border-0 py-3 fw-semibold">
          <i class="bi bi-stars me-1 text-warning"></i> Saree Attributes
        </div>
        <div class="card-body">
          <div class="row g-3">

            <div class="col-md-4">
              <label class="form-label">Saree Type / Style</label>
              <select name="saree_type" class="form-select">
                <option value="">Select Style</option>
                <?= opt_e($saree_styles, $p['saree_type'] ?? '') ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Fabric</label>
              <select name="fabric" class="form-select">
                <option value="">Select Fabric</option>
                <?= opt_e($fabrics, $p['fabric'] ?? '') ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Occasion</label>
              <select name="occasion" class="form-select">
                <option value="">Select Occasion</option>
                <?= opt_e($occasions, $p['occasion'] ?? '') ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Work Type</label>
              <select name="work_type" class="form-select">
                <option value="">Select Work</option>
                <?= opt_e($work_types, $p['work_type'] ?? '') ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Origin State</label>
              <select name="origin_state" class="form-select">
                <option value="">Select State</option>
                <?= opt_e($origin_states, $p['origin_state'] ?? '') ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Weave Type</label>
              <select name="weave_type" class="form-select">
                <option value="">Select</option>
                <?php foreach (['Hand-woven','Power-loom','Machine-woven','Handblock Printed','Handpainted'] as $w): ?>
                  <option <?= ($p['weave_type']??'')===$w?'selected':'' ?>><?= $w ?></option>
                <?php endforeach; ?>
              </select>
            </div>

            <!-- Color Variants -->
            <div class="col-12">
              <label class="form-label fw-semibold">Color Variants <small class="text-muted fw-normal">(each color gets its own swatch image)</small></label>
              <div id="color-variants-list">
                <?php
                $existingColors = [];
                if (!empty($p['colors_json'])) {
                    $existingColors = is_array($p['colors_json']) ? $p['colors_json'] : json_decode($p['colors_json'], true) ?? [];
                }
                if (empty($existingColors) && !empty($p['color'])) {
                    $existingColors[] = ['name' => $p['color'], 'hex' => $p['color_hex'] ?? '', 'image' => ''];
                    if (!empty($p['color2'])) $existingColors[] = ['name' => $p['color2'], 'hex' => '', 'image' => ''];
                }
                foreach ($existingColors as $ci => $cv):
                ?>
                <div class="color-variant-row d-flex gap-2 align-items-end mb-2">
                  <div style="flex:2">
                    <input type="text" name="color_variants[<?= $ci ?>][name]" class="form-control form-control-sm"
                           value="<?= htmlspecialchars($cv['name'] ?? '') ?>" placeholder="Color name">
                  </div>
                  <div style="flex:0 0 44px">
                    <input type="color" name="color_variants[<?= $ci ?>][hex]" class="form-control form-control-color form-control-sm w-100"
                           value="<?= htmlspecialchars(!empty($cv['hex']) ? $cv['hex'] : '#cccccc') ?>">
                  </div>
                  <div style="flex:3">
                    <?php if (!empty($cv['image'])): ?>
                      <div class="d-flex align-items-center gap-1 mb-1">
                        <img src="<?= base_url($cv['image']) ?>" width="32" height="32" class="rounded border" style="object-fit:cover">
                        <small class="text-muted text-truncate" style="max-width:120px"><?= basename($cv['image']) ?></small>
                      </div>
                    <?php endif; ?>
                    <input type="file" name="color_variant_images[]" class="form-control form-control-sm" accept="image/*">
                    <input type="hidden" name="color_variants[<?= $ci ?>][existing_image]" value="<?= htmlspecialchars($cv['image'] ?? '') ?>">
                  </div>
                  <?php if ($ci > 0): ?>
                  <button type="button" class="btn btn-sm btn-outline-danger remove-color-row" style="flex:0 0 auto">
                    <i class="bi bi-trash"></i>
                  </button>
                  <?php endif; ?>
                </div>
                <?php endforeach; ?>
                <?php if (empty($existingColors)): ?>
                <div class="color-variant-row d-flex gap-2 align-items-end mb-2">
                  <div style="flex:2"><input type="text" name="color_variants[0][name]" class="form-control form-control-sm" placeholder="Color name"></div>
                  <div style="flex:0 0 44px"><input type="color" name="color_variants[0][hex]" class="form-control form-control-color form-control-sm w-100" value="#cccccc"></div>
                  <div style="flex:3"><input type="file" name="color_variant_images[]" class="form-control form-control-sm" accept="image/"></div>
                </div>
                <?php endif; ?>
              </div>
              <button type="button" class="btn btn-sm btn-outline-secondary mt-1" id="add-color-variant">
                <i class="bi bi-plus-lg me-1"></i> Add Color
              </button>
              <input type="hidden" name="color_variant_count" id="color_variant_count" value="<?= max(1, count($existingColors)) ?>">
            </div>
            <input type="hidden" name="color" value="<?= htmlspecialchars($p['color'] ?? '') ?>">
            <input type="hidden" name="color_hex" value="<?= htmlspecialchars($p['color_hex'] ?? '') ?>">
            <input type="hidden" name="color2" value="<?= htmlspecialchars($p['color2'] ?? '') ?>">
            <div class="col-md-4">
              <label class="form-label">Border Type</label>
              <input type="text" name="border_type" class="form-control" value="<?= htmlspecialchars($p['border_type'] ?? '') ?>">
            </div>

            <div class="col-md-3">
              <label class="form-label">Saree Length (m)</label>
              <input type="number" name="saree_length" class="form-control" step="0.25" value="<?= $p['saree_length'] ?? '5.50' ?>">
            </div>
            <div class="col-md-3">
              <label class="form-label">Zari Type</label>
              <select name="zari_type" class="form-select">
                <option value="">None / NA</option>
                <?php foreach (['Real Zari (Gold)','Real Zari (Silver)','Artificial Zari','Copper Zari'] as $z): ?>
                  <option <?= ($p['zari_type']??'')===$z?'selected':'' ?>><?= $z ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Transparency</label>
              <select name="transparency" class="form-select">
                <?php foreach (['opaque','semi-sheer','sheer'] as $t): ?>
                  <option value="<?= $t ?>" <?= ($p['transparency']??'opaque')===$t?'selected':'' ?>><?= ucfirst($t) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Net Weight (grams)</label>
              <input type="number" name="net_weight" class="form-control" step="50" value="<?= $p['net_weight'] ?? '' ?>">
            </div>

            <div class="col-md-4">
              <label class="form-label">Sizes <small class="text-muted">(comma separated)</small></label>
              <input type="text" name="sizes" class="form-control" value="<?= htmlspecialchars(implode(', ', $p['sizes'] ?? [])) ?>" placeholder="S, M, L, XL, XXL">
            </div>

            <div class="col-md-4">
              <label class="form-label">Set Contains</label>
              <select name="set_contains" class="form-select">
                <?php foreach (['Saree Only','Saree + Blouse Piece','Saree + Stitched Blouse','Saree + Blouse + Petticoat'] as $sc): ?>
                  <option <?= ($p['set_contains']??'')===$sc?'selected':'' ?>><?= $sc ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4 d-flex align-items-end pb-1">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" name="blouse_included" value="1"
                       id="blouseCheck" <?= $p['blouse_included'] ? 'checked' : '' ?>>
                <label class="form-check-label" for="blouseCheck">Blouse Piece Included</label>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Blouse Length (m)</label>
              <input type="number" name="blouse_length" class="form-control" step="0.10"
                     value="<?= $p['blouse_length'] ?? '0.80' ?>">
            </div>

            <div class="col-md-6">
              <label class="form-label">Wash Care</label>
              <select name="wash_care" class="form-select">
                <option value="">Select</option>
                <?= opt_e($wash_cares, $p['wash_care'] ?? '') ?>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Suitable For</label>
              <input type="text" name="suitable_for" class="form-control" value="<?= htmlspecialchars($p['suitable_for'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Return Policy <small class="text-muted">(HTML)</small></label>
              <div id="quill-return-policy"></div>
              <input type="hidden" name="return_policy" value="<?= htmlspecialchars($p['return_policy'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Shipping Info <small class="text-muted">(HTML)</small></label>
              <div id="quill-shipping-info"></div>
              <input type="hidden" name="shipping_info" value="<?= htmlspecialchars($p['shipping_info'] ?? '') ?>">
            </div>

          </div>
        </div>
      </div>

      <!-- Extended Attributes -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">
          <i class="bi bi-grid me-1 text-warning"></i> Extended Attributes
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Pattern</label>
              <select name="pattern" class="form-select">
                <option value="">Select</option>
                <?php foreach (['Solid','Printed','Woven','Embroidered','Checks','Stripes','Geometric','Floral','Abstract'] as $v): ?>
                  <option <?= ($p['pattern']??'')===$v?'selected':'' ?>><?= $v ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Pattern Type</label>
              <input type="text" name="pattern_type" class="form-control" value="<?= htmlspecialchars($p['pattern_type'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Pattern Coverage</label>
              <select name="pattern_coverage" class="form-select">
                <option value="">Select</option>
                <?php foreach (['All Over','Border Only','Pallu Only','Border + Pallu','Scattered'] as $v): ?>
                  <option <?= ($p['pattern_coverage']??'')===$v?'selected':'' ?>><?= $v ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Fit Type</label>
              <select name="fit_type" class="form-select">
                <option value="">Select</option>
                <?php foreach (['Regular','Slim','Loose','Relaxed'] as $v): ?>
                  <option <?= ($p['fit_type']??'')===$v?'selected':'' ?>><?= $v ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Neck Type</label>
              <input type="text" name="neck_type" class="form-control" value="<?= htmlspecialchars($p['neck_type'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Sleeve Length</label>
              <select name="sleeve_length" class="form-select">
                <option value="">Select</option>
                <?php foreach (['Sleeveless','Short Sleeve','3/4 Sleeve','Full Sleeve','Cap Sleeve'] as $v): ?>
                  <option <?= ($p['sleeve_length']??'')===$v?'selected':'' ?>><?= $v ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Length Type</label>
              <select name="length_type" class="form-select">
                <option value="">Select</option>
                <?php foreach (['Ankle Length','Floor Length','Knee Length','Midi','Mini'] as $v): ?>
                  <option <?= ($p['length_type']??'')===$v?'selected':'' ?>><?= $v ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Ornamentation</label>
              <input type="text" name="ornamentation" class="form-control" value="<?= htmlspecialchars($p['ornamentation'] ?? '') ?>">
            </div>
            <div class="col-md-2">
              <label class="form-label">Pack Of</label>
              <input type="number" name="pack_of" class="form-control" min="1" value="<?= $p['pack_of'] ?? 1 ?>">
            </div>
            <div class="col-md-2">
              <label class="form-label">Brand Color</label>
              <input type="text" name="brand_color" class="form-control" value="<?= htmlspecialchars($p['brand_color'] ?? '') ?>">
            </div>
          </div>
        </div>
      </div>

      <!-- Catalogue & Logistics -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">
          <i class="bi bi-truck me-1 text-warning"></i> Catalogue & Logistics
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Model Name</label>
              <input type="text" name="model_name" class="form-control" value="<?= htmlspecialchars($p['model_name'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Style Code</label>
              <input type="text" name="style_code" class="form-control" value="<?= htmlspecialchars($p['style_code'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">EAN / Barcode</label>
              <input type="text" name="ean" class="form-control" value="<?= htmlspecialchars($p['ean'] ?? '') ?>">
            </div>
            <div class="col-md-3">
              <label class="form-label">Listing Status</label>
              <select name="listing_status" class="form-select">
                <?php foreach (['ACTIVE','INACTIVE','BLOCKED'] as $v): ?>
                  <option <?= ($p['listing_status']??'ACTIVE')===$v?'selected':'' ?>><?= $v ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Min Order Qty</label>
              <input type="number" name="min_order_qty" class="form-control" min="1" value="<?= $p['min_order_qty'] ?? 1 ?>">
            </div>
            <div class="col-md-3">
              <label class="form-label">Procurement Type</label>
              <select name="procurement_type" class="form-select">
                <?php foreach (['IN_STOCK','PREORDER','BACK_ORDER'] as $v): ?>
                  <option <?= ($p['procurement_type']??'IN_STOCK')===$v?'selected':'' ?>><?= $v ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Delivery SLA (days)</label>
              <input type="number" name="procurement_sla" class="form-control" min="1" value="<?= $p['procurement_sla'] ?? 2 ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">HSN Code</label>
              <input type="text" name="hsn_code" class="form-control" value="<?= htmlspecialchars($p['hsn_code'] ?? '') ?>">
            </div>
            <div class="col-md-4">
              <label class="form-label">Tax Code (GST %)</label>
              <select name="tax_code" class="form-select">
                <option value="">Select GST Slab</option>
                <?php foreach (['GST_0'=>'0%','GST_5'=>'5%','GST_12'=>'12%','GST_18'=>'18%','GST_28'=>'28%'] as $v=>$l): ?>
                  <option value="<?= $v ?>" <?= ($p['tax_code']??'')===$v?'selected':'' ?>><?= $l ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Package Dimensions (cm)</label>
              <div class="input-group input-group-sm">
                <input type="number" name="package_length" class="form-control" placeholder="L" step="0.1" value="<?= $p['package_length'] ?? '' ?>">
                <input type="number" name="package_breadth" class="form-control" placeholder="B" step="0.1" value="<?= $p['package_breadth'] ?? '' ?>">
                <input type="number" name="package_height" class="form-control" placeholder="H" step="0.1" value="<?= $p['package_height'] ?? '' ?>">
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Manufacturer Name</label>
              <input type="text" name="manufacturer_name" class="form-control" value="<?= htmlspecialchars($p['manufacturer_name'] ?? '') ?>">
            </div>
            <div class="col-md-6">
              <label class="form-label">Manufacturer Address</label>
              <input type="text" name="manufacturer_address" class="form-control" value="<?= htmlspecialchars($p['manufacturer_address'] ?? '') ?>">
            </div>
          </div>
        </div>
      </div>

      <!-- Features & Custom Attributes -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">
          <i class="bi bi-list-check me-1 text-warning"></i> Features & Custom Attributes
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Features <small class="text-muted">(one per line)</small></label>
            <textarea name="features" class="form-control" rows="4"><?php
              $feat = $p['features'] ?? [];
              if (is_array($feat)) echo htmlspecialchars(implode("\n", $feat));
              elseif (is_string($feat)) {
                  $arr = json_decode($feat, true);
                  echo htmlspecialchars(is_array($arr) ? implode("\n", $arr) : $feat);
              }
            ?></textarea>
          </div>
          <div>
            <label class="form-label">Custom Category Attributes <small class="text-muted">(JSON)</small></label>
            <textarea name="category_attributes" class="form-control font-monospace" rows="3"><?php
              $ca = $p['category_attributes'] ?? '';
              if (is_array($ca)) echo htmlspecialchars(json_encode($ca, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
              else echo htmlspecialchars($ca);
            ?></textarea>
          </div>
        </div>
      </div>

      <?php $seo = $p; $this->load->view('admin/partials/seo_fields', compact('seo')); ?>

      <!-- Pricing -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">
          <i class="bi bi-tag me-1 text-warning"></i> Pricing & Inventory
        </div>
        <div class="card-body">
          <div class="row g-2">
            <div class="col-md-3">
              <label class="form-label">MRP / Price <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text">₹</span>
                <input type="number" name="price" class="form-control" value="<?= $p['price'] ?>" required>
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Sale Price</label>
              <div class="input-group">
                <span class="input-group-text">₹</span>
                <input type="number" name="sale_price" class="form-control" value="<?= $p['sale_price'] ?? '' ?>">
              </div>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" name="hot_sale" value="1" id="hotSaleCheck"
                       <?= !empty($p['hot_sale']) ? 'checked' : '' ?>>
                <label class="form-check-label" for="hotSaleCheck">Enable Hot Sale</label>
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Sale Start (date & hour)</label>
              <input type="datetime-local" name="sale_start_at" class="form-control" value="<?= htmlspecialchars($saleStartLocal) ?>">
            </div>
            <div class="col-md-3">
              <label class="form-label">Sale End (date & hour)</label>
              <input type="datetime-local" name="sale_end_at" class="form-control" value="<?= htmlspecialchars($saleEndLocal) ?>">
            </div>
            <div class="col-md-3">
              <label class="form-label">Stock <span class="text-danger">*</span></label>
              <input type="number" name="stock" class="form-control" value="<?= $p['stock'] ?>" required>
            </div>
            <div class="col-md-3">
              <label class="form-label">Weight (kg)</label>
              <input type="number" name="weight" class="form-control" step="0.1" value="<?= $p['weight'] ?? '' ?>">
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ── RIGHT COLUMN ────────────────────────────────────── -->
    <div class="col-lg-4">

      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">Publish</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
              <?php foreach (['active','inactive','draft'] as $s): ?>
                <option value="<?= $s ?>" <?= $p['status']===$s?'selected':'' ?>><?= ucfirst($s) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" name="featured" value="1" id="featuredCheck"
                   <?= $p['featured'] ? 'checked' : '' ?>>
            <label class="form-check-label" for="featuredCheck">Featured / Homepage</label>
          </div>
          <div class="form-check form-switch mt-2">
            <input class="form-check-input" type="checkbox" name="nav_featured" value="1" id="navFeaturedCheck"
                   <?= !empty($p['nav_featured']) ? 'checked' : '' ?>>
            <label class="form-check-label" for="navFeaturedCheck">
              Show in Navbar Menu <small class="text-muted">(appears as product card inside nav dropdown)</small>
            </label>
          </div>
          <div class="form-check form-switch mt-2">
            <input class="form-check-input" type="checkbox" name="special_product" value="1" id="specialProductCheck"
                   <?= !empty($p['special_product']) ? 'checked' : '' ?>>
            <label class="form-check-label" for="specialProductCheck">
              Our Special Product <small class="text-muted">(shows in "Our Special Products" section on homepage)</small>
            </label>
          </div>
        </div>
      </div>

      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">Main Image</div>
        <div class="card-body text-center">
          <?php if ($p['thumbnail']): ?>
            <img src="<?= base_url($p['thumbnail']) ?>" class="img-fluid rounded mb-2 border"
                 style="max-height:180px;object-fit:contain;" id="thumbPreview">
          <?php else: ?>
            <img id="thumbPreview" src="#" style="display:none;max-height:180px;" class="img-fluid rounded mb-2 border">
          <?php endif; ?>
          <input type="file" name="thumbnail" class="form-control form-control-sm sk-img-preview-input"
                 data-target="#thumbPreview" accept="image/*">
          <small class="text-muted">Leave blank to keep current</small>
        </div>
      </div>

      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">Gallery</div>
        <div class="card-body">
          <?php if (!empty($p['images'])): ?>
            <div class="d-flex flex-wrap gap-2 mb-3" id="galleryGrid">
              <?php foreach ($p['images'] as $img): ?>
                <div class="position-relative" id="imgWrap-<?= $img['id'] ?>" style="width:72px;height:72px;">
                  <img src="<?= base_url($img['image']) ?>" width="72" height="72"
                       class="rounded border" style="object-fit:cover;width:72px;height:72px;">
                  <button type="button"
                    onclick="deleteGalleryImage(<?= $img['id'] ?>, <?= $p['id'] ?>)"
                    class="position-absolute top-0 end-0 btn btn-danger btn-sm p-0 d-flex align-items-center justify-content-center"
                    style="width:20px;height:20px;border-radius:50%;font-size:10px;line-height:1;"
                    title="Remove image">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              <?php endforeach; ?>
            </div>
          <?php else: ?>
            <p class="text-muted small mb-2">No gallery images yet.</p>
          <?php endif; ?>
          <input type="file" name="images[]" class="form-control form-control-sm" multiple accept="image/*">
          <small class="text-muted">Add new images to the gallery</small>
        </div>
      </div>

      <!-- Saree info card -->
      <div class="card border-0 bg-success bg-opacity-10">
        <div class="card-body py-3">
          <p class="fw-semibold text-success mb-2 small"><i class="bi bi-check2-circle me-1"></i>Saree Details</p>
          <div class="small text-muted">
            <div><b>Type:</b> <?= $p['saree_type'] ?: '—' ?></div>
            <div><b>Fabric:</b> <?= $p['fabric'] ?: '—' ?></div>
            <div><b>Color:</b> <?= $p['color'] ?: '—' ?></div>
            <div><b>Occasion:</b> <?= $p['occasion'] ?: '—' ?></div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div class="mt-3 d-flex gap-2 pb-4">
    <button type="submit" class="btn btn-warning fw-semibold px-5 py-2">
      <i class="bi bi-check-lg me-1"></i> Update Saree
    </button>
    <a href="<?= site_url('admin/products') ?>" class="btn btn-outline-secondary">Cancel</a>
  </div>

</form>

<script>
function deleteGalleryImage(imageId, productId) {
  if (!confirm('Remove this image from the gallery?')) return;
  fetch('<?= site_url('admin/products/delete_image') ?>/' + imageId + '/' + productId, { method: 'POST' })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (res.success) {
        var el = document.getElementById('imgWrap-' + imageId);
        if (el) el.remove();
      }
    });
}

document.addEventListener('DOMContentLoaded', function () {
  var catSel = document.querySelector('select[name="category_id"]');
  var subSel = document.getElementById('subcategory_id');
  var subRow = document.getElementById('subcategory-row');
  var ajaxBase = '<?= site_url('admin/products/subcategories/') ?>';
  var currentSubId = '<?= (int)($p['subcategory_id'] ?? 0) ?>';

  catSel.addEventListener('change', function () {
    subSel.innerHTML = '<option value="">-- Select Sub Category --</option>';
    subRow.style.display = 'none';
    if (!this.value) return;
    fetch(ajaxBase + this.value)
      .then(function (r) { return r.json(); })
      .then(function (subs) {
        if (subs && subs.length) {
          subs.forEach(function (s) {
            var o = document.createElement('option');
            o.value = s.id;
            o.textContent = s.name;
            subSel.appendChild(o);
          });
          subRow.style.display = '';
        }
      });
  });
});
</script>

