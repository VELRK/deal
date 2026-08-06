import axios from "axios";
import { forceLogout } from "@/store/authStore";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/shopkart-api";

const http = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT + guest session ID to every request
http.interceptors.request.use((config) => {
  // FormData must not keep default application/json — browser sets multipart boundary
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    const h = config.headers;
    if (h && typeof (h as { delete?: (k: string) => void }).delete === "function") {
      (h as { delete: (k: string) => void }).delete("Content-Type");
    } else if (h) {
      delete (h as Record<string, unknown>)["Content-Type"];
      delete (h as Record<string, unknown>)["content-type"];
    }
  }

  // Prefer sk_token; fall back to zustand persist so JWT survives reloads
  let token = localStorage.getItem("sk_token");
  if (!token) {
    try {
      const raw = localStorage.getItem("sk-auth");
      const parsed = raw ? JSON.parse(raw) : null;
      token = parsed?.state?.token ?? null;
      if (token) localStorage.setItem("sk_token", token);
    } catch {
      /* ignore */
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Backup header when Apache strips Authorization
    config.headers["X-Auth-Token"] = `Bearer ${token}`;
  }

  let sid = localStorage.getItem("sk_sid");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem("sk_sid", sid);
  }
  config.headers["X-Session-ID"] = sid;
  return config;
});

// Clear full auth session on 401 (token + zustand) so account pages cannot stay open
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      forceLogout();
    }
    if (err.response?.status === 429) {
      err.message = "Too many requests. Please wait a moment and try again.";
    }
    return Promise.reject(err);
  },
);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  ean?: string;
  subtitle?: string;
  model_name?: string;
  price: number;
  sale_price?: number;
  stock: number;
  min_order_qty?: number;
  procurement_type?: string;
  procurement_sla?: number;
  thumbnail?: string;
  images?: { id: number; image: string; alt?: string; sort_order: number }[];
  videos?: { id: number; url: string; title?: string }[];
  description?: string;
  short_desc?: string;
  features?: string[];
  category_attributes?: Record<string, string>;
  category_id: number;
  category_name?: string;
  brand_id?: number;
  brand_name?: string;
  featured: number;
  status: string;
  listing_status?: string;
  avg_rating: number;
  review_count: number;
  total_sold: number;
  tags?: string;
  // Packaging
  weight?: number;
  package_length?: number;
  package_breadth?: number;
  package_height?: number;
  hsn_code?: string;
  tax_code?: string;
  manufacturer_name?: string;
  manufacturer_address?: string;
  style_code?: string;
  // Fashion attributes
  sizes?: string[];
  brand_color?: string;
  pattern?: string;
  fit_type?: string;
  neck_type?: string;
  sleeve_length?: string;
  length_type?: string;
  pack_of?: number;
  pattern_type?: string;
  pattern_coverage?: string;
  ornamentation?: string;
  // Saree attributes
  saree_type?: string;
  fabric?: string;
  occasion?: string;
  work_type?: string;
  color?: string;
  color_hex?: string;
  color2?: string;
  saree_length?: number;
  blouse_included?: number;
  blouse_length?: number;
  set_contains?: string;
  border_type?: string;
  transparency?: string;
  wash_care?: string;
  origin_state?: string;
  weave_type?: string;
  net_weight?: number;
  zari_type?: string;
  suitable_for?: string;
  return_policy?: string;
  shipping_info?: string;
  meta_title?: string;
  meta_desc?: string;
  meta_keywords?: string;
  og_image?: string;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
  };
  colors_json?: { name: string; hex?: string; image?: string }[];
  related?: ApiProduct[];
  // Unit variants (kg, gram, box, etc.)
  variants?: ProductVariant[];
  unit_label?: string;
  unit_name?: string;
  unit_symbol?: string;
  unit_value?: number;
  default_variant_id?: number;
  variant_count?: number;
}

