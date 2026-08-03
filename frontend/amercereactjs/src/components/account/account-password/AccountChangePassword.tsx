import { useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";

export default function AccountChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!current.trim()) return setMsg({ type: "error", text: "Current password is required." });
    if (next.length < 6) return setMsg({ type: "error", text: "New password must be at least 6 characters." });
    if (next !== confirm) return setMsg({ type: "error", text: "Passwords do not match." });

    setSaving(true);
    try {
      await userAPI.changePassword({
        current_password: current,
        new_password: next,
        confirm_password: confirm,
      });
      setMsg({ type: "success", text: "Password changed successfully." });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setMsg({ type: "error", text: apiMsg ?? "Failed to change password. Check your current password." });
    } finally {
      setSaving(false);
    }
  }

  const strengthScore = (() => {
    if (!next) return 0;
    let s = 0;
    if (next.length >= 6) s++;
    if (next.length >= 10) s++;
    if (/[A-Z]/.test(next)) s++;
    if (/[0-9]/.test(next)) s++;
    if (/[^A-Za-z0-9]/.test(next)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][strengthScore];
  const strengthColor = ["", "#dc2626", "#ea580c", "#eab308", "#16a34a", "#15803d"][strengthScore];

  return (
    <AccountSection title="">
      <div className="pw-container-custom">
        <style>{`
          .pw-container-custom {
            font-family: 'Inter', sans-serif;
            color: #111111;
          }

          .pw-card-custom {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            padding: 32px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
          }

          @media (max-width: 576px) {
            .pw-card-custom {
              padding: 20px;
            }
          }

          .pw-title-custom {
            font-size: 18px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 6px;
          }

          .pw-subtitle-custom {
            font-size: 13.5px;
            color: #666666;
            margin-bottom: 24px;
          }

          .tips-card-custom {
            background: #fdfafb;
            border: 1px solid rgba(193, 16, 105, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 28px;
          }

          .tips-title-custom {
            font-weight: 700;
            font-size: 14px;
            color: #3ec1bc;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .tips-list-custom {
            margin: 0;
            padding-left: 18px;
            font-size: 13px;
            color: #555555;
            line-height: 1.8;
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
            border-color: #3ec1bc;
            box-shadow: 0 0 0 3px rgba(193, 16, 105, 0.1);
          }

          .alert-custom {
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 13.5px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
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
            background: #3ec1bc;
            color: #ffffff;
            border: 1px solid #3ec1bc;
            border-radius: 10px;
            padding: 12px 28px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-primary-custom:hover {
            background: #3ec1bc;
            border-color: #3ec1bc;
          }

          .btn-primary-custom:disabled {
            background: #cbd5e1;
            border-color: #cbd5e1;
            color: #94a3b8;
            cursor: not-allowed;
          }

          .strength-bar-container {
            display: flex;
            gap: 4px;
            margin-top: 8px;
            margin-bottom: 4px;
          }

          .strength-bar {
            flex: 1;
            height: 4px;
            border-radius: 2px;
            background: #e2e8f0;
            transition: background-color 0.2s ease;
          }

          .strength-text {
            font-size: 12px;
            font-weight: 700;
            margin-top: 4px;
          }

          .pw-eye-btn {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #888888;
            font-size: 16px;
            outline: none;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease;
          }

          .pw-eye-btn:hover {
            color: #3ec1bc;
          }
        `}</style>

        <div className="pw-card-custom">
          {/* Header */}
          <h5 className="pw-title-custom">Change Password</h5>
          <p className="pw-subtitle-custom">Keep your account secure with a strong password</p>

          {/* Security tips card */}
          <div className="tips-card-custom">
            <div className="tips-title-custom">
              <span>🔒</span>
              <span>Password Security Tips</span>
            </div>
            <ul className="tips-list-custom">
              <li>Use at least 8 characters</li>
              <li>Mix uppercase, lowercase, numbers, and symbols</li>
              <li>Avoid using easily guessable info (e.g. name or phone number)</li>
              <li>Do not reuse passwords across multiple sites</li>
            </ul>
          </div>

          {/* Alert */}
          {msg && (
            <div className={`alert-custom ${msg.type === "success" ? "success" : "danger"}`}>
              <span>{msg.type === "success" ? "✓" : "✕"}</span>
              <span>{msg.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Current password */}
            <div className="mb-4">
              <label className="form-label-custom">
                Current Password <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <div className="position-relative">
                <input
                  className="form-input-custom pe-5"
                  type={showPw ? "text" : "password"}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="pw-eye-btn"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="mb-3">
              <label className="form-label-custom">
                New Password <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                className="form-input-custom"
                type={showPw ? "text" : "password"}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="At least 6 characters"
                required
              />

              {/* Strength meter */}
              {next.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div className="strength-bar-container">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="strength-bar"
                        style={{
                          background: n <= strengthScore ? strengthColor : "#e2e8f0"
                        }}
                      />
                    ))}
                  </div>
                  <span className="strength-text" style={{ color: strengthColor }}>
                    Strength: {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="mb-4">
              <label className="form-label-custom">
                Confirm New Password <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                className="form-input-custom"
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
              {confirm.length > 0 && (
                <p className="mt-2 mb-0" style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: next === confirm ? "#15803d" : "#dc2626",
                }}>
                  {next === confirm ? "✓ Passwords match" : "✕ Passwords do not match"}
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary-custom" disabled={saving}>
              {saving ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </AccountSection>
  );
}
