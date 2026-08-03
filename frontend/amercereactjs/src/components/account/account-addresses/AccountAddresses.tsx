import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import type { ApiAddress } from "@/services/api";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  isValidMalaysiaMobile,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";

const MALAYSIA_STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak",
  "Perlis", "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu",
  "W.P. Kuala Lumpur", "W.P. Labuan", "W.P. Putrajaya"
];

const EMPTY_FORM = {
  full_name: "", phone: "", line1: "", line2: "",
  city: "", state: "", pincode: "", country: "Malaysia",
  company_name: "", label: "Home", is_default: 0, address_type: "shipping",
};

// --- tiny inline icon set (no new dependencies) ---------------------------
function IconHome(props: { className?: string }) {
  return (
    <svg className={props.className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}
function IconBriefcase(props: { className?: string }) {
  return (
    <svg className={props.className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  );
}
function IconPin(props: { className?: string }) {
  return (
    <svg className={props.className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.4 7-11.6A7 7 0 0 0 5 9.4C5 14.6 12 21 12 21Z" />
      <circle cx="12" cy="9.4" r="2.4" />
    </svg>
  );
}
function IconPhone(props: { className?: string }) {
  return (
    <svg className={props.className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function IconCheck(props: { className?: string }) {
  return (
    <svg className={props.className} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IconTrash(props: { className?: string }) {
  return (
    <svg className={props.className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    </svg>
  );
}
function IconPlus(props: { className?: string }) {
  return (
    <svg className={props.className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconClose(props: { className?: string }) {
  return (
    <svg className={props.className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function IconAlert(props: { className?: string }) {
  return (
    <svg className={props.className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.2v.1" />
    </svg>
  );
}
function labelIcon(label: string) {
  const l = label.trim().toLowerCase();
  if (l.includes("office") || l.includes("work")) return IconBriefcase;
  if (l.includes("home")) return IconHome;
  return IconPin;
}
// ---------------------------------------------------------------------------

export default function AccountAddresses() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectPath = searchParams.get("redirect");

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(!!redirectPath); // Auto-show form if redirecting from checkout
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    userAPI.getAddresses()
      .then((res) => setAddresses(res.data.data ?? []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  function field(key: keyof typeof form, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.full_name.trim()) return setError("Full name is required.");
    if (!form.phone.trim() || !isValidMalaysiaMobile(form.phone.trim()))
      return setError(MY_PHONE_ERROR);
    if (!form.line1.trim()) return setError("Address line 1 is required.");
    if (!form.city.trim()) return setError("City is required.");
    if (!form.state) return setError("State is required.");
    if (!form.pincode.trim() || !/^\d{5}$/.test(form.pincode.trim()))
      return setError("Enter a valid 5-digit postcode.");

    setSaving(true);
    try {
      const payload = { ...form, phone: toMalaysiaE164(form.phone) };
      const res = await userAPI.saveAddress(payload);
      const result = (res.data as { success: boolean; data?: { addresses: ApiAddress[] } });

      if (result.success && result.data?.addresses) {
        setAddresses(result.data.addresses);
        setShowForm(false);
        setForm({ ...EMPTY_FORM });

        // If we have a redirect path, go back!
        if (redirectPath) {
          navigate(redirectPath);
        }
      }
    } catch {
      setError("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      const res = await userAPI.deleteAddress(id);
      const d = (res.data as { data?: { addresses: ApiAddress[] } }).data;
      if (d?.addresses) setAddresses(d.addresses);
      else setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch { /* silent */ }
    finally { setDeleting(null); }
  }

  return (
    <AccountSection title="My Addresses">
      <div className="address-container-custom">
        <style>{`
          .address-container-custom {
            --teal: #3EC1BC;
            --teal-dark: #2FA6A1;
            --teal-darker: #24807C;
            --teal-tint: #EAFAF9;
            --teal-tint-2: #DBF5F3;
            --ink: #16232B;
            --muted: #64748B;
            --line: #E7ECEC;
            --danger: #DC2626;
            --danger-tint: #FDEDED;
            font-family: 'Inter', sans-serif;
            color: var(--ink);
          }

          .address-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--line);
            gap: 16px;
          }

          @media (max-width: 576px) {
            .address-header {
              flex-direction: column;
              align-items: flex-start;
              margin-bottom: 20px;
              padding-bottom: 16px;
            }
            .address-header h5 {
              font-size: 19px !important;
            }
            .btn-add-address-custom {
              width: 100%;
              justify-content: center;
            }
            .form-card-custom {
              padding: 20px 16px 20px !important;
            }
            .address-card-custom {
              padding: 16px !important;
            }
          }

          .address-header h5 {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.01em;
            margin: 0;
            color: var(--ink);
          }

          .address-header .subtext {
            font-size: 13.5px;
            color: var(--muted);
            margin-top: 4px;
          }

          .btn-add-address-custom {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--teal);
            color: #fff;
            border: 1px solid var(--teal);
            border-radius: 10px;
            padding: 11px 20px;
            font-size: 13.5px;
            font-weight: 600;
            letter-spacing: 0.1px;
            cursor: pointer;
            transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.05s ease;
            box-shadow: 0 1px 2px rgba(22, 35, 43, 0.06);
          }

          .btn-add-address-custom:hover {
            background: var(--teal-dark);
            box-shadow: 0 4px 14px rgba(62, 193, 188, 0.35);
          }

          .btn-add-address-custom:active {
            transform: translateY(1px);
          }

          /* ---- cards ---- */
          .address-card-custom {
            background: #fff;
            padding: 22px 22px 18px;
            border: 1px solid var(--line);
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
            box-shadow: 0 1px 2px rgba(22, 35, 43, 0.04);
          }

          .address-card-custom:hover {
            border-color: var(--teal);
            box-shadow: 0 10px 24px rgba(22, 35, 43, 0.08);
            transform: translateY(-2px);
          }

          .address-card-custom.default-active {
            border-color: var(--teal);
            box-shadow: 0 0 0 1px var(--teal), 0 10px 24px rgba(62, 193, 188, 0.14);
          }

          .card-top-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 14px;
          }

          .address-label-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 600;
            color: var(--teal-darker);
            text-transform: uppercase;
            letter-spacing: 0.6px;
          }

          .address-label-icon {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--teal-tint);
            color: var(--teal-darker);
            flex-shrink: 0;
          }

          .badge-default-custom {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: var(--teal-tint);
            color: var(--teal-darker);
            border: 1px solid var(--teal-tint-2);
            font-size: 10.5px;
            font-weight: 700;
            padding: 4px 9px 4px 7px;
            border-radius: 999px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }

          .badge-default-custom svg {
            color: var(--teal-darker);
          }

          .address-name-custom {
            font-size: 15.5px;
            font-weight: 700;
            margin-bottom: 6px;
            color: var(--ink);
            letter-spacing: -0.01em;
          }

          .address-details-custom {
            color: var(--muted);
            font-size: 13.8px;
            line-height: 1.65;
            flex: 1;
            margin-bottom: 18px;
          }

          .address-phone-row {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 10px;
            color: var(--ink);
            font-weight: 500;
          }

          .address-phone-row svg {
            color: var(--teal);
          }

          .address-actions-custom {
            display: flex;
            gap: 10px;
            border-top: 1px solid var(--line);
            padding-top: 14px;
          }

          .btn-remove-custom {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            border: none;
            color: var(--muted);
            font-size: 12.5px;
            font-weight: 600;
            letter-spacing: 0.2px;
            cursor: pointer;
            padding: 4px 0;
            transition: color 0.18s ease;
          }

          .btn-remove-custom:hover {
            color: var(--danger);
          }

          .btn-remove-custom:disabled {
            opacity: 0.6;
            cursor: default;
          }

          /* ---- form card ---- */
          .form-card-custom {
            background: #fff;
            padding: 30px 30px 26px;
            border: 1px solid var(--line);
            border-radius: 16px;
            margin-bottom: 36px;
            box-shadow: 0 6px 24px rgba(22, 35, 43, 0.06);
          }

          .form-title {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: -0.01em;
            margin-bottom: 22px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--line);
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--ink);
          }

          .form-close-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 8px;
            border: none;
            background: transparent;
            color: var(--muted);
            cursor: pointer;
            transition: background 0.18s ease, color 0.18s ease;
          }

          .form-close-btn:hover {
            background: var(--teal-tint);
            color: var(--teal-darker);
          }

          .form-label-custom {
            font-size: 12px;
            font-weight: 600;
            color: var(--muted);
            letter-spacing: 0.3px;
            margin-bottom: 8px;
            display: block;
          }

          .form-label-custom .text-danger {
            color: var(--teal-darker) !important;
          }

          .form-input-custom {
            width: 100%;
            padding: 11px 13px;
            border: 1.5px solid var(--line);
            border-radius: 10px;
            font-size: 14.5px;
            color: var(--ink);
            background: #fbfcfc;
            outline: none;
            transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
          }

          .form-input-custom:focus {
            border-color: var(--teal);
            background: #fff;
            box-shadow: 0 0 0 3.5px var(--teal-tint);
          }

          .form-input-custom::placeholder {
            color: #A6B0B4;
            font-weight: 400;
          }

          .btn-primary-custom {
            background: var(--teal);
            color: #fff;
            border: 1px solid var(--teal);
            border-radius: 10px;
            padding: 13px 28px;
            font-size: 13.5px;
            font-weight: 700;
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.05s ease;
            width: 100%;
            box-shadow: 0 1px 2px rgba(22, 35, 43, 0.06);
          }

          .btn-primary-custom:hover:not(:disabled) {
            background: var(--teal-dark);
            box-shadow: 0 6px 18px rgba(62, 193, 188, 0.35);
          }

          .btn-primary-custom:active:not(:disabled) {
            transform: translateY(1px);
          }

          .btn-primary-custom:disabled {
            opacity: 0.65;
            cursor: default;
          }

          .btn-secondary-custom {
            background: #fff;
            border: 1.5px solid var(--line);
            color: var(--ink);
            border-radius: 10px;
            padding: 13px 28px;
            font-size: 13.5px;
            font-weight: 600;
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
            width: 100%;
          }

          .btn-secondary-custom:hover {
            border-color: var(--teal);
            color: var(--teal-darker);
            background: var(--teal-tint);
          }

          .form-select-custom {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 34px;
          }

          .checkbox-row-custom {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            font-size: 13.5px;
            font-weight: 500;
            color: var(--ink);
            background: #fbfcfc;
            border: 1.5px solid var(--line);
            border-radius: 10px;
            padding: 13px 15px;
            transition: border-color 0.18s ease, background 0.18s ease;
          }

          .checkbox-row-custom:hover {
            border-color: var(--teal);
            background: var(--teal-tint);
          }

          .checkbox-row-custom input {
            width: 17px;
            height: 17px;
            accent-color: var(--teal);
            cursor: pointer;
          }

          .alert-custom {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: var(--danger-tint);
            color: #9B1C1C;
            border: 1px solid #F6C9C9;
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 13.5px;
            font-weight: 500;
            margin-bottom: 20px;
          }

          .alert-custom svg {
            flex-shrink: 0;
            margin-top: 1px;
            color: #C0392B;
          }

          /* ---- empty state ---- */
          .empty-state {
            text-align: center;
            padding: 64px 20px;
            background: #fbfcfc;
            border: 1.5px dashed var(--line);
            border-radius: 16px;
          }

          .empty-state-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: var(--teal-tint);
            color: var(--teal-darker);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .empty-state p.empty-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
            color: var(--ink);
          }

          .empty-state p.empty-sub {
            color: var(--muted);
            margin-bottom: 28px;
            font-size: 14px;
          }

          .spinner-teal {
            width: 34px;
            height: 34px;
            border: 3px solid var(--teal-tint);
            border-top-color: var(--teal);
            border-radius: 50%;
            animation: spin-teal 0.7s linear infinite;
            margin: 0 auto;
          }

          @keyframes spin-teal {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div className="address-header">
          <div>
            <h5>My Addresses</h5>
            <div className="subtext">Manage the addresses we deliver your orders to.</div>
          </div>
          {!showForm && (
            <button
              type="button"
              className="btn-add-address-custom"
              onClick={() => { setShowForm(true); setError(null); setForm({ ...EMPTY_FORM }); }}
            >
              <IconPlus />
              Add Address
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-card-custom">
            <div className="form-title">
              <span>New Delivery Address</span>
              <button type="button" className="form-close-btn" onClick={() => setShowForm(false)} aria-label="Close form">
                <IconClose />
              </button>
            </div>

            {error && (
              <div className="alert-custom">
                <IconAlert />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} noValidate>
              <div className="mb-4">
                <label className="form-label-custom">Address Label <span className="text-danger">*</span></label>
                <input
                  className="form-input-custom"
                  value={form.label}
                  onChange={(e) => field("label", e.target.value)}
                  placeholder="e.g. Home, Office"
                  required
                />
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-4 mb-md-0">
                  <label className="form-label-custom">Recipient Name <span className="text-danger">*</span></label>
                  <input
                    className="form-input-custom"
                    value={form.full_name}
                    onChange={(e) => field("full_name", e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Phone Number <span className="text-danger">*</span></label>
                  <div className="d-flex align-items-center form-input-custom" style={{ padding: 0, overflow: "hidden" }}>
                    <span className="px-3 fw-medium" style={{ backgroundColor: "#f8fafc", borderRight: "1px solid #e2e8f0", alignSelf: "stretch", display: "flex", alignItems: "center" }}>+{MY_COUNTRY_CODE}</span>
                    <input
                      className="form-input-custom"
                      value={formatMalaysiaDisplay(form.phone)}
                      maxLength={12}
                      onChange={(e) => field("phone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                      placeholder="12-345 6789"
                      required
                      style={{ border: "none", borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-4 mb-md-0">
                  <label className="form-label-custom">Company Name <span className="text-muted">(optional)</span></label>
                  <input
                    className="form-input-custom"
                    value={form.company_name}
                    onChange={(e) => field("company_name", e.target.value)}
                    placeholder="Shown on invoice if provided"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Address Type</label>
                  <select
                    className="form-input-custom"
                    value={form.address_type}
                    onChange={(e) => field("address_type", e.target.value)}
                  >
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label-custom">Address Line 1 <span className="text-danger">*</span></label>
                <input
                  className="form-input-custom"
                  value={form.line1}
                  onChange={(e) => field("line1", e.target.value)}
                  placeholder="House / Flat / Block, Street Name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label-custom">Address Line 2 <span className="text-muted text-lowercase" style={{ fontSize: '10px' }}>(optional)</span></label>
                <input
                  className="form-input-custom"
                  value={form.line2}
                  onChange={(e) => field("line2", e.target.value)}
                  placeholder="Colony / Sector / Landmark"
                />
              </div>

              <div className="row mb-4">
                <div className="col-md-4 mb-4 mb-md-0">
                  <label className="form-label-custom">City <span className="text-danger">*</span></label>
                  <input
                    className="form-input-custom"
                    value={form.city}
                    onChange={(e) => field("city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="col-md-4 mb-4 mb-md-0">
                  <label className="form-label-custom">State <span className="text-danger">*</span></label>
                  <select
                    className="form-input-custom form-select-custom"
                    value={form.state}
                    onChange={(e) => field("state", e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {MALAYSIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Postcode <span className="text-danger">*</span></label>
                  <input
                    className="form-input-custom"
                    value={form.pincode}
                    maxLength={5}
                    onChange={(e) => field("pincode", e.target.value.replace(/\D/g, ""))}
                    placeholder="5-digit Postcode"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="checkbox-row-custom">
                  <input
                    type="checkbox"
                    checked={form.is_default === 1}
                    onChange={(e) => field("is_default", e.target.checked ? 1 : 0)}
                  />
                  Set as default address
                </label>
              </div>

              <div className="row g-3">
                <div className="col-sm-6">
                  <button type="submit" className="btn-primary-custom" disabled={saving}>
                    {saving ? "Saving..." : "Save Address"}
                  </button>
                </div>
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn-secondary-custom"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5"><div className="spinner-teal" role="status" /></div>
        ) : addresses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><IconPin /></div>
            <p className="empty-title">No Saved Addresses</p>
            <p className="empty-sub">Add delivery details for a smoother checkout experience.</p>
            {!showForm && (
              <button type="button" className="btn-add-address-custom" onClick={() => setShowForm(true)}>
                <IconPlus />
                Add New Address
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {addresses.map((addr) => {
              const isDefault = Number(addr.is_default) === 1;
              const LabelIcon = labelIcon(addr.label || "");
              return (
                <div key={addr.id} className="col-md-6">
                  <div className={`address-card-custom ${isDefault ? "default-active" : ""}`}>
                    <div className="card-top-row">
                      <span className="address-label-badge">
                        <span className="address-label-icon"><LabelIcon /></span>
                        {addr.label}
                      </span>
                      {isDefault && (
                        <span className="badge-default-custom">
                          <IconCheck />
                          Default
                        </span>
                      )}
                    </div>

                    <div className="address-name-custom">{addr.full_name}</div>
                    {addr.company_name ? <div className="small text-muted">{addr.company_name}</div> : null}

                    <div className="address-details-custom">
                      <div>{addr.line1}</div>
                      {addr.line2 && <div>{addr.line2}</div>}
                      <div>{addr.city}, {addr.state} {addr.pincode}</div>
                      <div className="address-phone-row">
                        <IconPhone />
                        {addr.phone}
                      </div>
                    </div>

                    <div className="address-actions-custom">
                      <button
                        type="button"
                        className="btn-remove-custom"
                        onClick={() => handleDelete(addr.id)}
                        disabled={deleting === addr.id}
                      >
                        <IconTrash />
                        {deleting === addr.id ? "Removing…" : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountSection>
  );
}