export interface ProductVariant {
  id: number;
  product_id?: number;
  unit_id: number;
  label: string;
  unit_value: number;
  unit_name?: string;
  unit_symbol?: string;
  unit_type?: string;
  price: number;
  sale_price?: number | null;
  effective_price?: number;
  sale_active?: number;
  stock: number;
  sku?: string;
  image?: string | null;
  image_url?: string;
  is_default?: number;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  mega_group?: string;     // Group name for mega menu columns
  category_id?: number;   // present on subcategories
  image?: string;
  image_url?: string;
  nav_products?: Array<{
    id: number;
    name: string;
    slug: string;
    thumbnail?: string;
    thumbnail_url?: string;
    price: number;
    sale_price?: number;
  }>;
  product_count?: number;
  children?: ApiCategory[]; // subcategories nested inside
}

export interface CartItem {
  cart_id: number;
  product_id: number;
  variant_id?: number | null;
  variant_label?: string | null;
  unit_label?: string | null;
  unit_id?: number | null;
  unit_name?: string | null;
  unit_symbol?: string | null;
  unit_value?: number | null;
  product_name?: string;
  name: string;
  category_id?: number | null;
  category_name?: string | null;
  sku?: string | null;
  price: number;
  sale_price?: number;
  effective_price?: number;
  thumbnail?: string;
  slug?: string;
  stock?: number;
  quantity: number;
  subtotal: number;
  created_at?: string;
  added_at?: string;
}

