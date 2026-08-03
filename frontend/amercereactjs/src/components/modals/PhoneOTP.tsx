import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import type { ApiUser } from "@/services/api";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  formatMalaysiaIntl,
  isValidMalaysiaMobile,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";

const OTP_LENGTH = 4;

/** Developer test login (matches backend defaults in sk_isms_helper.php) */
const DEV_TEST_PHONE_LOCAL = "0180000000";
const DEV_TEST_OTP = "1234";
const IS_DEV = import.meta.env.DEV;

export default function PhoneOTPModal() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "phoneOTP";

  const [step, setStep]       = useState<"phone" | "otp">("phone");
  const [phone, setPhone]     = useState("");
  const [sentPhone, setSentPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint]       = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpValue = otpDigits.join("");

  const reset = () => {
    setStep("phone"); setPhone(""); setSentPhone(""); setOtpDigits(Array(OTP_LENGTH).fill(""));
    setError(""); setHint("");
    closeModal();
  };

  const finishLogin = async (token: string, user: ApiUser) => {
    login(token, user);
    try {
      const { afterLoginCartSync } = await import("@/utils/cartSync");
      await afterLoginCartSync();
    } catch {
      /* ignore cart sync errors */
    }
    const hasRealEmail = user.email && !user.email.startsWith("ph_");
    const fallback = hasRealEmail ? "/account-page" : "/account-setting";
    const dest = useModalStore.getState().consumeAuthRedirect(fallback);
    navigate(dest, { replace: true });
  };

  const handleOtpDigit = useCallback((idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < OTP_LENGTH - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }, [otpDigits]);

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[lastFilled]?.focus();
  }, []);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const local = phone.trim();
    if (!isValidMalaysiaMobile(local)) {
      setError(MY_PHONE_ERROR);
      return;
    }
    const e164 = toMalaysiaE164(local);
    setLoading(true); setError("");
    try {
      const res = await authAPI.otpRequest({ phone: e164 });
      const r = res.data as {
        success: boolean;
        message: string;
        data?: { test_mode?: boolean; test_otp?: string; dev_hint?: string };
      };
      if (r.success) {
        setSentPhone(e164);
        setStep("otp");
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
        const devHint = r.data?.dev_hint ?? r.data?.test_otp
          ? `Developer OTP: ${r.data?.test_otp ?? DEV_TEST_OTP}`
          : "";
        setHint(devHint || r.message);
      } else {
        setError(r.message ?? "Failed to send OTP.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to send OTP. Check your connection.");
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await authAPI.otpVerify({ phone: sentPhone, otp: otpValue });
      const r = res.data as { success: boolean; message?: string; data?: { token: string; user: ApiUser } };
      if (r.success && r.data?.token) {
        await finishLogin(r.data.token, r.data.user);
      } else {
        setError(r.message ?? "Invalid OTP.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid OTP. Please try again.");
    } finally { setLoading(false); }
  };

  const displayPhone = sentPhone
    ? formatMalaysiaIntl(sentPhone)
    : phone.trim()
      ? formatMalaysiaIntl(toMalaysiaE164(phone))
      : `+${MY_COUNTRY_CODE}`;

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={reset} maxWidth="400px">
      <ModalHeader
        title={step === "phone" ? "Login with Mobile" : "Enter OTP"}
        subtitle={step === "phone" ? "We will send you a verification code via SMS." : `OTP sent to ${displayPhone}`}
        onClose={reset}
        icon={icon}
      />
      <ModalBody>
        {step === "phone" ? (
          <form id="phone-otp-request" onSubmit={handleRequestOTP} noValidate>
            <div className="mb-4">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }}>
                Mobile Number <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <div className="d-flex align-items-center" style={{ border: "1px solid var(--modal-border)", borderRadius: "8px", overflow: "hidden" }}>
                <span className="px-3 fw-medium" style={{ backgroundColor: "#F8FAFC", borderRight: "1px solid var(--modal-border)", height: "100%", display: "flex", alignItems: "center" }}>+{MY_COUNTRY_CODE}</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="12-345 6789"
                  value={formatMalaysiaDisplay(phone)}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setError(""); }}
                  required
                  autoFocus
                  style={{ width: "100%", padding: "12px", border: "none", outline: "none" }}
                />
              </div>
              <p style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>
                OTP sent via iSMS Malaysia (SMS)
              </p>
              {IS_DEV && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px 12px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#166534",
                  }}
                >
                  <strong>Developer test</strong>
                  <br />
                  Mobile: <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-decoration-underline"
                    style={{ color: "#166534", cursor: "pointer" }}
                    onClick={() => setPhone(DEV_TEST_PHONE_LOCAL)}
                  >
                    018-000 0000
                  </button>
                  {" · "}OTP: <strong>{DEV_TEST_OTP}</strong>
                </div>
              )}
            </div>
            {error && <p style={{ color: "var(--modal-danger)", fontSize: "13px", marginTop: "-8px", marginBottom: "16px" }}>{error}</p>}
          </form>
        ) : (
          <form id="phone-otp-verify" onSubmit={handleVerifyOTP} noValidate>
            {hint && <p style={{ color: "var(--modal-success)", fontSize: "13px", marginBottom: "16px" }}>{hint}</p>}

            <p className="text-center mb-3" style={{ fontSize: "13px", color: "#64748B" }}>
              Enter the 4-digit code (e.g. 1234)
            </p>

            <div className="d-flex justify-content-center gap-3 mb-4" onPaste={handleOtpPaste}>
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  autoFocus={i === 0}
                  style={{
                    width: "50px",
                    height: "56px",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "600",
                    border: "1px solid var(--modal-border)",
                    borderRadius: "8px",
                    backgroundColor: d ? "#F8FAFC" : "#fff",
                    outlineColor: "var(--modal-primary)",
                  }}
                  onChange={(e) => handleOtpDigit(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>
            {error && <p style={{ color: "var(--modal-danger)", fontSize: "13px", marginTop: "-8px", marginBottom: "16px" }}>{error}</p>}

            <button
              type="button"
              className="bg-transparent border-0 text-decoration-underline w-100 text-center"
              onClick={() => { setStep("phone"); setOtpDigits(Array(OTP_LENGTH).fill("")); setError(""); setHint(""); }}
              style={{ fontSize: "13px", color: "var(--modal-primary)", cursor: "pointer", marginBottom: "8px" }}
            >
              ← Change number
            </button>
          </form>
        )}
      </ModalBody>
      <ModalFooter
        primaryAction={{
          label: loading ? "Please wait…" : step === "phone" ? "Get OTP" : "Verify & Login",
          onClick: () => {
             const formId = step === "phone" ? "phone-otp-request" : "phone-otp-verify";
             const form = document.getElementById(formId) as HTMLFormElement;
             if(form) form.requestSubmit();
          },
          loading: loading,
          variant: "gold"
        }}
      />
    </Modal>
  );
}
