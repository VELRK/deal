import { useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  isValidMalaysiaMobile,
  stripPhoneDigits,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";

export default function AccountSetting() {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(() => {
    const raw = user?.phone ?? "";
    if (!raw) return "";
    const d = stripPhoneDigits(raw);
    return d.startsWith(MY_COUNTRY_CODE) ? "0" + d.slice(MY_COUNTRY_CODE.length) : d;
  });
  const currentEmail = user?.email ?? "";
  const isPhoneOnly = currentEmail.startsWith("ph_") || currentEmail.includes("@2Deal.app");
  const [email, setEmail] = useState(isPhoneOnly ? "" : currentEmail);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setMsg({ type: "error", text: "Full name is required." });
    if (phone.trim() && !isValidMalaysiaMobile(phone)) {
      return setMsg({ type: "error", text: MY_PHONE_ERROR });
    }
    setMsg(null);
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        phone: phone.trim() ? toMalaysiaE164(phone) : "",
      };
      if (isPhoneOnly && email.trim()) payload.email = email.trim();
      const res = await userAPI.updateProfile(payload);
      const updated = (res.data as { data?: typeof user }).data;
      if (updated) setUser(updated as NonNullable<typeof user>);
      setMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err: unknown) {
      const msg2 = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg({ type: "error", text: msg2 ?? "Failed to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AccountSection title="Account Details">
      <div className="settings-container-custom">
        <style>{`
          .settings-container-custom {
            font-family: 'Inter', sans-serif;
            color: #111111;
          }

          .settings-card-custom {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            padding: 32px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
          }

          @media (max-width: 576px) {
            .settings-card-custom {
              padding: 20px;
            }
          }

          .settings-title-custom {
            font-size: 18px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(193, 16, 105, 0.08);
            padding-bottom: 12px;
          }

          .form-label-custom {
            font-weight: 600;
            font-size: 13px;
            color: #333333;
            margin-bottom: 6px;
            display: block;
          }

          .form-input-custom {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(193, 16, 105, 0.15);
            border-radius: 10px;
            font-size: 14px;
            color: #111111;
            background: #ffffff;
            outline: none;
            transition: all 0.25s ease;
          }

          .form-input-custom:focus {
            border-color: #3EC1BC;
            box-shadow: 0 0 0 3px rgba(193, 16, 105, 0.1);
          }

          .form-input-custom:read-only {
            background: #f8fafc;
            border-color: #e2e8f0;
            color: #64748b;
            cursor: not-allowed;
          }

          .alert-custom {
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 13.5px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
          }

          .alert-custom.warning {
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fef3c7;
          }

          .alert-custom.success {
            background: #f0fdf4;
            color: #15803d;
            border: 1px solid #bbf7d0;
          }

          .alert-custom.danger {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fee2e2;
          }

          .btn-primary-custom {
            background: #3EC1BC;
            color: #ffffff;
            border: 1px solid #3EC1BC;
            border-radius: 10px;
            padding: 12px 28px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-primary-custom:hover {
            background: #920b4e;
            border-color: #920b4e;
          }

          .btn-primary-custom:disabled {
            background: #cbd5e1;
            border-color: #cbd5e1;
            color: #94a3b8;
            cursor: not-allowed;
          }

          .form-desc-custom {
            margin-top: 6px;
            color: #64748b;
            font-size: 12px;
          }
        `}</style>

        <div className="settings-card-custom">
          <h5 className="settings-title-custom">Personal Details</h5>

          {/* Prompt when user has no real email */}
          {isPhoneOnly && (
            <div className="alert-custom warning">
              <span>📧</span>
              <span>Add your email for order updates. You still login with mobile OTP.</span>
            </div>
          )}

          {msg && (
            <div className={`alert-custom ${msg.type === 'success' ? 'success' : 'danger'}`}>
              <span>{msg.type === 'success' ? '✓' : '✕'}</span>
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 mb-4">
                <label className="form-label-custom">Full Name <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  className="form-input-custom"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="col-12 mb-4">
                <label className="form-label-custom">Phone Number</label>
                <div className="d-flex align-items-center form-input-custom" style={{ padding: 0, overflow: "hidden" }}>
                  <span className="px-3 fw-medium" style={{ backgroundColor: "#f8fafc", borderRight: "1px solid #e2e8f0", alignSelf: "stretch", display: "flex", alignItems: "center" }}>+{MY_COUNTRY_CODE}</span>
                  <input
                    className="form-input-custom"
                    type="tel"
                    value={formatMalaysiaDisplay(phone)}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="12-345 6789"
                    style={{ border: "none", borderRadius: 0 }}
                  />
                </div>
              </div>

              <div className="col-12 mb-4">
                <label className="form-label-custom">
                  Email Address {isPhoneOnly ? <span className="text-muted fw-normal">(optional)</span> : "(Read-only)"}
                </label>
                {isPhoneOnly ? (
                  <input
                    className="form-input-custom"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                ) : (
                  <input
                    className="form-input-custom"
                    type="email"
                    value={currentEmail}
                    readOnly
                  />
                )}
                {!isPhoneOnly && (
                  <p className="form-desc-custom">Account email address cannot be modified.</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn-primary-custom" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountSection>
  );
}