export interface RoyaltyCartInfo {
  enabled: boolean;
  points: number;
  balance_rm: number;
  min_redeem_points: number;
  min_redeem_rm?: number;
  can_redeem: boolean;
  show_on_cart: boolean;
  conversion_label?: string;
  earn_label?: string;
  hint?: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  royalty?: RoyaltyCartInfo;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface ApiAddress {
  id: number;
  full_name: string;
  company_name?: string | null;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: number;
  label?: string;
  address_type?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

type AuthResponse = { success: boolean; message: string; data: { token: string; user: ApiUser } };

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    http.post<AuthResponse>("/login", data),
  register: (data: { name: string; email: string; password: string; phone?: string; address?: { line1: string; city?: string; state?: string; pincode?: string } }) =>
    http.post<AuthResponse>("/register", data),
  checkAvailability: (data: { email?: string; phone?: string }) =>
    http.post<{
      success: boolean;
      message: string;
      data: {
        email?: { available: boolean; message: string } | null;
        phone?: { available: boolean; message: string } | null;
      };
    }>("/check-availability", data),
  forgotPassword: (data: { email: string }) =>
    http.post<{ success: boolean; message: string; data?: { dev_code?: string } }>("/forgot-password", data),
  verifyResetCode: (data: { email: string; code: string }) =>
    http.post<{ success: boolean; message: string; data: { reset_token: string } }>("/forgot-password/verify", data),
  resetPassword: (data: { email: string; reset_token: string; password: string; password_confirmation: string }) =>
    http.post<{ success: boolean; message: string }>("/reset-password", data),
  otpRequest: (data: { phone: string }) =>
    http.post<{ success: boolean; message: string }>("/otp-request", data),
  otpVerify: (data: { phone: string; otp: string }) =>
    http.post<AuthResponse>("/otp-verify", data),
};

// ── Products ──────────────────────────────────────────────────────────────────

export interface ProductFilters {
  q?: string;
  category_id?: number | string;
  subcategory_id?: number | string;
  category_slug?: string;
  brand_id?: number | string;
  featured?: number | string;
  nav_featured?: number | string;
  special_product?: number | string;
  min_price?: number | string;
  max_price?: number | string;
  sort?: string;
  fabric?: string;
  saree_type?: string;
  occasion?: string;
  page?: number;
  limit?: number;
}

export const productsAPI = {
  getAll: (params?: ProductFilters) =>
    http.get<{ success: boolean; data: { products: ApiProduct[]; total: number; page: number; total_pages: number } }>("/products", { params }),
  getOne: (slug: string) =>
    http.get<{ success: boolean; data: ApiProduct }>(`/product/${slug}`),
  search: (q: string) =>
    http.get<{ success: boolean; data: ApiProduct[] }>("/search", { params: { q } }),
};

// ── Categories ────────────────────────────────────────────────────────────────

export const categoriesAPI = {
  getAll: () => http.get<{ success: boolean; data: ApiCategory[] }>("/categories"),
};

// ── Cart ──────────────────────────────────────────────────────────────────────

export const cartAPI = {
  get: () =>
    http.get<{ success: boolean; data: { items: CartItem[]; summary: CartSummary } }>("/cart"),
  /** Mobile-friendly alias: my cart products with details */
  products: () =>
    http.get<{ success: boolean; data: { items: CartItem[]; summary: CartSummary } }>("/cart/products"),
  suggestions: (params?: { limit?: number }) =>
    http.get<{ success: boolean; data: { products: ApiProduct[]; based_on: Array<Record<string, unknown>> } }>(
      "/cart/suggestions",
      { params },
    ),
  add: (data: { product_id: number; quantity: number; variant_id?: number }) =>
    http.post<{ success: boolean; data: { items: CartItem[]; summary: CartSummary } }>("/cart/add", data),
  update: (data: { product_id: number; quantity: number; variant_id?: number }) =>
    http.post<{ success: boolean; data: { items: CartItem[]; summary: CartSummary } }>("/cart/update", data),
  remove: (data: { product_id: number; variant_id?: number }) =>
    http.post<{ success: boolean; data: { items: CartItem[]; summary: CartSummary } }>("/cart/remove", data),
  clear: () => http.post("/cart/clear", {}),
  /** Merge guest session cart into logged-in user cart */
  merge: (data?: { session_id?: string }) =>
    http.post<{ success: boolean; data: { merged: number; items: CartItem[]; summary: CartSummary } }>(
      "/cart/merge",
      data ?? {},
    ),
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const wishlistAPI = {
  get: () => http.get("/wishlist"),
  toggle: (data: { product_id: number }) => http.post("/wishlist/toggle", data),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersAPI = {
  checkout: (data: object) => http.post("/checkout", data),
  getAll: () => http.get("/orders"),
  getOne: (id: number) => http.get(`/order/${id}`),
  cancelOrder: (id: number) => http.post(`/order/${id}/cancel`, {}),
};

export interface ShippingTrackEvent {
  time?: string;
  desc?: string;
  label?: string;
}

export interface ShippingTrackResult {
  order_number?: string | null;
  tracking_number?: string | null;
  order_status?: string | null;
  courier?: string;
  courier_status?: string | null;
  processing_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  has_tracking?: boolean;
  tracks?: unknown[];
  events?: ShippingTrackEvent[];
  message?: string;
}

export const shippingAPI = {
  track: (data: { tracking_number?: string; order_number?: string; bill_code?: string; awb?: string }) =>
    http.post<{ success: boolean; message?: string; data: ShippingTrackResult }>("/shipping/track", data),
};

// ── Payment ───────────────────────────────────────────────────────────────────

export const paymentAPI = {
  createOrder: (data: { order_id: number }) => http.post("/payment/create-order", data),
  verify: (data: object) => http.post("/payment/verify", data),
  verifyWalletTopup: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    reference: string;
  }) => http.post("/payment/wallet-topup-verify", data),
};

// ── Promo ─────────────────────────────────────────────────────────────────────

export const promoAPI = {
  apply: (data: { code: string; order_amount: number }) => http.post("/apply-coupon", data),
};

// ── User ──────────────────────────────────────────────────────────────────────

export const userAPI = {
  profile: () => http.get<{ success: boolean; data: ApiUser }>("/user/profile"),
  updateProfile: (data: object) => http.put("/user/profile", data),
  dashboard: () => http.get("/user/dashboard"),
  changePassword: (data: { current_password: string; new_password: string; confirm_password: string }) =>
    http.post("/user/change-password", data),
  getAddresses: () => http.get<{ success: boolean; data: ApiAddress[] }>("/user/addresses"),
  saveAddress: (data: object) => http.post("/user/addresses", data),
  deleteAddress: (id: number) => http.delete(`/user/addresses/${id}`),
  getWallet: () => http.get<{
    success: boolean;
    data: {
      enabled: boolean;
      balance: number;
      discount_percent: number;
      /** Free delivery when paying full order with wallet */
      free_shipping?: boolean;
      points?: number;
      royalty?: RoyaltyCartInfo;
    };
  }>("/user/wallet"),
  getRoyalty: () => http.get<{
    success: boolean;
    data: RoyaltyCartInfo & {
      points_per_rm?: number;
      hint?: string;
    };
  }>("/user/royalty"),
  getRoyaltyTransactions: (params?: { limit?: number; offset?: number }) =>
    http.get<{
      success: boolean;
      data: {
        rows: Array<{
          id: number;
          user_id: number;
          type: "earn" | "redeem";
          points: number;
          amount_rm: number;
          balance_after_points: number;
          reference: string;
          description: string;
          created_at: string;
        }>;
        transactions?: Array<{
          id: number;
          user_id: number;
          type: "earn" | "redeem";
          points: number;
          amount_rm: number;
          balance_after_points: number;
          reference: string;
          description: string;
          created_at: string;
        }>;
        total: number;
      };
    }>("/user/royalty/transactions", { params }),
  getWalletTransactions: (params?: { limit?: number; offset?: number }) =>
    http.get<{
      success: boolean;
      data: {
        rows: Array<{
          id: number;
          wallet_id: number;
          user_id: number;
          type: "credit" | "debit";
          amount: number;
          balance_after: number;
          source: "admin_add" | "order_payment" | "refund" | "promo" | "adjustment" | "topup";
          reference: string;
          description: string;
          created_at: string;
        }>;
        transactions?: Array<{
          id: number;
          wallet_id: number;
          user_id: number;
          type: "credit" | "debit";
          amount: number;
          balance_after: number;
          source: string;
          reference: string;
          description: string;
          created_at: string;
        }>;
        total: number;
      };
    }>("/user/wallet/transactions", { params }),
  topupWallet: (data: { amount: number }) =>
    http.post<{
      success: boolean;
      message: string;
      data: {
        gateway?: "razorpay" | "toyyibpay" | "sandbox";
        reference?: string;
        amount_rm?: number;
        points?: number;
        payment_url?: string | null;
        bill_code?: string | null;
        credited?: boolean;
        balance?: number;
        razorpay_order_id?: string;
        amount?: number;
        currency?: string;
        key_id?: string;
        prefill?: { name: string; email: string; contact: string };
      };
    }>("/user/wallet/topup", data),
};

export const affiliateAPI = {
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    promo_code?: string;
  }) => http.post("/affiliate/register", data),
  checkPromo: (code: string) =>
    http.get<{ success: boolean; data: { available: boolean } }>(
      `/affiliate/check-promo?code=${encodeURIComponent(code)}`,
    ),
  submitEnquiry: (data: {
    name: string;
    email: string;
    phone: string;
    promo_code?: string;
    message: string;
  }) =>
    http.post<{ success: boolean; message: string; data?: { id: number; status: string } }>(
      "/affiliate/enquiry",
      data,
    ),
};

