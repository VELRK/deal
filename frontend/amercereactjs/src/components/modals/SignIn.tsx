import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiUser } from "@/services/api";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import { useModalStore } from "@/store/modalStore";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  formatMalaysiaIntl,
  isValidMalaysiaMobile,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";

const OTP_LENGTH = 4;

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { activeModal, closeModal, openModal } = useModalStore();

  const isOpen = activeModal === "signIn";

  const [tab, setTab] = useState<"email" | "otp">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [sentPhoneE164, setSentPhoneE164] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const otpPhoneRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchTab(t: "email" | "otp") {
    setTab(t);
    setOtpSent(false);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setError("");
  }

  /* ── OTP digit input handling ── */
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

  const otpValue = otpDigits.join("");

  /* ── Email login ── */
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const email = emailRef.current?.value.trim() ?? "";
    const password = passRef.current?.value ?? "";
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      const { syncCartFromServer } = await import("@/utils/cartSync");
      await syncCartFromServer();
      const dest = useModalStore.getState().consumeAuthRedirect("/account-page");
      navigate(dest, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP request ── */
  async function handleOtpRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const local = otpPhone.trim();
    if (!isValidMalaysiaMobile(local)) {
      setError(MY_PHONE_ERROR);
      return;
    }
    const e164 = toMalaysiaE164(local);
    setLoading(true);
    try {
      await authAPI.otpRequest({ phone: e164 });
      setSentPhoneE164(e164);
      setOtpSent(true);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP verify ── */
  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!sentPhoneE164 || otpValue.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.otpVerify({ phone: sentPhoneE164, otp: otpValue });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      const { syncCartFromServer } = await import("@/utils/cartSync");
      await syncCartFromServer();
      const hasRealEmail = user.email && !user.email.startsWith("ph_");
      const fallback = hasRealEmail ? "/account-page" : "/account-setting";
      const dest = useModalStore.getState().consumeAuthRedirect(fallback);
      navigate(dest, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="450px">
      <ModalHeader
        title="Sign In"
        subtitle="Welcome back. Please enter your details."
        onClose={closeModal}
        icon={icon}
      />
      <ModalBody>
        <div className="d-flex mb-4 pb-2" style={{ borderBottom: "1px solid var(--modal-border)" }}>
          <button
            type="button"
            className={`flex-grow-1 border-0 bg-transparent fw-semibold pb-2 transition ${tab === "email" ? "text-primary border-bottom border-primary" : "text-muted"}`}
            onClick={() => switchTab("email")}
            style={{ fontSize: "15px", borderBottomWidth: tab === "email" ? "2px" : "0", cursor: "pointer" }}
          >
            Password
          </button>
          <button
            type="button"
            className={`flex-grow-1 border-0 bg-transparent fw-semibold pb-2 transition ${tab === "otp" ? "text-primary border-bottom border-primary" : "text-muted"}`}
            onClick={() => switchTab("otp")}
            style={{ fontSize: "15px", borderBottomWidth: tab === "otp" ? "2px" : "0", cursor: "pointer" }}
          >
            OTP
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEE2E2", color: "#DC2626", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* ── Email form ── */}
        {tab === "email" && (
          <form id="signin-email-form" onSubmit={handleEmailSubmit} noValidate>
            <div className="mb-3">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }} htmlFor="si-email">
                Email Address <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <input
                ref={emailRef}
                id="si-email"
                type="email"
                placeholder="your@email.com"
                required
                style={{ width: "100%", padding: "12px", border: "1px solid var(--modal-border)", borderRadius: "8px", outline: "none" }}
              />
            </div>

            <div className="mb-4">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }} htmlFor="si-pass">
                Password <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                 <PasswordField
                    inputRef={passRef}
                    id="si-pass"
                    placeholder="Enter your password"
                    required
                  />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <input type="checkbox" id="si-remember" style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                <label htmlFor="si-remember" style={{ fontSize: "14px", cursor: "pointer" }}> Remember me </label>
              </div>
              <button type="button" onClick={() => openModal("forgotPassword")} className="bg-transparent border-0 text-decoration-underline" style={{ fontSize: "14px", color: "var(--modal-primary)", cursor: "pointer" }}>
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {/* ── OTP: phone entry ── */}
        {tab === "otp" && !otpSent && (
          <form id="signin-otp-request" onSubmit={handleOtpRequest} noValidate>
            <div className="mb-4">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }} htmlFor="si-otp-phone">
                Mobile Number <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <div className="d-flex align-items-center" style={{ border: "1px solid var(--modal-border)", borderRadius: "8px", overflow: "hidden" }}>
                <span className="px-3 fw-medium" style={{ backgroundColor: "#F8FAFC", borderRight: "1px solid var(--modal-border)", height: "100%", display: "flex", alignItems: "center" }}>+{MY_COUNTRY_CODE}</span>
                <input
                  ref={otpPhoneRef}
                  id="si-otp-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="12-345 6789"
                  value={formatMalaysiaDisplay(otpPhone)}
                  onChange={(e) => { setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setError(""); }}
                  required
                  style={{ width: "100%", padding: "12px", border: "none", outline: "none" }}
                />
              </div>
            </div>
          </form>
        )}

        {/* ── OTP: digit entry ── */}
        {tab === "otp" && otpSent && (
          <form id="signin-otp-verify" onSubmit={handleOtpVerify} noValidate>
            <div className="text-center mb-4">
              <p className="mb-2" style={{ fontSize: "15px" }}>OTP sent to <strong>{formatMalaysiaIntl(sentPhoneE164)}</strong></p>
              <p style={{ fontSize: "13px", color: "#64748B" }}>Enter the 4-digit code (e.g. 1234)</p>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-4" onPaste={handleOtpPaste}>
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  style={{
                    width: "50px",
                    height: "56px",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "600",
                    border: "1px solid var(--modal-border)",
                    borderRadius: "8px",
                    backgroundColor: d ? "#F8FAFC" : "#fff",
                    outlineColor: "var(--modal-primary)"
                  }}
                  onChange={(e) => handleOtpDigit(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-2">
              <button
                type="button"
                className="bg-transparent border-0 text-decoration-underline"
                onClick={() => { setOtpSent(false); setOtpDigits(Array(OTP_LENGTH).fill("")); setError(""); }}
                style={{ fontSize: "13px", color: "var(--modal-primary)", cursor: "pointer" }}
              >
                ← Change number
              </button>

              <button
                type="button"
                className="bg-transparent border-0"
                onClick={() => { setOtpSent(false); setOtpDigits(Array(OTP_LENGTH).fill("")); setError(""); }}
                style={{ fontSize: "13px", color: "#64748B", cursor: "pointer" }}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </ModalBody>
      <ModalFooter
        primaryAction={{
          label: loading ? "Please wait..." : tab === "email" ? "Sign In" : otpSent ? "Verify & Sign In" : "Send OTP",
          onClick: () => {
             const formId = tab === "email" ? "signin-email-form" : otpSent ? "signin-otp-verify" : "signin-otp-request";
             const form = document.getElementById(formId) as HTMLFormElement;
             if(form) form.requestSubmit();
          },
          loading: loading,
          variant: "gold"
        }}
        secondaryAction={{
          label: "Create Account",
          onClick: () => openModal("register")
        }}
      />
    </Modal>
  );
}
