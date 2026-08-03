import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import type { ApiUser } from "@/services/api";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  isValidMalaysiaMobile,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";

type FieldErrors = { email?: string; phone?: string };

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { activeModal, closeModal, openModal } = useModalStore();

  const isOpen = activeModal === "register";

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState<"email" | "phone" | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const passRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  async function checkEmailAvailability(value: string) {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFieldErrors((prev) => ({ ...prev, email: trimmed ? "Invalid email address." : undefined }));
      return false;
    }
    setChecking("email");
    try {
      const res = await authAPI.checkAvailability({ email: trimmed });
      const info = res.data?.data?.email;
      if (info && !info.available) {
        setFieldErrors((prev) => ({ ...prev, email: info.message || "Email already registered." }));
        return false;
      }
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
      return true;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { data?: { email?: { available?: boolean; message?: string } }; message?: string } } };
      const info = e?.response?.data?.data?.email;
      if (info && info.available === false) {
        setFieldErrors((prev) => ({ ...prev, email: info.message || "Email already registered." }));
        return false;
      }
      // Network/other: don't block; backend still validates on submit
      return true;
    } finally {
      setChecking(null);
    }
  }

  async function checkPhoneAvailability(value: string) {
    const digits = value.replace(/\D/g, "");
    if (!isValidMalaysiaMobile(digits)) {
      setFieldErrors((prev) => ({ ...prev, phone: digits ? MY_PHONE_ERROR : undefined }));
      return false;
    }
    setChecking("phone");
    try {
      const res = await authAPI.checkAvailability({ phone: toMalaysiaE164(digits) });
      const info = res.data?.data?.phone;
      if (info && !info.available) {
        setFieldErrors((prev) => ({ ...prev, phone: info.message || "Phone number already registered." }));
        return false;
      }
      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
      return true;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { data?: { phone?: { available?: boolean; message?: string } }; message?: string } } };
      const info = e?.response?.data?.data?.phone;
      if (info && info.available === false) {
        setFieldErrors((prev) => ({ ...prev, phone: info.message || "Phone number already registered." }));
        return false;
      }
      return true;
    } finally {
      setChecking(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name = nameRef.current?.value.trim() ?? "";
    const phoneVal = phone.trim();
    const emailVal = email.trim().toLowerCase();
    const pass = passRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";

    if (!name) {
      setError("Full name is required.");
      return;
    }
    if (!isValidMalaysiaMobile(phoneVal)) {
      setError(MY_PHONE_ERROR);
      setFieldErrors((prev) => ({ ...prev, phone: MY_PHONE_ERROR }));
      return;
    }
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError("A valid email is required.");
      setFieldErrors((prev) => ({ ...prev, email: "Invalid email address." }));
      return;
    }
    if (pass !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (pass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const [emailOk, phoneOk] = await Promise.all([
        checkEmailAvailability(emailVal),
        checkPhoneAvailability(phoneVal),
      ]);
      if (!emailOk || !phoneOk) {
        setError("Please fix the highlighted fields.");
        return;
      }

      const res = await authAPI.register({
        name,
        email: emailVal,
        password: pass,
        phone: toMalaysiaE164(phoneVal),
      });
      if ((res.data as { success?: boolean }).success) {
        const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
        login(token, user);
        const { afterLoginCartSync } = await import("@/utils/cartSync");
        await afterLoginCartSync();
        const dest = useModalStore.getState().consumeAuthRedirect("/account-page");
        navigate(dest, { replace: true });
      } else {
        setError((res.data as { message?: string }).message ?? "Registration failed.");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = e?.response?.data?.message ?? e?.message ?? "Registration failed. Please try again.";
      setError(msg);
      if (/email/i.test(msg)) setFieldErrors((prev) => ({ ...prev, email: msg }));
      if (/phone/i.test(msg)) setFieldErrors((prev) => ({ ...prev, phone: msg }));
    } finally {
      setLoading(false);
    }
  }

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <line x1="19" y1="8" x2="19" y2="14"></line>
      <line x1="22" y1="11" x2="16" y2="11"></line>
    </svg>
  );

  const fieldHint = (msg?: string) =>
    msg ? (
      <div style={{ color: "#DC2626", fontSize: "12px", marginTop: "6px" }}>{msg}</div>
    ) : null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="550px">
      <ModalHeader
        title="Create Account"
        subtitle="Be part of our growing family!"
        onClose={closeModal}
        icon={icon}
      />
      <ModalBody>
        <form id="register-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div style={{ backgroundColor: "#FEE2E2", color: "#DC2626", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }}>
                Full Name <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                placeholder="Your full name"
                required
                style={{ width: "100%", padding: "12px", border: "1px solid var(--modal-border)", borderRadius: "8px", outline: "none" }}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }}>
                Phone Number <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <div
                className="d-flex align-items-center"
                style={{
                  border: `1px solid ${fieldErrors.phone ? "#DC2626" : "var(--modal-border)"}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <span className="px-3 fw-medium" style={{ backgroundColor: "#F8FAFC", borderRight: "1px solid var(--modal-border)", display: "flex", alignItems: "center" }}>
                  +{MY_COUNTRY_CODE}
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="12-345 6789"
                  value={formatMalaysiaDisplay(phone)}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
                    setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  onBlur={() => {
                    void checkPhoneAvailability(phone);
                  }}
                  required
                  style={{ width: "100%", padding: "12px", border: "none", outline: "none" }}
                />
              </div>
              {fieldHint(checking === "phone" ? "Checking phone…" : fieldErrors.phone)}
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }}>
              Email Address <span style={{ color: "var(--modal-danger)" }}>*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              onBlur={() => {
                void checkEmailAvailability(email);
              }}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${fieldErrors.email ? "#DC2626" : "var(--modal-border)"}`,
                borderRadius: "8px",
                outline: "none",
              }}
            />
            {fieldHint(checking === "email" ? "Checking email…" : fieldErrors.email)}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }}>
                Password <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <PasswordField inputRef={passRef} id="register-password" placeholder="Min. 6 characters" required />
              </div>
            </div>
            <div className="col-md-6">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }}>
                Confirm Password <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <PasswordField inputRef={confirmRef} id="register-password-confirm" placeholder="Repeat password" required />
              </div>
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter
        primaryAction={{
          label: loading ? "Creating Account…" : "Create Account",
          onClick: () => {
            const form = document.getElementById("register-form") as HTMLFormElement;
            if (form) form.requestSubmit();
          },
          loading: loading,
          variant: "gold",
        }}
        secondaryAction={{
          label: "Login Instead",
          onClick: () => openModal("signIn"),
        }}
      />
    </Modal>
  );
}
