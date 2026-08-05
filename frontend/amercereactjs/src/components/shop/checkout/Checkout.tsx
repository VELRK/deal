import { Link, useNavigate } from "react-router-dom";
import { type FormEvent, useEffect, useState, memo } from "react";
import "./Checkout.css";

import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { apiImageUrl } from "@/hooks/useApi";
import { formatPrice } from "@/utils/formatPrice";
import { useAuthStore } from "@/store/authStore";
import { userAPI, cartAPI, ordersAPI, promoAPI, paymentAPI, siteSettingsAPI } from "@/services/api";
import type { ApiAddress, RoyaltyCartInfo } from "@/services/api";
import { loadStoredPromo, saveStoredPromo } from "@/utils/promoStorage";
import { loadUseRoyalty, saveUseRoyalty } from "@/utils/royaltyStorage";
import { removeLineFromCart } from "@/utils/cartSync";

/* Razorpay global type */
declare global {
  interface Window {
    Razorpay: new (options: object) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}



export default function Checkout() {
  const { cartProducts, setCartProducts, updateQuantity, totalPrice } = useContextElement();
  const { isLoggedIn, user } = useAuthStore();
  const navigate = useNavigate();

  /* ── Saved addresses ── */
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<number>(-1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true); // true until first fetch done

  const loadAddresses = (): Promise<ApiAddress[]> => {
    if (!isLoggedIn) { setAddressLoading(false); return Promise.resolve([]); }
    setAddressLoading(true);
    return userAPI.getAddresses()
      .then((res) => {
        const list = (res.data as { data?: ApiAddress[] }).data ?? [];
        setAddresses(list);
        const defIdx = list.findIndex((a) => Number(a.is_default) === 1);
        if (defIdx >= 0) { setSelectedAddr(defIdx); applyAddress(list[defIdx]); }
        else if (list.length > 0) { setSelectedAddr(0); applyAddress(list[0]); }
        else { setSelectedAddr(-1); setShowAddForm(true); }
        return list;
      })
      .catch(() => { setShowAddForm(true); return []; })
      .finally(() => setAddressLoading(false));
  };

  // Redirect to login if not authenticated — pass return URL so they come back here
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout", { replace: true });
    }
  }, [isLoggedIn]);

  useEffect(() => { loadAddresses(); }, [isLoggedIn]);

  /* ── Address form fields ── */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // Ignore system-generated placeholder emails (ph_PHONE@2Deal.app)
  const realEmail = (email?: string) =>
    email && !email.startsWith("ph_") ? email : "";
  const [addrEmail, setAddrEmail] = useState(realEmail(user?.email));
  const [addrPhone, setAddrPhone] = useState(user?.phone ?? "");

  // Sync phone/email when user logs in
  useEffect(() => {
    if (user?.phone && !addrPhone) setAddrPhone(user.phone);
    if (user?.email && !addrEmail) setAddrEmail(realEmail(user.email));
  }, [user, addrPhone, addrEmail]);

  const [addrCity, setAddrCity] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [, setZipError] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  function applyAddress(addr: ApiAddress) {
    const parts = addr.full_name.split(" ");
    setFirstName(parts[0] ?? "");
    setLastName(parts.slice(1).join(" "));
    setAddrEmail(user?.email ?? "");
    setAddrPhone(addr.phone ?? "");
    setAddrCity(addr.city ?? "");
    setAddrStreet(`${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}`);
    setAddrState(addr.state ?? "");
    setAddrZip(addr.pincode ?? "");
    setZipError(false);
    setShowAddForm(false);
  }

  /* ── Promo code ── */
  const [promoInput, setPromoInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  /* ── Site Settings (shipping only; GST hidden on storefront) ── */
  const [shippingCharge, setShippingCharge] = useState(50);
  const [freeShippingAbove, setFreeShippingAbove] = useState(999);

  useEffect(() => {
    siteSettingsAPI.get().then(res => {
      if (res.data.success && res.data.data) {
        const s = res.data.data;
        if (typeof s.shipping_charge === 'number') setShippingCharge(s.shipping_charge);
        if (typeof s.free_shipping_above === 'number') setFreeShippingAbove(s.free_shipping_above);
      }
    }).catch(err => console.error("Failed to load site settings", err));
  }, []);

  const [walletInfo, setWalletInfo] = useState<{
    enabled: boolean;
    balance: number;
    discount_percent: number;
    points?: number;
    royalty?: RoyaltyCartInfo;
  } | null>(null);
  const [useRoyalty, setUseRoyalty] = useState(() => loadUseRoyalty());

  /* Billing address */
  const [billingSame, setBillingSame] = useState(true);
  const [billingCompany, setBillingCompany] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingStreet, setBillingStreet] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingZip, setBillingZip] = useState("");

  useEffect(() => {
    if (!isLoggedIn) { setWalletInfo(null); return; }
    let cancelled = false;
    const load = () => {
      userAPI.getWallet()
        .then((res) => {
          if (cancelled) return;
          const d = res.data?.data;
          if (d) {
            setWalletInfo(d);
            const roy = d.royalty;
            if (roy && !roy.can_redeem && useRoyalty) {
              setUseRoyalty(false);
              saveUseRoyalty(false);
            }
            return;
          }
          return userAPI.getRoyalty().then((rres) => {
            if (cancelled) return;
            const roy = rres.data?.data as RoyaltyCartInfo | undefined;
            if (roy) setWalletInfo({ enabled: false, balance: 0, discount_percent: 0, royalty: roy });
          });
        })
        .catch(() => {
          userAPI.getRoyalty()
            .then((rres) => {
              if (cancelled) return;
              const roy = rres.data?.data as RoyaltyCartInfo | undefined;
              if (roy) setWalletInfo({ enabled: false, balance: 0, discount_percent: 0, royalty: roy });
              else setWalletInfo(null);
            })
            .catch(() => { if (!cancelled) setWalletInfo(null); });
        });
    };
    load();
    return () => { cancelled = true; };
  }, [isLoggedIn, totalPrice, cartProducts.length]);

  const royaltyInfo: RoyaltyCartInfo | null = walletInfo?.royalty ?? null;

  const toggleRoyalty = (on: boolean) => {
    setUseRoyalty(on);
    saveUseRoyalty(on);
  };

  const handleApplyPromo = async (e: FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (!isLoggedIn) { setPromoError("Please log in to apply a promo code."); return; }
    setPromoLoading(true); setPromoError("");
    try {
      const res = await promoAPI.apply({ code, order_amount: totalPrice });
      const r = res.data as { success?: boolean; data?: { discount: number; code: string; source?: string }; message?: string };
      if (r.success && r.data) {
        setAppliedCode(r.data.code); setPromoDiscount(r.data.discount); setPromoInput("");
        saveStoredPromo({ code: r.data.code, discount: r.data.discount });
        if (r.data.source === 'affiliate') setPromoError("");
      } else setPromoError(r.message ?? "Invalid promo code.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPromoError(msg ?? "Invalid or expired promo code.");
    } finally { setPromoLoading(false); }
  };

  const removePromo = () => {
    setAppliedCode("");
    setPromoDiscount(0);
    setPromoError("");
    setPromoInput("");
    saveStoredPromo(null);
  };

  /* Restore promo saved from cart or auto-apply affiliate ?ref= */
  useEffect(() => {
    if (!isLoggedIn || appliedCode || totalPrice <= 0) return;

    const stored = loadStoredPromo();
    if (stored) {
      setAppliedCode(stored.code);
      setPromoDiscount(stored.discount);
      return;
    }

    const refCode = sessionStorage.getItem("sk_affiliate_ref");
    if (!refCode) return;

    let cancelled = false;
    setPromoInput(refCode);
    setPromoLoading(true);
    setPromoError("");
    promoAPI.apply({ code: refCode, order_amount: totalPrice })
      .then((res) => {
        if (cancelled) return;
        const r = res.data as { success?: boolean; data?: { discount: number; code: string; source?: string }; message?: string };
        if (r.success && r.data) {
          setAppliedCode(r.data.code);
          setPromoDiscount(r.data.discount);
          setPromoInput("");
          saveStoredPromo({ code: r.data.code, discount: r.data.discount });
        } else {
          setPromoError(r.message ?? "Invalid affiliate promo code.");
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setPromoError(msg ?? "Could not apply affiliate promo code.");
      })
      .finally(() => { if (!cancelled) setPromoLoading(false); });

    return () => { cancelled = true; };
  }, [isLoggedIn, appliedCode, totalPrice]);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay" | "wallet">(() => {
    const saved = sessionStorage.getItem("checkout_payment_method");
    return (saved === "razorpay" || saved === "wallet" ? saved : "cod") as "cod" | "razorpay" | "wallet";
  });
  useEffect(() => {
    sessionStorage.setItem("checkout_payment_method", paymentMethod);
  }, [paymentMethod]);

  const shippingCost = totalPrice <= 0 ? 0 : (totalPrice >= freeShippingAbove ? 0 : shippingCharge);
  const subtotalAfterPromo = Math.max(0, totalPrice - promoDiscount);
  const walletDiscount = paymentMethod === "wallet" && walletInfo && walletInfo.discount_percent > 0
    ? Math.round(subtotalAfterPromo * walletInfo.discount_percent / 100)
    : 0;
  // TESTING: show Apply whenever customer has any royalty points
  const billTotal = Math.max(0, subtotalAfterPromo - walletDiscount) + shippingCost;
  const royaltyEligible =
    !!royaltyInfo
    && royaltyInfo.enabled !== false
    && paymentMethod !== "wallet"
    && (
      !!royaltyInfo.show_on_cart
      || !!royaltyInfo.can_redeem
      || Number(royaltyInfo.points) > 0
    );
  const canPayWithRoyalty =
    royaltyEligible
    && billTotal > 0;
  const royaltyRm = useRoyalty && canPayWithRoyalty
    ? Math.min(Number(royaltyInfo?.balance_rm || 0), billTotal)
    : 0;
  const amountDue = Math.max(0, billTotal - royaltyRm); // remaining → COD / online
  const walletBalanceOk = !walletInfo || walletInfo.balance >= amountDue;

  /* ── Place order ── */
  const [orderError, setOrderError] = useState("");
  const [orderPlacing, setOrderPlacing] = useState(false);

  const getDeliveryAddress = () => {
    if (selectedAddr >= 0 && addresses[selectedAddr]) {
      const a = addresses[selectedAddr];
      return {
        full_name: a.full_name,
        company_name: a.company_name ?? "",
        phone: a.phone,
        line1: a.line1,
        line2: a.line2 ?? "",
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        country: a.country || "Malaysia",
      };
    }
    return {
      full_name: `${firstName} ${lastName}`.trim(),
      company_name: "",
      phone: addrPhone,
      line1: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrZip,
      country: "Malaysia",
    };
  };

  const getBillingAddress = (ship: ReturnType<typeof getDeliveryAddress>) => {
    if (billingSame) {
      return { ...ship };
    }
    return {
      full_name: billingName.trim() || ship.full_name,
      company_name: billingCompany.trim(),
      phone: billingPhone.trim() || ship.phone,
      line1: billingStreet.trim() || ship.line1,
      line2: "",
      city: billingCity.trim() || ship.city,
      state: billingState.trim() || ship.state,
      pincode: billingZip.trim() || ship.pincode,
      country: "Malaysia",
    };
  };

  const handleCheckoutSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrderError("");

    const addr = getDeliveryAddress();
    const billing = getBillingAddress(addr);
    if (!addr.full_name || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      setOrderError("Please complete the delivery address.");
      return;
    }
    if (!/^\d{5}$/.test(addr.pincode)) { setZipError(true); setOrderError("Enter a valid 5-digit postcode."); return; }
    if (!billingSame) {
      if (!billing.full_name || !billing.line1 || !billing.city || !billing.state || !billing.pincode) {
        setOrderError("Please complete the billing address.");
        return;
      }
    }

    if (!isLoggedIn) { setOrderError("Please log in to place an order."); return; }
    if (cartProducts.length === 0) { setOrderError("Your cart is empty."); return; }
    if (paymentMethod === "wallet") {
      if (!walletInfo?.enabled) { setOrderError("Wallet payments are not available."); return; }
      if (!walletBalanceOk) { setOrderError("Insufficient wallet balance for this order."); return; }
    }

    setOrderPlacing(true);
    try {
      // 1. Sync local cart → backend cart (collect every stock failure)
      type StockIssue = { name?: string; available?: number; requested?: number };
      const stockMessages: string[] = [];
      await cartAPI.clear();
      for (const item of cartProducts) {
        const title = item.name || `Product #${item.id}`;
        try {
          await cartAPI.add({
            product_id: Number(item.id),
            quantity: item.quantity,
            ...(item.selectedVariantId ? { variant_id: item.selectedVariantId } : {}),
          });
        } catch (addErr: unknown) {
          const body = (addErr as {
            response?: { data?: { message?: string; data?: { stock_issues?: StockIssue[] } } };
          })?.response?.data;
          const issues = body?.data?.stock_issues;
          if (issues && issues.length > 0) {
            for (const s of issues) {
              const label = s.name || title;
              stockMessages.push(
                `'${label}' (available ${s.available ?? 0}, requested ${s.requested ?? item.quantity})`,
              );
            }
          } else if (body?.message) {
            stockMessages.push(body.message.replace(/\.\s*$/, ""));
          } else {
            stockMessages.push(`'${title}' (requested ${item.quantity})`);
          }
        }
      }
      if (stockMessages.length > 0) {
        setOrderError(
          stockMessages.length === 1
            ? `Not enough stock for ${stockMessages[0]}.`
            : `Not enough stock for these items:\n${stockMessages.map((m) => `• ${m}`).join("\n")}`,
        );
        return;
      }

      // 2. If a promo code was applied, re-apply it to the fresh backend cart 
      // to ensure it's not lost after the cart clear/sync.
      if (appliedCode) {
        try {
          await promoAPI.apply({ code: appliedCode, order_amount: totalPrice });
        } catch (e) {
          console.error("Failed to re-apply promo code during checkout sync", e);
        }
      }

      // 3. Place order
      const res = await ordersAPI.checkout({
        address: addr,
        billing_same: billingSame,
        billing_address: billing,
        payment_method: paymentMethod,
        use_wallet: paymentMethod === "wallet" ? 1 : 0,
        use_royalty: useRoyalty && royaltyRm > 0 ? 1 : 0,
        apply_royalty: useRoyalty && royaltyRm > 0 ? 1 : 0,
        promo_code: appliedCode || undefined,
        coupon: appliedCode || undefined,
        coupon_code: appliedCode || undefined,
        discount_code: appliedCode || undefined,
        voucher: appliedCode || undefined,
        voucher_code: appliedCode || undefined,
        subtotal: totalPrice,
        discount_amount: promoDiscount,
        total: billTotal,
        note: orderNote,
      });

      const result = res.data as {
        success?: boolean;
        message?: string;
        data?: { order?: { id: number }; stock_issues?: StockIssue[] };
      };
      if (!result.success || !result.data?.order?.id) {
        if (result.data?.stock_issues?.length) {
          const parts = result.data.stock_issues.map(
            (s) => `'${s.name}' (available ${s.available ?? 0}, requested ${s.requested ?? 0})`,
          );
          setOrderError(
            parts.length === 1
              ? `Not enough stock for ${parts[0]}.`
              : `Not enough stock for these items:\n${parts.map((m) => `• ${m}`).join("\n")}`,
          );
        } else {
          setOrderError(result.message || "Failed to place order. Please try again.");
        }
        return;
      }

      const orderId = result.data.order.id;

      // ── COD, Wallet, or fully paid by royalty: done ─────────────────
      if (paymentMethod === "cod" || paymentMethod === "wallet" || amountDue <= 0.009) {
        saveStoredPromo(null);
        saveUseRoyalty(false);
        setCartProducts([]);
        navigate("/account-orders");
        return;
      }

      // ── Razorpay online payment ─────────────────────────────
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setOrderError("Failed to load payment gateway. Please try again or use Cash on Delivery.");
        return;
      }

      const payRes = await paymentAPI.createOrder({ order_id: orderId });
      const payData = (payRes.data as {
        success?: boolean; data?: {
          razorpay_order_id: string; amount: number; currency: string;
          key_id: string; order_number: string;
          prefill: { name: string; email: string; contact: string };
        }; message?: string
      });

      if (!payData.success || !payData.data?.razorpay_order_id) {
        setOrderError(payData.message ?? "Payment gateway error. Try Cash on Delivery.");
        return;
      }

      const pd = payData.data;
      const rzpOptions = {
        key: pd.key_id,
        amount: pd.amount,
        currency: pd.currency,
        order_id: pd.razorpay_order_id,
        name: "2Deal",
        description: `Order #${pd.order_number}`,
        image: "/frontend/assets/images/logo/logo.png",
        prefill: { name: pd.prefill.name, email: pd.prefill.email, contact: pd.prefill.contact },
        theme: { color: "#3EC1BC" },
        // Malaysia (Curlec): FPX is online banking — not India's "netbanking".
        method: { fpx: true, card: true, wallet: true },
        config: {
          display: {
            blocks: {
              banks: {
                name: "Net Banking (FPX)",
                instruments: [{ method: "fpx" }],
              },
              cards_wallets: {
                name: "Cards & E-Wallets",
                instruments: [{ method: "card" }, { method: "wallet" }],
              },
            },
            sequence: ["block.banks", "block.cards_wallets"],
            preferences: { show_default_blocks: true },
          },
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderId,
            });
          } catch {
            setOrderError("Payment received but verification failed. Contact support with Order #" + pd.order_number);
          }
          saveStoredPromo(null);
          saveUseRoyalty(false);
          setCartProducts([]);
          navigate("/account-orders");
        },
        modal: {
          ondismiss: () => {
            // Keep order as payment_attempt — do not cancel. Customer can pay later from Orders.
            setOrderError(
              "Payment not completed. Your order is saved as a payment attempt — complete payment from My Orders when ready."
            );
            setOrderPlacing(false);
          },
        },
      };

      new window.Razorpay(rzpOptions).open();
      return; // don't hit finally yet — Razorpay handler controls flow

    } catch (err: unknown) {
      const body = (err as {
        response?: { data?: { message?: string; data?: { stock_issues?: { name?: string; available?: number; requested?: number }[] } } };
      })?.response?.data;
      const issues = body?.data?.stock_issues;
      if (issues && issues.length > 0) {
        const parts = issues.map(
          (s) => `'${s.name}' (available ${s.available ?? 0}, requested ${s.requested ?? 0})`,
        );
        setOrderError(
          parts.length === 1
            ? `Not enough stock for ${parts[0]}.`
            : `Not enough stock for these items:\n${parts.map((m) => `• ${m}`).join("\n")}`,
        );
      } else {
        setOrderError(body?.message ?? "Order placement failed. Please try again.");
      }
    } finally { setOrderPlacing(false); }
  };

  const removeLine = (id: ProductId, variantId?: number, index?: number) => {
    removeLineFromCart(id, variantId, index);
  };
  const setQty = (id: ProductId, qty: number, variantId?: number, index?: number) => {
    if (qty < 1) {
      removeLine(id, variantId, index);
      return;
    }
    updateQuantity(id, qty, variantId);
    cartAPI
      .update({
        product_id: Number(id),
        quantity: qty,
        ...(variantId != null ? { variant_id: variantId } : {}),
      })
      .catch(() => { });
  };

  return (
    <section className="premium-checkout-wrapper animate-fade-in">


      <div className="container">
        <form onSubmit={handleCheckoutSubmit} className="row">
          {/* ── LEFT: address + payment ── */}
          <div className="col-lg-7 animate-fade-in-up delay-100">

            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="checkout-main-title">Checkout</h2>
              <Link to="/view-cart" className="back-to-cart-link">
                ← Back to Cart
              </Link>
            </div>

            {/* Not-logged-in users are redirected to /login?redirect=/checkout above */}

            <div className="checkout-card">
              <div className="checkout-header">
                <div className="icon">📍</div>
                Delivery Address
              </div>

              {/* Skeleton while addresses are loading */}
              {addressLoading && (
                <div className="mb-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="address-card skeleton-shimmer mb-3" style={{ cursor: "default" }}>
                      <div className="skeleton-line" style={{ height: 14, width: "40%", marginBottom: 10 }} />
                      <div className="skeleton-line" style={{ height: 12, width: "70%", marginBottom: 8 }} />
                      <div className="skeleton-line" style={{ height: 12, width: "55%" }} />
                    </div>
                  ))}
                </div>
              )}

              {!addressLoading && isLoggedIn && addresses.length > 0 && !showAddForm && (
                <div className="mb-4 animate-fade-in">
                  <div className="grid-2">
                    {addresses.map((a, i) => {
                      const isSelected = selectedAddr === i;
                      const labelIcon = a.label === "Work" ? "💼" : a.label === "Hotel" ? "🏨" : a.label === "Parents" ? "👨‍👩‍👧" : "🏠";
                      return (
                        <div
                          key={a.id}
                          className={`address-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => { setSelectedAddr(i); applyAddress(a); }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="fw-semibold text-dark d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                              {labelIcon} {a.label ?? "Home"}
                              {Number(a.is_default) === 1 && <span className="badge address-card-badge">Default</span>}
                            </div>
                            <div className="radio-circle">
                              {isSelected && <div className="radio-inner" />}
                            </div>
                          </div>
                          <div className="address-card-name">{a.full_name}</div>
                          <div className="address-card-details">
                            {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
                            {a.city}, {a.state} – {a.pincode}
                          </div>
                          <div className="address-card-phone">
                            📞 {a.phone}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" className="tf-btn-line-2 link mt-3" onClick={() => navigate("/account-addresses")}>
                    + Add New Address
                  </button>
                </div>
              )}

              {!addressLoading && (addresses.length === 0) && (
                <div className="address-no-data animate-fade-in">
                  <div className="address-no-data-icon">📍</div>
                  <h5 className="address-no-data-title">No Delivery Address Found</h5>
                  <p className="address-no-data-desc">Please add a delivery address to your account to continue with your order.</p>
                  <button
                    type="button"
                    className="tf-btn animate-btn w-100"
                    onClick={() => navigate("/account-addresses?redirect=/checkout")}
                  >
                    + Add Delivery Address
                  </button>
                </div>
              )}

              {!addressLoading && addresses.length > 0 && showAddForm && (
                <div className="address-no-data mb-4 animate-fade-in">
                  <p className="address-no-data-desc mb-3">To add a new address, please use your account settings.</p>
                  <button
                    type="button"
                    className="tf-btn btn-sm animate-btn"
                    onClick={() => navigate("/account-addresses?redirect=/checkout")}
                  >
                    Manage Addresses
                  </button>
                  <button type="button" className="tf-btn btn-sm ms-2" style={{ background: 'transparent', color: 'var(--ck-ink-soft)' }} onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                </div>
              )}
              <textarea className="premium-input mt-4 mb-0" placeholder="Order notes" rows={2} value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
            </div>

            <div className="checkout-card">
              <div className="checkout-header">
                <div className="icon">🧾</div>
                Billing Address
              </div>
              <label className="d-flex align-items-center gap-2 mb-3" style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={billingSame}
                  onChange={(e) => setBillingSame(e.target.checked)}
                />
                <span>Same as delivery address</span>
              </label>
              {!billingSame && (
                <div className="animate-fade-in">
                  <input className="premium-input mb-2" placeholder="Company name (optional)" value={billingCompany} onChange={(e) => setBillingCompany(e.target.value)} />
                  <input className="premium-input mb-2" placeholder="Full name *" value={billingName} onChange={(e) => setBillingName(e.target.value)} required={!billingSame} />
                  <input className="premium-input mb-2" placeholder="Phone *" value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} />
                  <input className="premium-input mb-2" placeholder="Address line *" value={billingStreet} onChange={(e) => setBillingStreet(e.target.value)} />
                  <div className="row g-2">
                    <div className="col-md-4"><input className="premium-input" placeholder="City *" value={billingCity} onChange={(e) => setBillingCity(e.target.value)} /></div>
                    <div className="col-md-4"><input className="premium-input" placeholder="State *" value={billingState} onChange={(e) => setBillingState(e.target.value)} /></div>
                    <div className="col-md-4"><input className="premium-input" placeholder="Postcode *" value={billingZip} onChange={(e) => setBillingZip(e.target.value)} /></div>
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-card">
              <div className="checkout-header">
                <div className="icon">💳</div>
                Payment Method
              </div>

              <div
                className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="radio-circle">
                    {paymentMethod === 'cod' && <div className="radio-inner" />}
                  </div>
                  <div>
                    <div className="payment-card-title">💵 Cash on Delivery</div>
                    <div className="payment-card-desc">Pay when your order arrives</div>
                  </div>
                </div>
              </div>

              <div
                className={`payment-card mb-3 ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod("razorpay")}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="radio-circle">
                    {paymentMethod === 'razorpay' && <div className="radio-inner" />}
                  </div>
                  <div>
                    <div className="payment-card-title">💳 Online Payment (Malaysia)</div>
                    <div className="payment-card-desc">Net Banking (FPX) · Credit/Debit Card · E-Wallets</div>
                  </div>
                </div>
                {paymentMethod === 'razorpay' && (
                  <div className="payment-details-razorpay animate-fade-in">
                    <div className="d-flex gap-2 flex-wrap">
                      {["Net Banking (FPX)", "Visa", "Mastercard", "Touch n Go", "GrabPay"].map((m) => (
                        <span key={m} className="payment-badge">
                          {m}
                        </span>
                      ))}
                    </div>
                    <p className="payment-secure-text mb-0">
                      Secure checkout in MYR (RM)
                      🔒 Secured by Razorpay — 256-bit SSL encryption
                    </p>
                  </div>
                )}
              </div>

              {walletInfo?.enabled && (
                <div
                  className={`payment-card mb-0 ${paymentMethod === 'wallet' ? 'selected' : ''} ${!walletBalanceOk ? 'opacity-50' : ''}`}
                  onClick={() => {
                    if (walletBalanceOk) {
                      setPaymentMethod("wallet");
                      if (useRoyalty) toggleRoyalty(false);
                    }
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="radio-circle">
                      {paymentMethod === 'wallet' && <div className="radio-inner" />}
                    </div>
                    <div className="flex-grow-1">
                      <div className="payment-card-title">👛 Pay with Wallet</div>
                      <div className="payment-card-desc">
                        Balance: {formatPrice(walletInfo.balance)}
                        {walletInfo.discount_percent > 0 && ` · Extra ${walletInfo.discount_percent}% off`}
                      </div>
                      {!walletBalanceOk && (
                        <div className="payment-wallet-error">Insufficient balance for this order</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {royaltyEligible && (
                <div
                  className="payment-card mb-0 mt-3"
                  style={{ background: useRoyalty ? '#fffbeb' : undefined, borderColor: useRoyalty ? '#fcd34d' : undefined }}
                >
                  <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                    <div>
                      <div className="payment-card-title">⭐ Pay with Royalty Points</div>
                      <div className="payment-card-desc">
                        {royaltyInfo!.points} pts ({formatPrice(royaltyInfo!.balance_rm)})
                        {billTotal <= 0
                          ? ' · Add items to apply'
                          : useRoyalty && royaltyRm > 0
                            ? ` · Paying ${formatPrice(royaltyRm)}; remaining ${formatPrice(amountDue)} via ${paymentMethod === 'cod' ? 'COD' : 'online'}`
                            : ' · Deducts from bill; pay remainder with COD / online'}
                      </div>
                    </div>
                    {useRoyalty ? (
                      <button type="button" className="btn btn-sm btn-link text-danger p-0 fw-semibold" onClick={() => toggleRoyalty(false)}>Remove</button>
                    ) : (
                      <button
                        type="button"
                        className="tf-btn btn-sm animate-btn"
                        disabled={!canPayWithRoyalty}
                        onClick={() => toggleRoyalty(true)}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: order summary ── */}
          <div className="col-lg-5 animate-fade-in-up delay-200">
            <div className="summary-card">
              <h3 className="summary-card-title">Order Summary</h3>

              <div className="order-items-list mb-4">
                {cartProducts.length === 0 ? (
                  <div className="text-center py-4 text-muted fw-semibold">Your cart is empty</div>
                ) : (
                  cartProducts.map((item, idx) => (
                    <CheckoutOrderItemPremium
                      key={`${item.id}-${item.selectedVariantId ?? "base"}-${idx}`}
                      item={item}
                      onRemove={() => removeLine(item.id, item.selectedVariantId, idx)}
                      onQtyChange={(qty) => setQty(item.id, qty, item.selectedVariantId, idx)}
                    />
                  ))
                )}
              </div>

              {appliedCode ? (
                <div className="premium-applied-promo-alert animate-fade-in">
                  <div className="fw-semibold">
                    ✓ {appliedCode} applied!
                  </div>
                  <button type="button" className="btn btn-sm btn-link text-danger p-0 text-decoration-none fw-semibold" onClick={removePromo}>Remove</button>
                </div>
              ) : (
                <div className="promo-box">
                  <input type="text" className="promo-input" placeholder="Promo / voucher code"
                    value={promoInput} onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                    disabled={promoLoading} />
                  <button className="tf-btn btn-sm animate-btn promo-apply-btn" type="button" onClick={handleApplyPromo} disabled={promoLoading}>
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {promoError && <p className="promo-error-text">{promoError}</p>}

              <div className="summary-row">
                <span>Subtotal</span>
                <span className="fw-semibold text-dark">{formatPrice(totalPrice)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="summary-row text-success fw-semibold">
                  <span>Discount ({appliedCode})</span>
                  <span>−{formatPrice(promoDiscount)}</span>
                </div>
              )}
              {walletDiscount > 0 && (
                <div className="summary-row text-success fw-semibold">
                  <span>Wallet discount ({walletInfo?.discount_percent}%)</span>
                  <span>−{formatPrice(walletDiscount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span className="fw-semibold text-dark">{
                  totalPrice <= 0
                    ? formatPrice(0)
                    : shippingCost === 0
                      ? <span className="text-success">Free</span>
                      : formatPrice(shippingCost)
                }</span>
              </div>
              <div className="summary-row fw-semibold">
                <span>Bill total</span>
                <span>{formatPrice(billTotal)}</span>
              </div>
              {royaltyRm > 0 && (
                <div className="summary-row fw-semibold" style={{ color: '#b45309' }}>
                  <span>Royalty points payment</span>
                  <span>−{formatPrice(royaltyRm)}</span>
                </div>
              )}

              <div className="summary-total">
                <span>{royaltyRm > 0 ? 'Amount due' : 'Total'}</span>
                <span>{formatPrice(amountDue)}</span>
              </div>

              {orderError && (
                <div className="alert alert-danger checkout-error-alert animate-fade-in mt-4 mb-0" style={{ whiteSpace: "pre-line" }}>
                  {orderError}
                </div>
              )}
              {isLoggedIn ? (
                <button type="submit" className="btn-premium mt-4" disabled={cartProducts.length === 0 || orderPlacing}>
                  {orderPlacing
                    ? "Processing..."
                    : amountDue <= 0.009 && royaltyRm > 0
                      ? `Place Order • Paid with points`
                      : `Place Order • ${formatPrice(amountDue)}`}
                  {!orderPlacing && <i className="icon-arrow-right ms-2" />}
                </button>
              ) : (
                <button type="button" className="btn-premium mt-4" data-bs-toggle="modal" data-bs-target="#phoneOTPModal">
                  📱 Login to Place Order
                </button>
              )}

            </div>
          </div>

        </form>
      </div>
    </section>
  );
}

const CheckoutOrderItemPremium = memo(function CheckoutOrderItemPremium({ item, onRemove, onQtyChange }: {
  item: CartProduct; onRemove: () => void; onQtyChange: (qty: number) => void;
}) {
  const baseImg = item.img ?? item.images?.[0]?.src ?? "/frontend/assets/images/product/product-1.jpg";
  const imgSrc = apiImageUrl(baseImg);
  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel = item.selectedSize ?? null;

  return (
    <div className="order-item-premium">
      <img src={imgSrc} alt={item.name} />
      <div className="order-item-details">
        <div className="d-flex justify-content-between align-items-start">
          <Link to={`/product-detail/${item.id}`} className="order-item-title text-decoration-none">{item.name}</Link>
          <button type="button" className="btn btn-sm text-danger p-0 border-0 bg-transparent" onClick={onRemove} title="Remove">
            <i className="icon-X2" style={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="order-item-meta">
          {colorLabel && <span className="me-3">Color: <span className="fw-semibold text-dark">{colorLabel}</span></span>}
          {sizeLabel && <span>Size: <span className="fw-semibold text-dark">{sizeLabel}</span></span>}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="qty-control">
            <button type="button" className="qty-btn" onClick={() => onQtyChange(item.quantity - 1)}>−</button>
            <input className="qty-input" readOnly value={item.quantity} />
            <button type="button" className="qty-btn" onClick={() => onQtyChange(item.quantity + 1)}>+</button>
          </div>
          <div className="order-item-price">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
});