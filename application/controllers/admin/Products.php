<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Products extends Sk_Base {

    public function index() {
        $search    = $this->input->get('search', TRUE);
        $vendor_id = $this->current_vendor_id() ?: ((int)$this->input->get('vendor_id') ?: null);
        $page      = (int)($this->input->get('page') ?? 1);
        $limit     = 15;
        $offset    = ($page - 1) * $limit;

        $data['title']    = 'Products - ShopKart Admin';
        $data['products'] = $this->Sk_Product_model->get_all_admin($limit, $offset, $search, $vendor_id);
        $data['total']    = $this->Sk_Product_model->count_all_admin($search, $vendor_id);
        $data['page']     = $page;
        $data['limit']    = $limit;
        $data['search']   = $search;
        $data['vendor_id']= $vendor_id;
        if ($this->is_super_admin()) {
            $data['vendors'] = $this->Sk_Vendor_model->get_all(['status' => 'approved'], 200, 0)['rows'];
        }
        $this->render('products/list', $data);
    }

    public function add() {
        $data['title']        = 'Add Saree Product';
        $data['categories']   = $this->Sk_Admin_model->get_categories(null, 1);
        $data['brands']       = $this->db->get('brands')->result_array();
        $data['saree_styles'] = $this->Sk_Admin_model->get_saree_styles();
        $data['fabrics']      = Sk_Admin_model::fabric_options();
        $data['occasions']    = Sk_Admin_model::occasion_options();
        $data['work_types']   = Sk_Admin_model::work_type_options();
        $data['wash_cares']   = Sk_Admin_model::wash_care_options();
        $data['origin_states']= Sk_Admin_model::origin_states();
        $data['extra_js']     = $this->_summernote_init_js();
        $data['vendor_id']    = $this->current_vendor_id();
        if ($this->is_super_admin()) {
            $data['vendors'] = $this->Sk_Vendor_model->get_all(['status' => 'approved'], 200, 0)['rows'];
        }
        $this->render('products/add', $data);
    }

    public function store() {
        $this->form_validation->set_rules('name',       'Product Name', 'required|trim');
        $this->form_validation->set_rules('price',      'Price',        'required|numeric');
        $this->form_validation->set_rules('category_id','Category',     'required|integer');
        $this->form_validation->set_rules('stock',      'Stock',        'required|integer');

        if ($this->form_validation->run() === FALSE) {
            $this->session->set_flashdata('error', validation_errors());
            redirect('admin/products/add');
        }

        $thumbnail = $this->upload_file('thumbnail', 'products');

        $data = [
            'name'             => $this->input->post('name', TRUE),
            'category_id'      => $this->input->post('category_id'),
            'subcategory_id'   => $this->input->post('subcategory_id') ?: null,
            'brand_id'         => $this->input->post('brand_id') ?: null,
            'sku'              => $this->input->post('sku', TRUE),
            'description'      => $this->input->post('description'),
            'short_desc'       => $this->input->post('short_desc', TRUE),
            'price'            => $this->input->post('price'),
            'sale_price'       => $this->input->post('sale_price') ?: null,
            'hot_sale'         => $this->input->post('hot_sale') ? 1 : 0,
            'sale_start_at'    => $this->_normalize_datetime_input($this->input->post('sale_start_at')),
            'sale_end_at'      => $this->_normalize_datetime_input($this->input->post('sale_end_at')),
            'stock'            => $this->input->post('stock'),
            'weight'           => $this->input->post('weight') ?: null,
            'featured'         => $this->input->post('featured') ? 1 : 0,
            'nav_featured'     => $this->input->post('nav_featured') ? 1 : 0,
            'special_product'  => $this->input->post('special_product') ? 1 : 0,
            'status'           => $this->input->post('status'),
            'meta_title'       => $this->input->post('meta_title', TRUE),
            'meta_desc'        => $this->input->post('meta_desc', TRUE),
            'meta_keywords'    => $this->input->post('meta_keywords', TRUE),
            'og_image'         => $this->input->post('og_image', TRUE),
            'tags'             => $this->input->post('tags', TRUE),
            'thumbnail'        => $thumbnail,
            // Saree attributes
            'saree_type'       => $this->input->post('saree_type', TRUE) ?: null,
            'fabric'           => $this->input->post('fabric', TRUE) ?: null,
            'occasion'         => $this->input->post('occasion', TRUE) ?: null,
            'work_type'        => $this->input->post('work_type', TRUE) ?: null,
            'color'            => $this->input->post('color', TRUE) ?: null,
            'color_hex'        => $this->input->post('color_hex', TRUE) ?: null,
            'color2'           => $this->input->post('color2', TRUE) ?: null,
            'saree_length'     => $this->input->post('saree_length') ?: 5.50,
            'blouse_included'  => $this->input->post('blouse_included') ? 1 : 0,
            'blouse_length'    => $this->input->post('blouse_length') ?: 0.80,
            'set_contains'        => $this->input->post('set_contains', TRUE) ?: null,
            'border_type'         => $this->input->post('border_type', TRUE) ?: null,
            'transparency'        => $this->input->post('transparency') ?: 'opaque',
            'wash_care'           => $this->input->post('wash_care', TRUE) ?: null,
            'origin_state'        => $this->input->post('origin_state', TRUE) ?: null,
            'weave_type'          => $this->input->post('weave_type', TRUE) ?: null,
            'net_weight'          => $this->input->post('net_weight') ?: null,
            'zari_type'           => $this->input->post('zari_type', TRUE) ?: null,
            'suitable_for'        => $this->input->post('suitable_for', TRUE) ?: null,
            'return_policy'       => $this->input->post('return_policy') ?: null,
            'shipping_info'       => $this->input->post('shipping_info') ?: null,
            // ── New catalogue fields ─────────────────────────────────────
            'subtitle'            => $this->input->post('subtitle', TRUE) ?: null,
            'model_name'          => $this->input->post('model_name', TRUE) ?: null,
            'listing_status'      => $this->input->post('listing_status') ?: 'ACTIVE',
            'min_order_qty'       => (int)($this->input->post('min_order_qty') ?: 1),
            'procurement_type'    => $this->input->post('procurement_type', TRUE) ?: 'IN_STOCK',
            'procurement_sla'     => (int)($this->input->post('procurement_sla') ?: 2),
            'package_length'      => $this->input->post('package_length') ?: null,
            'package_breadth'     => $this->input->post('package_breadth') ?: null,
            'package_height'      => $this->input->post('package_height') ?: null,
            'hsn_code'            => $this->input->post('hsn_code', TRUE) ?: null,
            'tax_code'            => $this->input->post('tax_code', TRUE) ?: null,
            'manufacturer_name'   => $this->input->post('manufacturer_name', TRUE) ?: null,
            'manufacturer_address'=> $this->input->post('manufacturer_address', TRUE) ?: null,
            'style_code'          => $this->input->post('style_code', TRUE) ?: null,
            'ean'                 => $this->input->post('ean', TRUE) ?: null,
            'sizes'               => $this->input->post('sizes', TRUE) ?: null,
            'brand_color'         => $this->input->post('brand_color', TRUE) ?: null,
            'pattern'             => $this->input->post('pattern', TRUE) ?: null,
            'fit_type'            => $this->input->post('fit_type', TRUE) ?: null,
            'neck_type'           => $this->input->post('neck_type', TRUE) ?: null,
            'sleeve_length'       => $this->input->post('sleeve_length', TRUE) ?: null,
            'length_type'         => $this->input->post('length_type', TRUE) ?: null,
            'pack_of'             => (int)($this->input->post('pack_of') ?: 1),
            'pattern_type'        => $this->input->post('pattern_type', TRUE) ?: null,
            'pattern_coverage'    => $this->input->post('pattern_coverage', TRUE) ?: null,
            'ornamentation'       => $this->input->post('ornamentation', TRUE) ?: null,
            'features'            => $this->_encode_features($this->input->post('features', TRUE)),
            'category_attributes' => $this->_encode_json($this->input->post('category_attributes', TRUE)),
            'colors_json'         => $this->_build_colors_json(),
            'vendor_id'           => $this->resolve_vendor_id_for_write((int)$this->input->post('vendor_id')) ?: 1,
            'created_by'          => $this->admin['id'],
        ];
        // Set color/color2 from first two color variants
        $cv = $this->input->post('color_variants') ?? [];
        if (!empty($cv[0]['name'])) { $data['color'] = $cv[0]['name']; $data['color_hex'] = $cv[0]['hex'] ?? ''; }
        if (!empty($cv[1]['name'])) $data['color2'] = $cv[1]['name'];

        $product_id = $this->Sk_Product_model->create($data);

        // Additional images
        if (!empty($_FILES['images']['name'][0])) {
            $this->_save_product_images($product_id);
        }

        $this->session->set_flashdata('success', 'Product created successfully.');
        redirect('admin/products');
    }

    public function edit($id) {
        $data['title']         = 'Edit Saree Product';
        $data['product']       = $this->Sk_Product_model->get_by_id($id);
        $this->assert_product_vendor_access($data['product']);
        $data['categories']    = $this->Sk_Admin_model->get_categories(null, 1);
        $data['subcategories'] = $this->Sk_Admin_model->get_subcategories($data['product']['category_id'], 1);
        $data['brands']        = $this->db->get('brands')->result_array();
        $data['saree_styles']  = $this->Sk_Admin_model->get_saree_styles();
        $data['fabrics']       = Sk_Admin_model::fabric_options();
        $data['occasions']     = Sk_Admin_model::occasion_options();
        $data['work_types']    = Sk_Admin_model::work_type_options();
        $data['wash_cares']    = Sk_Admin_model::wash_care_options();
        $data['origin_states'] = Sk_Admin_model::origin_states();
        $data['extra_js']      = $this->_summernote_init_js();
        $this->render('products/edit', $data);
    }

    public function subcategories_by_category($category_id) {
        $subs = $this->Sk_Admin_model->get_subcategories((int)$category_id, 1);
        $this->json($subs);
    }

    public function update($id) {
        $product = $this->Sk_Product_model->get_by_id($id);
        $this->assert_product_vendor_access($product);

        $thumbnail = $this->upload_file('thumbnail', 'products') ?? $product['thumbnail'];

        $data = [
            'name'             => $this->input->post('name', TRUE),
            'category_id'      => $this->input->post('category_id'),
            'subcategory_id'   => $this->input->post('subcategory_id') ?: null,
            'brand_id'         => $this->input->post('brand_id') ?: null,
            'sku'              => $this->input->post('sku', TRUE),
            'description'      => $this->input->post('description'),
            'short_desc'       => $this->input->post('short_desc', TRUE),
            'price'            => $this->input->post('price'),
            'sale_price'       => $this->input->post('sale_price') ?: null,
            'hot_sale'         => $this->input->post('hot_sale') ? 1 : 0,
            'sale_start_at'    => $this->_normalize_datetime_input($this->input->post('sale_start_at')),
            'sale_end_at'      => $this->_normalize_datetime_input($this->input->post('sale_end_at')),
            'stock'            => $this->input->post('stock'),
            'weight'           => $this->input->post('weight') ?: null,
            'featured'         => $this->input->post('featured') ? 1 : 0,
            'nav_featured'     => $this->input->post('nav_featured') ? 1 : 0,
            'special_product'  => $this->input->post('special_product') ? 1 : 0,
            'status'           => $this->input->post('status'),
            'meta_title'       => $this->input->post('meta_title', TRUE),
            'meta_desc'        => $this->input->post('meta_desc', TRUE),
            'meta_keywords'    => $this->input->post('meta_keywords', TRUE),
            'og_image'         => $this->input->post('og_image', TRUE),
            'tags'             => $this->input->post('tags', TRUE),
            'thumbnail'        => $thumbnail,
            // Saree attributes
            'saree_type'       => $this->input->post('saree_type', TRUE) ?: null,
            'fabric'           => $this->input->post('fabric', TRUE) ?: null,
            'occasion'         => $this->input->post('occasion', TRUE) ?: null,
            'work_type'        => $this->input->post('work_type', TRUE) ?: null,
            'color'            => $this->input->post('color', TRUE) ?: null,
            'color_hex'        => $this->input->post('color_hex', TRUE) ?: null,
            'color2'           => $this->input->post('color2', TRUE) ?: null,
            'saree_length'     => $this->input->post('saree_length') ?: 5.50,
            'blouse_included'  => $this->input->post('blouse_included') ? 1 : 0,
            'blouse_length'    => $this->input->post('blouse_length') ?: 0.80,
            'set_contains'        => $this->input->post('set_contains', TRUE) ?: null,
            'border_type'         => $this->input->post('border_type', TRUE) ?: null,
            'transparency'        => $this->input->post('transparency') ?: 'opaque',
            'wash_care'           => $this->input->post('wash_care', TRUE) ?: null,
            'origin_state'        => $this->input->post('origin_state', TRUE) ?: null,
            'weave_type'          => $this->input->post('weave_type', TRUE) ?: null,
            'net_weight'          => $this->input->post('net_weight') ?: null,
            'zari_type'           => $this->input->post('zari_type', TRUE) ?: null,
            'suitable_for'        => $this->input->post('suitable_for', TRUE) ?: null,
            'return_policy'       => $this->input->post('return_policy') ?: null,
            'shipping_info'       => $this->input->post('shipping_info') ?: null,
            // ── New catalogue fields ─────────────────────────────────────
            'subtitle'            => $this->input->post('subtitle', TRUE) ?: null,
            'model_name'          => $this->input->post('model_name', TRUE) ?: null,
            'listing_status'      => $this->input->post('listing_status') ?: 'ACTIVE',
            'min_order_qty'       => (int)($this->input->post('min_order_qty') ?: 1),
            'procurement_type'    => $this->input->post('procurement_type', TRUE) ?: 'IN_STOCK',
            'procurement_sla'     => (int)($this->input->post('procurement_sla') ?: 2),
            'package_length'      => $this->input->post('package_length') ?: null,
            'package_breadth'     => $this->input->post('package_breadth') ?: null,
            'package_height'      => $this->input->post('package_height') ?: null,
            'hsn_code'            => $this->input->post('hsn_code', TRUE) ?: null,
            'tax_code'            => $this->input->post('tax_code', TRUE) ?: null,
            'manufacturer_name'   => $this->input->post('manufacturer_name', TRUE) ?: null,
            'manufacturer_address'=> $this->input->post('manufacturer_address', TRUE) ?: null,
            'style_code'          => $this->input->post('style_code', TRUE) ?: null,
            'ean'                 => $this->input->post('ean', TRUE) ?: null,
            'sizes'               => $this->input->post('sizes', TRUE) ?: null,
            'brand_color'         => $this->input->post('brand_color', TRUE) ?: null,
            'pattern'             => $this->input->post('pattern', TRUE) ?: null,
            'fit_type'            => $this->input->post('fit_type', TRUE) ?: null,
            'neck_type'           => $this->input->post('neck_type', TRUE) ?: null,
            'sleeve_length'       => $this->input->post('sleeve_length', TRUE) ?: null,
            'length_type'         => $this->input->post('length_type', TRUE) ?: null,
            'pack_of'             => (int)($this->input->post('pack_of') ?: 1),
            'pattern_type'        => $this->input->post('pattern_type', TRUE) ?: null,
            'pattern_coverage'    => $this->input->post('pattern_coverage', TRUE) ?: null,
            'ornamentation'       => $this->input->post('ornamentation', TRUE) ?: null,
            'features'            => $this->_encode_features($this->input->post('features', TRUE)),
            'category_attributes' => $this->_encode_json($this->input->post('category_attributes', TRUE)),
            'colors_json'         => $this->_build_colors_json($product['colors_json'] ?? []),
        ];
        $cv = $this->input->post('color_variants') ?? [];
        if (!empty($cv[0]['name'])) { $data['color'] = $cv[0]['name']; $data['color_hex'] = $cv[0]['hex'] ?? ''; }
        if (!empty($cv[1]['name'])) $data['color2'] = $cv[1]['name'];

        $this->Sk_Product_model->update($id, $data);

        if (!empty($_FILES['images']['name'][0])) {
            $this->_save_product_images($id);
        }

        $this->_clear_product_api_cache();
        $this->session->set_flashdata('success', 'Product updated successfully.');
        redirect('admin/products');
    }

    public function delete($id) {
        $product = $this->Sk_Product_model->get_by_id($id);
        $this->assert_product_vendor_access($product);
        $this->Sk_Product_model->delete($id);
        $this->_clear_product_api_cache();
        $this->json(['success' => true]);
    }

    public function toggle($id) {
        $product = $this->Sk_Product_model->get_by_id($id);
        if (!$product) $this->json(['success' => false]);
        $this->assert_product_vendor_access($product);
        $new = $product['status'] === 'active' ? 'inactive' : 'active';
        $this->Sk_Product_model->update($id, ['status' => $new]);
        $this->_clear_product_api_cache();
        $this->json(['success' => true, 'status' => $new]);
    }

    public function delete_image($image_id, $product_id) {
        $product = $this->Sk_Product_model->get_by_id($product_id);
        $this->assert_product_vendor_access($product);
        $this->Sk_Product_model->delete_image((int)$image_id, (int)$product_id);
        $this->json(['success' => true]);
    }

    private function _clear_product_api_cache() {
        $dir = APPPATH . 'cache/api/';
        if (!is_dir($dir)) return;
        foreach (glob($dir . 'product*.json') as $f) @unlink($f);
        foreach (glob($dir . 'products*.json') as $f) @unlink($f);
    }

    private function _save_product_images($product_id) {
        $total = count($_FILES['images']['name']);
        for ($i = 0; $i < $total; $i++) {
            if ($_FILES['images']['error'][$i] !== UPLOAD_ERR_OK) continue;
            $_FILES['image_single'] = [
                'name'     => $_FILES['images']['name'][$i],
                'type'     => $_FILES['images']['type'][$i],
                'tmp_name' => $_FILES['images']['tmp_name'][$i],
                'error'    => $_FILES['images']['error'][$i],
                'size'     => $_FILES['images']['size'][$i],
            ];
            $img = $this->upload_file('image_single', 'products');
            if ($img) {
                $this->Sk_Product_model->save_images($product_id, [['image' => $img, 'sort_order' => $i]]);
            }
        }
    }

    private function _normalize_datetime_input($value) {
        $value = trim((string)$value);
        if ($value === '') return null;
        $ts = strtotime($value);
        return $ts ? date('Y-m-d H:i:s', $ts) : null;
    }

    /** Convert newline-separated feature text to JSON array. */
    private function _encode_features($text) {
        if (!$text) return null;
        $lines = array_filter(array_map('trim', explode("\n", $text)));
        return $lines ? json_encode(array_values($lines)) : null;
    }

    /** Build colors_json from posted color_variants + uploaded swatch images. */
    private function _build_colors_json($existing_colors = []) {
        $variants = $this->input->post('color_variants') ?? [];
        if (empty($variants)) return null;

        $total_files = count($_FILES['color_variant_images']['name'] ?? []);
        $colors = [];
        $file_idx = 0;

        foreach ($variants as $i => $v) {
            $name = trim($v['name'] ?? '');
            if ($name === '') { $file_idx++; continue; }

            $hex   = $v['hex']  ?? '';
            $image = $v['existing_image'] ?? ($existing_colors[$i]['image'] ?? '');

            // Upload new swatch image if provided
            if ($file_idx < $total_files && $_FILES['color_variant_images']['error'][$file_idx] === UPLOAD_ERR_OK) {
                $_FILES['cv_img_single'] = [
                    'name'     => $_FILES['color_variant_images']['name'][$file_idx],
                    'type'     => $_FILES['color_variant_images']['type'][$file_idx],
                    'tmp_name' => $_FILES['color_variant_images']['tmp_name'][$file_idx],
                    'error'    => $_FILES['color_variant_images']['error'][$file_idx],
                    'size'     => $_FILES['color_variant_images']['size'][$file_idx],
                ];
                $uploaded = $this->upload_file('cv_img_single', 'products');
                if ($uploaded) $image = $uploaded;
            }
            $file_idx++;

            $colors[] = ['name' => $name, 'hex' => $hex, 'image' => $image];
        }

        return $colors ? json_encode($colors, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null;
    }

    /** Store arbitrary text as JSON (pass-through if already valid JSON). */
    private function _encode_json($text) {
        if (!$text) return null;
        json_decode($text);
        return json_last_error() === JSON_ERROR_NONE ? $text : null;
    }

    private function _summernote_init_js() {
        return <<<'JS'
<script>
(function() {
  /* ── Register font families ── */
  var Font = Quill.import('formats/font');
  Font.whitelist = ['serif', 'monospace', 'sans-serif'];
  Quill.register(Font, true);

  /* ── Register inline font sizes via style attribute ── */
  var SizeStyle = Quill.import('attributors/style/size');
  SizeStyle.whitelist = ['10px','12px','14px','16px','18px','20px','24px','28px','32px','36px','48px'];
  Quill.register(SizeStyle, true);

  var SIZES  = ['10px','12px','14px','16px','18px','20px','24px','28px','32px','36px','48px'];
  var FONTS  = ['sans-serif','serif','monospace'];

  var toolbarFull = [
    [{ font: FONTS }, { size: SIZES }],
    [{ header: [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean']
  ];

  var toolbarCompact = [
    [{ font: FONTS }, { size: SIZES }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ];

  function imageHandler(quill) {
    var fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/*');
    fileInput.click();
    fileInput.onchange = function() {
      var file = fileInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        var range = quill.getSelection(true);
        quill.insertEmbed(range ? range.index : 0, 'image', e.target.result, Quill.sources.USER);
      };
      reader.readAsDataURL(file);
    };
  }

  function makeEditor(wrapperId, inputName, toolbar, largeClass) {
    var wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    if (largeClass) wrapper.classList.add('ql-editor-lg');

    var input = document.querySelector('input[name="' + inputName + '"]');
    var initial = input ? input.value : '';

    var quill = new Quill(wrapper, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: toolbar,
          handlers: {
            image: function() { imageHandler(quill); }
          }
        }
      }
    });

    /* Pre-load existing HTML */
    if (initial && initial.trim()) {
      quill.clipboard.dangerouslyPasteHTML(0, initial);
    }

    /* Sync to hidden input on every keystroke */
    quill.on('text-change', function() {
      if (input) input.value = wrapper.querySelector('.ql-editor').innerHTML;
    });

    /* Final sync on form submit */
    var form = wrapper.closest('form');
    if (form && !form._qlBound) {
      form._qlBound = true;
      form.addEventListener('submit', function() {
        document.querySelectorAll('[id^="quill-"]').forEach(function(el) {
          var name = el.id.replace('quill-', '').replace(/-/g, '_');
          var inp  = document.querySelector('input[name="' + name + '"]');
          var ed   = el.querySelector('.ql-editor');
          if (inp && ed) inp.value = ed.innerHTML;
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    makeEditor('quill-short-desc',    'short_desc',    toolbarCompact, false);
    makeEditor('quill-description',   'description',   toolbarFull,    true);
    makeEditor('quill-return-policy', 'return_policy', toolbarCompact, false);
    makeEditor('quill-shipping-info', 'shipping_info', toolbarCompact, false);

    /* ── Color variant rows ── */
    var colorList  = document.getElementById('color-variants-list');
    var countInput = document.getElementById('color_variant_count');
    var addBtn     = document.getElementById('add-color-variant');

    function getNextIndex() {
      var rows = colorList ? colorList.querySelectorAll('.color-variant-row') : [];
      return rows.length;
    }

    if (addBtn && colorList) {
      addBtn.addEventListener('click', function() {
        var idx = getNextIndex();
        var row = document.createElement('div');
        row.className = 'color-variant-row d-flex gap-2 align-items-end mb-2';
        row.innerHTML =
          '<div style="flex:2"><input type="text" name="color_variants['+idx+'][name]" class="form-control form-control-sm" placeholder="Color name"></div>' +
          '<div style="flex:0 0 44px"><input type="color" name="color_variants['+idx+'][hex]" class="form-control form-control-color form-control-sm w-100" value="#cccccc"></div>' +
          '<div style="flex:3"><input type="file" name="color_variant_images[]" class="form-control form-control-sm" accept="image/*"></div>' +
          '<button type="button" class="btn btn-sm btn-outline-danger remove-color-row" style="flex:0 0 auto"><i class="bi bi-trash"></i></button>';
        colorList.appendChild(row);
        if (countInput) countInput.value = getNextIndex();
      });
      colorList.addEventListener('click', function(e) {
        var btn = e.target.closest('.remove-color-row');
        if (btn) { btn.closest('.color-variant-row').remove(); if (countInput) countInput.value = getNextIndex(); }
      });
    }
  });
})();
</script>
JS;
    }
}
