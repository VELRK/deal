<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Inventory extends Sk_Base {

    public function index() {
        // Repair bad negative stock so products are not stuck unpurchasable at -N
        if ($this->input->get('fix_stock') === '1') {
            $fixed = $this->Sk_Product_model->clamp_negative_stocks();
            $this->session->set_flashdata('success',
                $fixed > 0
                    ? "Fixed {$fixed} negative stock value(s). Set real quantities via Edit product if items should be sellable."
                    : 'No negative stock values found.');
            redirect('shopkart/inventory');
            return;
        }

        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 20;
        $offset = ($page - 1) * $limit;
        $vendor_id = $this->current_vendor_id() ?: ((int)$this->input->get('vendor_id') ?: null);

        $filters = [
            'search'      => $this->input->get('search', TRUE),
            'low_only'    => $this->input->get('low_only') === '1',
            'vendor_id'   => $vendor_id,
            'category_id' => (int)$this->input->get('category_id') ?: null,
        ];

        $result = $this->Sk_Product_model->get_inventory_list($filters, $limit, $offset);
        $negCount = (int)$this->db->where('stock <', 0)->count_all_results('products');

        $data['title']    = 'Inventory';
        $data['rows']     = $result['rows'];
        $data['total']    = $result['total'];
        $data['page']     = $page;
        $data['limit']    = $limit;
        $data['filters']  = $filters;
        $data['vendor_id']= $vendor_id;
        $data['neg_count']= $negCount;
        $data['categories'] = $this->Sk_Admin_model->get_categories(1);
        if ($this->is_super_admin()) {
            $data['vendors'] = $this->Sk_Vendor_model->get_all(['status' => 'approved'], 200, 0)['rows'];
        }
        $this->render('inventory/index', $data);
    }

    public function view($id) {
        $id = (int)$id;
        $product = $this->Sk_Product_model->get_by_id($id);
        if (!$product) {
            show_404();
        }
        $this->assert_product_vendor_access($product);

        // attach_variants overwrites stock with default pack — restore true product total
        $stockRow = $this->db->select('stock')->where('id', $id)->get('products')->row();
        if ($stockRow) {
            $product['stock'] = (int)$stockRow->stock;
        }

        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 20;
        $offset = ($page - 1) * $limit;
        $orders = $this->Sk_Order_model->get_orders_for_product($id, $limit, $offset);

        $data['title']       = 'Inventory — ' . ($product['name'] ?? '');
        $data['product']     = $product;
        $data['order_rows']  = $orders['rows'];
        $data['order_total'] = $orders['total'];
        $data['page']        = $page;
        $data['limit']       = $limit;
        $this->render('inventory/view', $data);
    }

    /**
     * Inline stock update from Inventory list/detail.
     * POST: product_id, stock, variant_id? (optional)
     */
    public function update_stock() {
        $productId = (int)$this->input->post('product_id');
        $variantId = (int)$this->input->post('variant_id');
        $stock     = (int)$this->input->post('stock');
        if ($stock < 0) {
            $stock = 0;
        }

        $product = $this->Sk_Product_model->get_by_id($productId);
        if (!$product) {
            return $this->json(['success' => false, 'message' => 'Product not found.'], 404);
        }
        $this->assert_product_vendor_access($product);

        $this->load->model('Sk_Product_variant_model');

        if ($variantId > 0) {
            if (!$this->Sk_Product_variant_model->schema_ready()) {
                return $this->json(['success' => false, 'message' => 'Variants not available.']);
            }
            $variant = $this->Sk_Product_variant_model->get_by_id($variantId);
            if (!$variant || (int)$variant['product_id'] !== $productId) {
                return $this->json(['success' => false, 'message' => 'Variant not found.'], 404);
            }
            $this->db->where('id', $variantId)
                     ->where('product_id', $productId)
                     ->update('product_variants', ['stock' => $stock]);
            $this->Sk_Product_model->sync_product_stock_from_variants($productId);
            $productStock = (int)($this->db->select('stock')->where('id', $productId)->get('products')->row()->stock ?? 0);
            return $this->json([
                'success'       => true,
                'message'       => 'Variant stock updated.',
                'variant_id'    => $variantId,
                'variant_stock' => $stock,
                'product_stock' => $productStock,
            ]);
        }

        // No variants (or updating product-level when no packs): set product stock directly
        $hasVariants = $this->Sk_Product_variant_model->schema_ready()
            && (int)$this->db->where('product_id', $productId)->count_all_results('product_variants') > 0;
        if ($hasVariants) {
            return $this->json([
                'success' => false,
                'message' => 'This product has variants. Update stock on each pack row, not the main total.',
            ], 400);
        }

        $this->db->where('id', $productId)->update('products', ['stock' => $stock]);
        return $this->json([
            'success'       => true,
            'message'       => 'Stock updated.',
            'product_stock' => $stock,
        ]);
    }
}