export interface ApiBanner {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  cta_text: string;
  cta_link: string;
  image: string;
  image_url: string;
  sort_order: number;
  status: number;
}

export const bannersAPI = {
  getAll: () => http.get<{ success: boolean; data: ApiBanner[] }>("/banners"),
  getOffer: () => http.get<{ success: boolean; data: ApiBanner | null }>("/offer-banner"),
  getCollection: () => http.get<{ success: boolean; data: ApiBanner[] }>("/collection-banners"),
};

// ── Testimonials ──────────────────────────────────────────────────────────────

export interface ApiTestimonial {
  id: number;
  author_name: string;
  author_title?: string;
  quote: string;
  rating: number;
  product_id?: number;
  product_name?: string;
  product_slug?: string;
  product_price?: number;
  product_sale_price?: number;
  product_thumbnail?: string;
  product_image_url?: string;
}

export const testimonialsAPI = {
  getAll: () => http.get<{ success: boolean; data: ApiTestimonial[] }>("/testimonials"),
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface ApiReview {
  id: number;
  rating: number;
  title?: string;
  body: string;
  user_name: string;
  created_at: string;
  images?: ApiReviewMedia[];
  videos?: ApiReviewMedia[];
  media?: ApiReviewMedia[];
}

export interface ApiReviewMedia {
  id?: number;
  media_type: "image" | "video";
  file_path?: string;
  url: string;
}

export interface ApiReviewEligibility {
  can_review: boolean;
  reason?: "login_required" | "purchase_required" | "already_reviewed";
  message?: string;
  order_id?: number;
}

export const reviewsAPI = {
  getByProduct: (productId: number) =>
    http.get<{ success: boolean; data: ApiReview[] }>(`/product/${productId}/reviews`),
  getEligibility: (productId: number) =>
    http.get<{ success: boolean; data: ApiReviewEligibility }>(`/product/${productId}/reviews/eligibility`),
  submit: (data: {
    product_id: number;
    rating: number;
    title?: string;
    body: string;
    images?: File[];
    video?: File | null;
  }) => {
    const hasMedia = (data.images && data.images.length > 0) || !!data.video;
    if (!hasMedia) {
      return http.post<{ success: boolean; message: string; data?: { id?: number; media?: ApiReviewMedia[] } }>("/reviews", {
        product_id: data.product_id,
        rating: data.rating,
        title: data.title,
        body: data.body,
      });
    }
    const fd = new FormData();
    fd.append("product_id", String(data.product_id));
    fd.append("rating", String(data.rating));
    if (data.title) fd.append("title", data.title);
    fd.append("body", data.body);
    (data.images ?? []).slice(0, 5).forEach((file) => {
      fd.append("images[]", file, file.name);
    });
    if (data.video) fd.append("video", data.video, data.video.name);
    // Do not set Content-Type — axios/browser must add multipart boundary
    return http.post<{ success: boolean; message: string; data?: { id?: number; media?: ApiReviewMedia[] } }>("/reviews", fd);
  },
};

// ── Contact ───────────────────────────────────────────────────────────────────

export const contactAPI = {
  send: (data: { name: string; email: string; message: string }) =>
    http.post<{ success: boolean; message: string }>("/contact", data),
};

// ── Site Settings ─────────────────────────────────────────────────────────────

export interface ApiSiteSettings {
  newsletter_popup_enabled: boolean;
  site_name?: string;
  currency_symbol?: string;
  top_bar_enabled?: boolean;
  top_bar_text?: string;
  whatsapp_enabled?: boolean;
  whatsapp_number?: string;
  tax_rate?: number;
  shipping_charge?: number;
  free_shipping_above?: number;
  /** When true, full wallet pay gets free delivery */
  wallet_free_shipping?: boolean;
  meta_title?: string;
  meta_desc?: string;
  meta_description?: string;
  meta_keywords?: string;
  seo_og_image?: string;
  head_scripts?: string;
  footer_scripts?: string;
  google_analytics?: string;
}

export interface ApiSeoPage {
  page_key?: string;
  route_path?: string;
  meta_title: string;
  meta_description: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots?: string;
  head_scripts?: string;
  footer_scripts?: string;
}

export const seoAPI = {
  getPage: (key: string) =>
    http.get<{ success: boolean; data: ApiSeoPage }>(`/seo/page/${key}`),
  getByPath: (path: string) =>
    http.get<{ success: boolean; data: ApiSeoPage }>(`/seo?path=${encodeURIComponent(path)}`),
};

export const siteSettingsAPI = {
  get: () => http.get<{ success: boolean; data: ApiSiteSettings }>("/site-settings"),
};

// ── Blog ──────────────────────────────────────────────────────────────────────
export interface ApiBlog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: string;
  tags?: string;
  image?: string;
  image_url?: string;
  meta_title?: string;
  meta_desc?: string;
  meta_keywords?: string;
  og_image?: string;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
  };
  date: string;
  created_at: string;
}

export const blogsAPI = {
  getAll: () => http.get<{ success: boolean; data: ApiBlog[] }>("/blogs"),
  getOne: (slug: string) => http.get<{ success: boolean; data: ApiBlog }>(`/blog/${slug}`),
};

export default http;
