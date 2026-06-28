<?php
// Helper: select option
function opt($list, $val) {
    $out = '';
    foreach ($list as $v) {
        $sel = (is_array($v) ? $v['name'] : $v) === $val ? 'selected' : '';
        $label = is_array($v) ? htmlspecialchars($v['name'] . ($v['state'] ? ' (' . $v['state'] . ')' : '')) : htmlspecialchars($v);
        $value = is_array($v) ? htmlspecialchars($v['name']) : htmlspecialchars($v);
        $out .= "<option value=\"$value\" $sel>$label</option>";
    }
    return $out;
}
?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-plus-circle me-2 text-warning"></i>Add Saree Product</h5>
  <a href="<?= site_url('admin/products') ?>" class="btn btn-sm btn-outline-secondary">
    <i class="bi bi-arrow-left me-1"></i> Back
  </a>
</div>

<form action="<?= site_url('admin/products/store') ?>" method="POST" enctype="multipart/form-data">

  <div class="row g-3">

    <!-- ── LEFT COLUMN ─────────────────────────────────────── -->
    <div class="col-lg-8">

      <!-- Basic Info -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">
          <i class="bi bi-info-circle me-1 text-warning"></i> Basic Information
        </div>
        <div class="card-body">
          <?php if (!empty($vendors) && empty($vendor_id)): ?>
          <div class="mb-3">
            <label class="form-label">Vendor <span class="text-danger">*</span></label>
            <select name="vendor_id" class="form-select" required>
              <option value="">Select vendor</option>
              <?php foreach ($vendors as $v): ?>
              <option value="<?= $v['id'] ?>"><?= htmlspecialchars($v['business_name']) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <?php elseif (!empty($vendor_id)): ?>
          <input type="hidden" name="vendor_id" value="<?= (int)$vendor_id ?>">
          <?php endif; ?>
          <div class="mb-3">
            <label class="form-label">Product / Saree Name <span class="text-danger">*</span></label>
            <input type="text" name="name" id="product_name" class="form-control"
                   placeholder="e.g. Pure Kanjivaram Silk Saree in Ruby Red" required>
          </div>
          <div class="row g-2">
            <div class="col-md-4">
              <label class="form-label">SKU / Code</label>
              <input type="text" name="sku" class="form-control" placeholder="e.g. KJV-RED-001">
            </div>
            <div class="col-md-4">
              <label class="form-label">Category <span class="text-danger">*</span></label>
              <select name="category_id" class="form-select" required>
                <option value="">Select Category</option>
                <?php foreach ($categories as $c): ?>
                  <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['name']) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Brand</label>
              <select name="brand_id" class="form-select">
                <option value="">No Brand</option>
                <?php foreach ($brands as $b): ?>
                  <option value="<?= $b['id'] ?>"><?= htmlspecialchars($b['name']) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
          <div class="row g-2 mt-1" id="subcategory-row" style="display:none;">
            <div class="col-md-4">
              <label class="form-label">Sub Category</label>
              <select name="subcategory_id" id="subcategory_id" class="form-select">
                <option value="">-- Select Sub Category --</option>
              </select>
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label">Subtitle <small class="text-muted">(product tagline)</small></label>
            <input type="text" name="subtitle" class="form-control" placeholder="e.g. Exclusive Designer Collection">
          </div>
          <div class="mt-3">
            <label class="form-label">Short Description <small class="text-muted">(shown in product info panel — keep it brief)</small></label>
            <div id="quill-short-desc"></div>
            <input type="hidden" name="short_desc" value="">
          </div>
          <div class="mt-3">
            <label class="form-label">Full Description <small class="text-muted">(HTML editor)</small></label>
            <div id="quill-description"></div>
            <input type="hidden" name="description" value="">
          </div>
          <div class="mt-3">
            <label class="form-label">Tags <small class="text-muted">(comma separated)</small></label>
            <input type="text" name="tags" class="form-control" placeholder="silk, kanjivaram, wedding, zari, red">
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
                <?= opt($saree_styles, '') ?>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Fabric / Material</label>
              <select name="fabric" class="form-select">
                <option value="">Select Fabric</option>
                <?= opt($fabrics, '') ?>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Occasion</label>
              <select name="occasion" class="form-select">
                <option value="">Select Occasion</option>
                <?= opt($occasions, '') ?>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Work Type / Embellishment</label>
              <select name="work_type" class="form-select">
                <option value="">Select Work</option>
                <?= opt($work_types, '') ?>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Origin State</label>
              <select name="origin_state" class="form-select">
                <option value="">Select State</option>
                <?= opt($origin_states, '') ?>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Weave Type</label>
              <select name="weave_type" class="form-select">
                <option value="">Select</option>
                <option>Hand-woven</option>
                <option>Power-loom</option>
                <option>Machine-woven</option>
                <option>Handblock Printed</option>
                <option>Handpainted</option>
              </select>
            </div>

            <!-- Color Variants -->
            <div class="col-12">
              <label class="form-label fw-semibold">Color Variants <small class="text-muted fw-normal">(add all available colors with a swatch image)</small></label>
              <div id="color-variants-list">
                <div class="color-variant-row d-flex gap-2 align-items-end mb-2">
                  <div style="flex:2">
                    <input type="text" name="color_variants[0][name]" class="form-control form-control-sm" placeholder="Color name e.g. Ruby Red">
                  </div>
                  <div style="flex:0 0 44px">
                    <input type="color" name="color_variants[0][hex]" class="form-control form-control-color form-control-sm w-100" value="#cc0000" title="Hex">
                  </div>
                  <div style="flex:3">
                    <input type="file" name="color_variant_images[]" class="form-control form-control-sm" accept="image/*" title="Swatch image for this color">
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-secondary mt-1" id="add-color-variant">
                <i class="bi bi-plus-lg me-1"></i> Add Color
              </button>
              <input type="hidden" name="color_variant_count" id="color_variant_count" value="1">
            </div>
            <!-- Legacy single color fields (first variant auto-populates these) -->
            <input type="hidden" name="color" id="color_primary">
            <input type="hidden" name="color_hex" id="color_hex_primary">
            <input type="hidden" name="color2" id="color2_secondary">
            <div class="col-md-4">
              <label class="form-label">Border Type</label>
              <input type="text" name="border_type" class="form-control" placeholder="e.g. Gold Zari Border">
            </div>

            <!-- Dimensions -->
            <div class="col-md-3">
              <label class="form-label">Saree Length (meters)</label>
              <input type="number" name="saree_length" class="form-control" step="0.25" min="5" max="9" value="5.50">
            </div>
            <div class="col-md-3">
              <label class="form-label">Zari Type</label>
              <select name="zari_type" class="form-select">
                <option value="">None / NA</option>
                <option>Real Zari (Gold)</option>
                <option>Real Zari (Silver)</option>
                <option>Artificial Zari</option>
                <option>Copper Zari</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Transparency</label>
              <select name="transparency" class="form-select">
                <option value="opaque">Opaque</option>
                <option value="semi-sheer">Semi-Sheer</option>
                <option value="sheer">Sheer</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Net Weight (grams)</label>
              <input type="number" name="net_weight" class="form-control" step="50" placeholder="e.g. 650">
            </div>

            <div class="col-md-4">
              <label class="form-label">Sizes <small class="text-muted">(comma separated)</small></label>
              <input type="text" name="sizes" class="form-control" placeholder="S, M, L, XL, XXL">
            </div>

            <!-- Blouse -->
            <div class="col-md-4">
              <label class="form-label">Set Contains</label>
              <select name="set_contains" class="form-select">
                <option value="Saree Only">Saree Only</option>
                <option value="Saree + Blouse Piece">Saree + Blouse Piece</option>
                <option value="Saree + Stitched Blouse">Saree + Stitched Blouse</option>
                <option value="Saree + Blouse + Petticoat">Saree + Blouse + Petticoat</option>
              </select>
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" name="blouse_included" value="1" id="blouseCheck">
                <label class="form-check-label" for="blouseCheck">Blouse Piece Included</label>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Blouse Piece Length (meters)</label>
              <input type="number" name="blouse_length" class="form-control" step="0.10" value="0.80">
            </div>

            <!-- Care & Suitability -->
            <div class="col-md-6">
              <label class="form-label">Wash Care</label>
              <select name="wash_care" class="form-select">
                <option value="">Select</option>
                <?= opt($wash_cares, '') ?>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Suitable For</label>
              <input type="text" name="suitable_for" class="form-control" placeholder="Women, Girls, Plus Size, Maternity">
            </div>
            <div class="col-md-6">
              <label class="form-label">Return Policy <small class="text-muted">(HTML)</small></label>
              <div id="quill-return-policy"></div>
              <input type="hidden" name="return_policy" value="">
            </div>
            <div class="col-md-6">
              <label class="form-label">Shipping Info <small class="text-muted">(HTML)</small></label>
              <div id="quill-shipping-info"></div>
              <input type="hidden" name="shipping_info" value="">
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
                <option>Solid</option><option>Printed</option><option>Woven</option>
                <option>Embroidered</option><option>Checks</option><option>Stripes</option>
                <option>Geometric</option><option>Floral</option><option>Abstract</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Pattern Type</label>
              <input type="text" name="pattern_type" class="form-control" placeholder="e.g. Banarasi Motif">
            </div>
            <div class="col-md-4">
              <label class="form-label">Pattern Coverage</label>
              <select name="pattern_coverage" class="form-select">
                <option value="">Select</option>
                <option>All Over</option><option>Border Only</option><option>Pallu Only</option>
                <option>Border + Pallu</option><option>Scattered</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Fit Type</label>
              <select name="fit_type" class="form-select">
                <option value="">Select</option>
                <option>Regular</option><option>Slim</option><option>Loose</option><option>Relaxed</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Neck Type</label>
              <input type="text" name="neck_type" class="form-control" placeholder="e.g. Round Neck">
            </div>
            <div class="col-md-4">
              <label class="form-label">Sleeve Length</label>
              <select name="sleeve_length" class="form-select">
                <option value="">Select</option>
                <option>Sleeveless</option><option>Short Sleeve</option><option>3/4 Sleeve</option>
                <option>Full Sleeve</option><option>Cap Sleeve</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Length Type</label>
              <select name="length_type" class="form-select">
                <option value="">Select</option>
                <option>Ankle Length</option><option>Floor Length</option><option>Knee Length</option>
                <option>Midi</option><option>Mini</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Ornamentation</label>
              <input type="text" name="ornamentation" class="form-control" placeholder="e.g. Zari, Sequin, Stone">
            </div>
            <div class="col-md-2">
              <label class="form-label">Pack Of</label>
              <input type="number" name="pack_of" class="form-control" min="1" value="1">
            </div>
            <div class="col-md-2">
              <label class="form-label">Brand Color</label>
              <input type="text" name="brand_color" class="form-control" placeholder="e.g. Ruby Red">
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
              <input type="text" name="model_name" class="form-control" placeholder="e.g. KJV-2024-RR">
            </div>
            <div class="col-md-4">
              <label class="form-label">Style Code</label>
              <input type="text" name="style_code" class="form-control" placeholder="e.g. SKS-001">
            </div>
            <div class="col-md-4">
              <label class="form-label">EAN / Barcode</label>
              <input type="text" name="ean" class="form-control" placeholder="13-digit EAN">
            </div>
            <div class="col-md-3">
              <label class="form-label">Listing Status</label>
              <select name="listing_status" class="form-select">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Min Order Qty</label>
              <input type="number" name="min_order_qty" class="form-control" min="1" value="1">
            </div>
            <div class="col-md-3">
              <label class="form-label">Procurement Type</label>
              <select name="procurement_type" class="form-select">
                <option value="IN_STOCK">IN_STOCK</option>
                <option value="PREORDER">PREORDER</option>
                <option value="BACK_ORDER">BACK_ORDER</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Delivery SLA (days)</label>
              <input type="number" name="procurement_sla" class="form-control" min="1" value="2">
            </div>
            <div class="col-md-4">
              <label class="form-label">HSN Code</label>
              <input type="text" name="hsn_code" class="form-control" placeholder="e.g. 5407">
            </div>
            <div class="col-md-4">
              <label class="form-label">Tax Code (GST %)</label>
              <select name="tax_code" class="form-select">
                <option value="">Select GST Slab</option>
                <option value="GST_0">0%</option>
                <option value="GST_5">5%</option>
                <option value="GST_12">12%</option>
                <option value="GST_18">18%</option>
                <option value="GST_28">28%</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Package Dimensions (cm)</label>
              <div class="input-group input-group-sm">
                <input type="number" name="package_length" class="form-control" placeholder="L" step="0.1">
                <input type="number" name="package_breadth" class="form-control" placeholder="B" step="0.1">
                <input type="number" name="package_height" class="form-control" placeholder="H" step="0.1">
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Manufacturer Name</label>
              <input type="text" name="manufacturer_name" class="form-control" placeholder="e.g. Kanjivaram Silk House">
            </div>
            <div class="col-md-6">
              <label class="form-label">Manufacturer Address</label>
              <input type="text" name="manufacturer_address" class="form-control" placeholder="City, State, PIN">
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
            <textarea name="features" class="form-control" rows="4"
                      placeholder="Pure Kanjivaram Silk&#10;Gold Zari Weaving&#10;Traditional South Indian Design&#10;Comes with unstitched blouse piece"></textarea>
          </div>
          <div>
            <label class="form-label">Custom Category Attributes <small class="text-muted">(JSON, e.g. {"Thread Count":"400","Loom Type":"Pit Loom"})</small></label>
            <textarea name="category_attributes" class="form-control font-monospace" rows="3"
                      placeholder='{"Thread Count": "400", "Loom Type": "Pit Loom"}'></textarea>
          </div>
        </div>
      </div>

      <!-- Pricing & Stock -->
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
                <input type="number" name="price" class="form-control" step="1" min="0" required>
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Sale / Offer Price</label>
              <div class="input-group">
                <span class="input-group-text">₹</span>
                <input type="number" name="sale_price" class="form-control" step="1" min="0" placeholder="Optional">
              </div>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" name="hot_sale" value="1" id="hotSaleCheck">
                <label class="form-check-label" for="hotSaleCheck">Enable Hot Sale</label>
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Sale Start (date & hour)</label>
              <input type="datetime-local" name="sale_start_at" class="form-control">
            </div>
            <div class="col-md-3">
              <label class="form-label">Sale End (date & hour)</label>
              <input type="datetime-local" name="sale_end_at" class="form-control">
            </div>
            <div class="col-md-3">
              <label class="form-label">Stock Quantity <span class="text-danger">*</span></label>
              <input type="number" name="stock" class="form-control" min="0" required>
            </div>
            <div class="col-md-3">
              <label class="form-label">Weight (kg) <small class="text-muted">for shipping</small></label>
              <input type="number" name="weight" class="form-control" step="0.1" placeholder="0.7">
            </div>
          </div>
        </div>
      </div>

      <?php $seo = []; $this->load->view('admin/partials/seo_fields', compact('seo')); ?>

    </div>

    <!-- ── RIGHT COLUMN ────────────────────────────────────── -->
    <div class="col-lg-4">

      <!-- Publish -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">Publish</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Status</label>
            <select name="status" class="form-select">
              <option value="active">Active (Live)</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" name="featured" value="1" id="featuredCheck">
            <label class="form-check-label" for="featuredCheck">Featured / Homepage</label>
          </div>
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" name="nav_featured" value="1" id="navFeaturedCheck">
            <label class="form-check-label" for="navFeaturedCheck">
              Show in Navbar Menu <small class="text-muted">(appears as product card inside nav dropdown)</small>
            </label>
          </div>
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" name="special_product" value="1" id="specialProductCheck">
            <label class="form-check-label" for="specialProductCheck">
              Our Special Product <small class="text-muted">(shows in "Our Special Products" section on homepage)</small>
            </label>
          </div>
        </div>
      </div>

      <!-- Thumbnail -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">Main Image</div>
        <div class="card-body text-center">
          <img id="thumbPreview" src="#" alt="Preview"
               class="img-fluid rounded mb-2 border" style="display:none;max-height:200px;object-fit:contain;">
          <div class="border-2 border-dashed rounded p-3 bg-light">
            <i class="bi bi-cloud-upload fs-2 text-muted d-block mb-1"></i>
            <small class="text-muted">JPG, PNG, WebP · Max 2MB</small>
            <input type="file" name="thumbnail" class="form-control form-control-sm mt-2 sk-img-preview-input"
                   data-target="#thumbPreview" accept="image/*">
          </div>
        </div>
      </div>

      <!-- Gallery -->
      <div class="card sk-table-card shadow-sm mb-3">
        <div class="card-header bg-white border-0 py-3 fw-semibold">Gallery Images</div>
        <div class="card-body">
          <small class="text-muted d-block mb-2">Add multiple saree photos (drape, closeup, border, blouse)</small>
          <input type="file" name="images[]" class="form-control form-control-sm" multiple accept="image/*">
        </div>
      </div>

      <!-- Quick Tips -->
      <div class="card border-0 bg-warning bg-opacity-10">
        <div class="card-body py-3">
          <p class="fw-semibold text-warning mb-2 small"><i class="bi bi-lightbulb me-1"></i>Tips for Sarees</p>
          <ul class="small text-muted mb-0 ps-3">
            <li>Add all 5–6 drape photos</li>
            <li>Mention exact zari type (real vs artificial)</li>
            <li>Specify blouse separately</li>
            <li>State wash care clearly</li>
            <li>Use regional keywords in tags</li>
          </ul>
        </div>
      </div>

    </div>
  </div>

  <div class="mt-3 d-flex gap-2 pb-4">
    <button type="submit" class="btn btn-warning fw-semibold px-5 py-2">
      <i class="bi bi-check-lg me-1"></i> Save Saree
    </button>
    <a href="<?= site_url('admin/products') ?>" class="btn btn-outline-secondary py-2">Cancel</a>
  </div>

</form>

<script>
document.addEventListener('DOMContentLoaded', function () {
  var catSel = document.querySelector('select[name="category_id"]');
  var subSel = document.getElementById('subcategory_id');
  var subRow = document.getElementById('subcategory-row');
  var ajaxBase = '<?= site_url('admin/products/subcategories/') ?>';

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

