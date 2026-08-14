import { Link, useNavigate } from "react-router-dom";
import { type FormEvent, useEffect, useState, memo } from "react";
import "./Checkout.css";

import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { apiImageUrl } from "@/hooks/useApi";
import { formatPrice } from "@/utils/formatPrice";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { userAPI, cartAPI, ordersAPI, promoAPI, paymentAPI, siteSettingsAPI } from "@/services/api";
import type { ApiAddress, RoyaltyCartInfo } from "@/services/api";
import { loadStoredPromo, saveStoredPromo } from "@/utils/promoStorage";
import { loadUseRoyalty, saveUseRoyalty } from "@/utils/royaltyStorage";
import { removeLineFromCart } from "@/utils/cartSync";
import { isPlaceholderEmail, isPlaceholderName, isProfileIncomplete } from "@/utils/userProfile";
import { toMalaysiaE164 } from "@/utils/malaysiaPhone";

/* Razorpay global type */
declare global {
  interface Window {
    Razorpay: new (options: object) => {
      open(): void;
      on(event: string, handler: (response: unknown) => void): void;
    };
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

  // Guest checkout: open phone OTP box (not a full login page)
  useEffect(() => {
    if (!isLoggedIn) {
      useModalStore.getState().openModal("signIn", { redirect: "/checkout" });
      navigate("/view-cart", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  /* ── Address form fields ── */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  // Ignore system-generated placeholder emails (OTP auto-register)
  const realEmail = (email?: string) =>
    email && !isPlaceholderEmail(email) ? email : "";
  const [addrEmail, setAddrEmail] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [, setZipError] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const needsProfile = isProfileIncomplete(user);
  const needsName = isPlaceholderName(user?.name);
  const needsEmail = isPlaceholderEmail(user?.email);
  const needsAddress = !addressLoading && addresses.length === 0;
  const userId = user?.id ?? null;

  function applyAddress(addr: ApiAddress) {
    const parts = addr.full_name.split(" ");
    setFirstName(parts[0] ?? "");
    setLastName(parts.slice(1).join(" "));
    setCompanyName(addr.company_name ?? "");
    setAddrEmail(realEmail(user?.email));
    setAddrPhone(addr.phone ?? "");
    setAddrCity(addr.city ?? "");
    setAddrStreet(`${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}`);
    setAddrState(addr.state ?? "");
    setAddrZip(addr.pincode ?? "");
    setZipError(false);
    setShowAddForm(false);
  }

  // When account changes (logout → other phone), wipe previous checkout fields
  useEffect(() => {
    setAddresses([]);
    setSelectedAddr(-1);
    setShowAddForm(false);
    setFirstName("");
    setLastName("");
    setCompanyName("");
    setAddrEmail("");
    setAddrPhone("");
    setAddrCity("");
    setAddrStreet("");
    setAddrState("");
    setAddrZip("");
    setOrderNote("");
    if (isLoggedIn) {
      void loadAddresses();
    } else {
      setAddressLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only on account switch
  }, [userId, isLoggedIn]);

  // Prefill from the current account only (never keep another user's values)
  useEffect(() => {
    if (!user) return;
    setAddrPhone(user.phone ?? "");
    setAddrEmail(realEmail(user.email));
    if (user.name && !isPlaceholderName(user.name)) {
      const parts = user.name.trim().split(/\s+/);
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" "));
    }
  }, [userId]);

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
    free_shipping?: boolean;
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

  /* Restore promo code from cart storage or affiliate ?ref= (discount is refreshed below). */
  useEffect(() => {
    if (!isLoggedIn || appliedCode || totalPrice <= 0) return;

    const stored = loadStoredPromo();
    if (stored?.code) {
      setAppliedCode(stored.code);
      // Show stored discount immediately so wallet/order totals update before API refresh
      if (stored.discount > 0) setPromoDiscount(stored.discount);
      return;
    }

    const refCode = sessionStorage.getItem("sk_affiliate_ref");
    if (!refCode) return;
    setAppliedCode(refCode.toUpperCase());
  }, [isLoggedIn, appliedCode, totalPrice]);

  /* Keep coupon discount (and wallet payable) in sync when cart total changes. */
  useEffect(() => {
    if (!isLoggedIn || !appliedCode || totalPrice <= 0) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setPromoLoading(true);
      promoAPI.apply({ code: appliedCode, order_amount: totalPrice })
        .then((res) => {
          if (cancelled) return;
          const r = res.data as { success?: boolean; data?: { discount: number; code: string }; message?: string };
          if (r.success && r.data) {
            setAppliedCode(r.data.code);
            setPromoDiscount(Number(r.data.discount) || 0);
            setPromoInput("");
            setPromoError("");
            saveStoredPromo({ code: r.data.code, discount: Number(r.data.discount) || 0 });
          } else {
            setAppliedCode("");
            setPromoDiscount(0);
            saveStoredPromo(null);
            setPromoError(r.message ?? "Promo no longer valid for this cart.");
          }
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setAppliedCode("");
          setPromoDiscount(0);
          saveStoredPromo(null);
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setPromoError(msg ?? "Could not apply promo code.");
        })
        .finally(() => { if (!cancelled) setPromoLoading(false); });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isLoggedIn, appliedCode, totalPrice]);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay" | "wallet">(() => {
    const saved = sessionStorage.getItem("checkout_payment_method");
    // COD hidden on website — only razorpay / wallet
    return (saved === "wallet" ? "wallet" : "razorpay") as "cod" | "razorpay" | "wallet";
  });
  useEffect(() => {
    sessionStorage.setItem("checkout_payment_method", paymentMethod);
  }, [paymentMethod]);

  // Shipping / free-shipping threshold use amount after coupon or affiliate discount
  const subtotalAfterPromo = Math.max(0, totalPrice - promoDiscount);
  const baseShippingCost = subtotalAfterPromo <= 0
    ? 0
    : (subtotalAfterPromo >= freeShippingAbove ? 0 : shippingCharge);
  // Wallet is a separate full-pay method: optional % off + always free delivery.
  // Works alone or together with coupon / affiliate / royalty (wallet covers the remainder).
  const walletPct = walletInfo?.discount_percent ?? 0;
  const walletDiscountPreview = walletInfo?.enabled && walletPct > 0
    ? Math.round(subtotalAfterPromo * walletPct / 100 * 100) / 100
    : 0;
  // Wallet pay always includes free delivery (ignore admin toggle).
  const walletFreeShipping = !!walletInfo?.enabled;
  const walletShippingCost = walletFreeShipping ? 0 : baseShippingCost;

  const walletDiscount = paymentMethod === "wallet" ? walletDiscountPreview : 0;
  const shippingCost = paymentMethod === "wallet" ? walletShippingCost : baseShippingCost;
  const billTotal = Math.max(0, subtotalAfterPromo - walletDiscount) + shippingCost;

  const royaltyEligible =
    !!royaltyInfo
    && royaltyInfo.enabled !== false
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
  const amountDue = Math.max(0, billTotal - royaltyRm); // remaining → wallet / online

  // Wallet charge if user selects wallet (promo + wallet % + free ship − royalty).
  // Free delivery is fixed for wallet — shipping is never added to wallet payable (no min order).
  const walletBillPreview = Math.max(0, subtotalAfterPromo - walletDiscountPreview) + walletShippingCost;
  const walletRoyaltyPreview = useRoyalty && royaltyEligible
    ? Math.min(Number(royaltyInfo?.balance_rm || 0), walletBillPreview)
    : 0;
  const walletPayablePreview = Math.round(Math.max(0, walletBillPreview - walletRoyaltyPreview) * 100) / 100;
  const walletBalance = Number(walletInfo?.balance || 0);
  const walletShortfall = Math.max(0, Math.round((walletPayablePreview - walletBalance) * 100) / 100);
  // Enable wallet when balance covers full wallet charge (after promo/royalty + free delivery).
  const walletBalanceOk =
    !!walletInfo?.enabled
    && walletPayablePreview > 0
    && walletBalance + 0.009 >= walletPayablePreview;

  // If wallet was selected but balance no longer covers full payable, fall back to online.
  // Also clear any stale COD selection (COD is hidden on website).
  useEffect(() => {
    if (paymentMethod === "cod" || (paymentMethod === "wallet" && !walletBalanceOk)) {
      setPaymentMethod("razorpay");
    }
  }, [paymentMethod, walletBalanceOk]);
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
      company_name: companyName.trim(),
      phone: addrPhone,
      line1: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrZip,
      country: "Malaysia",
      email: addrEmail.trim(),
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

    if (!isLoggedIn) { setOrderError("Please log in to place an order."); return; }
    if (cartProducts.length === 0) { setOrderError("Your cart is empty."); return; }

    // New OTP users: require a real name (email is optional)
    if (needsProfile || needsAddress || needsName) {
      if (!firstName.trim()) {
        setOrderError("Please enter your full name.");
        return;
      }
    }
    if (addrEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addrEmail.trim())) {
      setOrderError("Please enter a valid email address, or leave email blank.");
      return;
    }

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

    if (paymentMethod === "wallet") {
      if (!walletInfo?.enabled) { setOrderError("Wallet payments are not available."); return; }
      if (!walletBalanceOk) {
        setOrderError(
          walletShortfall > 0
            ? `Low balance in wallet. You need ${formatPrice(walletShortfall)} more to pay this order with wallet.`
            : "Low balance in wallet. Please top up or choose another payment method.",
        );
        return;
      }
    }

    setOrderPlacing(true);
    try {
      // Always persist checkout name (+ optional email) onto the account
      const fullName = `${firstName} ${lastName}`.trim() || addr.full_name;
      if (fullName || addrEmail.trim() || needsProfile || needsEmail) {
        try {
          const profilePayload: { name?: string; email?: string } = {};
          if (fullName) profilePayload.name = fullName;
          // Send email key so backend can store real email or null
          profilePayload.email = addrEmail.trim();
          const profileRes = await userAPI.updateProfile(profilePayload);
          const updated = (profileRes.data as { data?: typeof user })?.data;
          if (updated) useAuthStore.getState().setUser(updated);
        } catch (profileErr: unknown) {
          const msg = (profileErr as { response?: { data?: { message?: string } } })?.response?.data?.message;
          if (msg && /email/i.test(msg)) {
            setOrderError(msg);
            setOrderPlacing(false);
            return;
          }
          console.warn("Checkout profile save:", msg || profileErr);
        }
      }

      // Save delivery address into My Addresses (first order / new address form)
      const shouldSaveAddress = addresses.length === 0 || showAddForm || selectedAddr < 0;
      if (shouldSaveAddress) {
        const phoneForSave = toMalaysiaE164(addr.phone || user?.phone || "");
        try {
          const saveRes = await userAPI.saveAddress({
            full_name: addr.full_name,
            company_name: addr.company_name || "",
            phone: phoneForSave || addr.phone || user?.phone || "",
            line1: addr.line1,
            line2: addr.line2 ?? "",
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country || "Malaysia",
            label: "Home",
            address_type: "shipping",
            is_default: addresses.length === 0 ? 1 : 0,
          });
          const list = (saveRes.data as { data?: { addresses?: ApiAddress[] } })?.data?.addresses
            ?? (await userAPI.getAddresses()).data?.data
            ?? [];
          setAddresses(list);
          setShowAddForm(false);
          if (list.length > 0) {
            const idx = Math.max(0, list.length - 1);
            setSelectedAddr(idx);
            applyAddress(list[idx]);
          }
        } catch (addrErr: unknown) {
          // Backend checkout also persists the address; only block if we have no address book yet
          // and the order path would leave My Addresses empty without a save.
          const msg = (addrErr as { response?: { data?: { message?: string } } })?.response?.data?.message;
          console.warn("Checkout address save failed:", msg || addrErr);
        }
      }

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
        email: addrEmail.trim() || undefined,
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
        setOrderError("Failed to load payment gateway. Please try again or pay with Wallet.");
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
        setOrderError(payData.message ?? "Payment gateway error. Try again or pay with Wallet.");
        return;
      }

      const pd = payData.data;
      // Same logo as storefront header/home (public/assets/logo/logo.png)
      const checkoutLogo = new URL(
        "assets/logo/logo.png",
        window.location.origin + import.meta.env.BASE_URL,
      ).href;
      const rzpOptions = {
        key: pd.key_id,
        amount: pd.amount,
        currency: pd.currency,
        order_id: pd.razorpay_order_id,
        name: "2Deal",
        description: `Order #${pd.order_number}`,
        image: checkoutLogo,
        prefill: { name: pd.prefill.name, email: pd.prefill.email, contact: pd.prefill.contact },
        theme: { color: "#3EC1BC" },
        // Do not pass method/config filters — Curlec only shows methods
        // enabled on the merchant (FPX must be enabled in Dashboard Live mode).
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

      const rzp = new window.Razorpay(rzpOptions);
      // Curlec often surfaces bank/auth failures as "Login Failed" inside its iframe —
      // map them to a clear shop message so checkout is not a dead end.
      rzp.on("payment.failed", (response: unknown) => {
        const err = (response as {
          error?: { description?: string; reason?: string; code?: string };
        })?.error;
        const desc = err?.description?.trim();
        const reason = err?.reason?.trim();
        setOrderError(
          desc ||
            reason ||
            "Card / online payment failed. Check your phone number on the delivery address, try another card, or pay with Wallet. Your order is saved under My Orders."
          );
        setOrderPlacing(false);
      });
      rzp.open();
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

            {/* Guests are sent to cart with the phone OTP box */}

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
                          {a.company_name ? (
                            <div className="address-card-details text-muted">{a.company_name}</div>
                          ) : null}
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
                  <button
                    type="button"
                    className="tf-btn-line-2 link mt-3"
                    onClick={() => {
                      setSelectedAddr(-1);
                      setShowAddForm(true);
                      setAddrStreet("");
                      setAddrCity("");
                      setAddrState("");
                      setAddrZip("");
                      setZipError(false);
                    }}
                  >
                    + Add New Address
                  </button>
                </div>
              )}

              {!addressLoading && needsProfile && addresses.length > 0 && !showAddForm && (
                <div className="address-no-data animate-fade-in text-start mb-3">
                  <h5 className="address-no-data-title mb-2">Complete your profile</h5>
                  <p className="address-no-data-desc mb-3">
                    {user?.phone
                      ? `Account: +${String(user.phone).replace(/^\+/, "")}. Enter your real name (email optional).`
                      : "Enter your real name once — saved to this phone account. Email is optional."}
                  </p>
                  <div className="row g-3">
                    {needsName && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">First name *</label>
                          <input
                            className="premium-input"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            placeholder="First name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">Last name</label>
                          <input
                            className="premium-input"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">Company name <span className="text-muted fw-normal">(optional)</span></label>
                          <input
                            className="premium-input"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Company / business name"
                          />
                        </div>
                      </>
                    )}
                    {needsEmail && (
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Email <span className="text-muted fw-normal">(optional)</span></label>
                        <input
                          type="email"
                          className="premium-input"
                          value={addrEmail}
                          onChange={(e) => setAddrEmail(e.target.value)}
                          placeholder="you@example.com"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!addressLoading && (addresses.length === 0 || showAddForm) && (
                <div className="address-no-data animate-fade-in text-start">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <h5 className="address-no-data-title mb-0">
                      {addresses.length === 0 && needsProfile
                        ? "Your details & delivery address"
                        : showAddForm
                          ? "New delivery address"
                          : "Delivery address"}
                    </h5>
                    {showAddForm && addresses.length > 0 && (
                      <button
                        type="button"
                        className="tf-btn-line-2 link"
                        onClick={() => {
                          setShowAddForm(false);
                          if (addresses[0]) {
                            setSelectedAddr(0);
                            applyAddress(addresses[0]);
                          }
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <p className="address-no-data-desc mb-3">
                    {addresses.length === 0 && needsProfile
                      ? "Welcome! Add your name and delivery address. Company and email are optional."
                      : showAddForm
                        ? "This address is used for this order and saved to your account."
                        : "Add a delivery address to continue."}
                  </p>
                  <div className="row g-3 mb-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">First name *</label>
                      <input
                        className="premium-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="First name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Last name</label>
                      <input
                        className="premium-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Company name <span className="text-muted fw-normal">(optional)</span></label>
                      <input
                        className="premium-input"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company / business name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Email {needsEmail ? <span className="text-muted fw-normal">(optional)</span> : null}
                      </label>
                      <input
                        type="email"
                        className="premium-input"
                        value={addrEmail}
                        onChange={(e) => setAddrEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Mobile *</label>
                      <input
                        className="premium-input"
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        required
                        placeholder="Mobile number"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Address line *</label>
                      <input
                        className="premium-input"
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        required
                        placeholder="House / street / area"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">City *</label>
                      <input
                        className="premium-input"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        required
                        placeholder="City"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">State *</label>
                      <input
                        className="premium-input"
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        required
                        placeholder="State"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Postcode *</label>
                      <input
                        className="premium-input"
                        value={addrZip}
                        onChange={(e) => setAddrZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        required
                        placeholder="12345"
                        maxLength={5}
                      />
                    </div>
                  </div>
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
                        Balance: {formatPrice(walletBalance)}
                        {walletPct > 0 && ` · Extra ${walletPct}% off`}
                        {walletFreeShipping && ' · Free delivery'}
                      </div>
                      <div className="payment-card-desc fw-semibold text-dark mt-1">
                        Payable: {formatPrice(walletPayablePreview)}
                        {useRoyalty && walletRoyaltyPreview > 0
                          ? ` (after royalty −${formatPrice(walletRoyaltyPreview)}${walletDiscountPreview > 0 ? ` · ${walletPct}% off` : ""} · free delivery)`
                          : walletDiscountPreview > 0
                            ? ` (${walletPct}% off · free delivery)`
                            : promoDiscount > 0 && appliedCode
                              ? ` (after ${appliedCode} · free delivery)`
                              : " (free delivery)"}
                      </div>
                      {!walletBalanceOk && walletPayablePreview > 0 && (
                        <div className="payment-wallet-error">
                          {walletBalance <= 0
                            ? `Low balance in wallet. Add ${formatPrice(walletPayablePreview)} to pay this order with wallet.`
                            : `Low balance in wallet. You have ${formatPrice(walletBalance)}; need ${formatPrice(walletShortfall)} more (payable ${formatPrice(walletPayablePreview)}).`}
                        </div>
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
                            ? ` · Paying ${formatPrice(royaltyRm)}; remaining ${formatPrice(amountDue)} via ${
                                paymentMethod === 'wallet' ? 'wallet' : 'online'
                              }`
                            : ' · Deducts from bill; pay remainder with wallet / online'}
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
                      ? <span className="text-success">{paymentMethod === 'wallet' && walletFreeShipping ? 'Free (wallet)' : 'Free'}</span>
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
              {paymentMethod === 'wallet' && (
                <div className="summary-row fw-semibold text-success">
                  <span>Wallet charge</span>
                  <span>{formatPrice(walletPayablePreview)}</span>
                </div>
              )}

              <div className="summary-total">
                <span>
                  {paymentMethod === 'wallet'
                    ? 'Pay from wallet'
                    : royaltyRm > 0
                      ? 'Amount due'
                      : 'Total'}
                </span>
                <span>{formatPrice(paymentMethod === 'wallet' ? walletPayablePreview : amountDue)}</span>
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
                      : `Place Order • ${formatPrice(paymentMethod === "wallet" ? walletPayablePreview : amountDue)}`}
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
          <div className="qty-control-wrapper d-flex flex-column">
            <div className="qty-control">
              <button type="button" className="qty-btn" onClick={() => onQtyChange(item.quantity - 1)}>−</button>
              <input className="qty-input" readOnly value={item.quantity} />
              <button 
                type="button" 
                className="qty-btn" 
                onClick={() => {
                  if (item.stock !== undefined && item.quantity >= item.stock) return;
                  onQtyChange(item.quantity + 1);
                }}
                disabled={item.stock !== undefined && item.quantity >= item.stock}
                style={item.stock !== undefined && item.quantity >= item.stock ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >+</button>
            </div>
            {item.stock !== undefined && item.quantity >= item.stock && (
              <span className="text-danger mt-1" style={{ fontSize: "10px", lineHeight: "1" }}>Max stock reached</span>
            )}
          </div>
          <div className="order-item-price">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
});