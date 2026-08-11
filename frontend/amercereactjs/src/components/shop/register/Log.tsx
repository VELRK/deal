import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiUser } from "@/services/api";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  isValidMalaysiaMobile,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";
import { sanitizeAuthRedirect, rememberAuthReturn } from "@/utils/authRedirect";

function Log() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuthStore();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = sanitizeAuthRedirect(
    new URLSearchParams(location.search).get("redirect"),
    "/account-page",
  );

  useEffect(() => {
    rememberAuthReturn(redirectTo);
  }, [redirectTo]);

  useEffect(() => {
    if (isLoggedIn) navigate(redirectTo, { replace: true });
  }, [isLoggedIn, navigate, redirectTo]);

  const nameRef    = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const emailRef   = useRef<HTMLInputElement>(null);
  const passRef    = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name    = nameRef.current?.value.trim() ?? "";
    const phoneVal = phone.trim();
    const email   = emailRef.current?.value.trim() ?? "";
    const pass    = passRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";

    if (!isValidMalaysiaMobile(phoneVal)) { setError(MY_PHONE_ERROR); return; }

    if (pass !== confirm) { setError("Passwords do not match."); return; }
    if (pass.length < 6)  { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const res = await authAPI.register({ name, email, password: pass, phone: toMalaysiaE164(phoneVal) });
      if ((res.data as { success?: boolean }).success) {
        const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
        login(token, user);
        const { afterLoginCartSync } = await import("@/utils/cartSync");
        await afterLoginCartSync();
        navigate(redirectTo, { replace: true });
      } else {
        setError((res.data as { message?: string }).message ?? "Registration failed.");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message ?? e?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-log flat-spacing" style={{ backgroundColor: "#f8f9fa", minHeight: "80vh", display: "flex", alignItems: "center", padding: "60px 0" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12">
            <div className="login-popup-wrapper bg-white shadow-lg p-4 p-md-5" style={{ borderRadius: "20px" }}>
              <div className="row align-items-center gy-30">
          <div className="col-md-5 ms-auto">
            <div className="col-left">
              <h4 className="title mb-20">Create Account</h4>
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-16 text-caption-01" role="alert">
                  {error}
                </div>
              )}
              <form className="form-log" onSubmit={handleSubmit}>
                <div className="form-content">
                  <fieldset className="tf-field">
                    <label htmlFor="name-register" className="tf-lable fw-medium">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input ref={nameRef} type="text" id="name-register" placeholder="Your full name" required />
                  </fieldset>

                  <fieldset className="tf-field">
                    <label htmlFor="phone-register" className="tf-lable fw-medium">
                      Phone Number <span className="text-primary">*</span>
                    </label>
                    <div className="d-flex align-items-center" style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
                      <span className="px-3 fw-medium" style={{ backgroundColor: "#f8f9fa", borderRight: "1px solid #ddd" }}>+{MY_COUNTRY_CODE}</span>
                      <input
                        type="tel"
                        id="phone-register"
                        inputMode="numeric"
                        maxLength={12}
                        placeholder="12-345 6789"
                        value={formatMalaysiaDisplay(phone)}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        required
                        style={{ border: "none", outline: "none", width: "100%", padding: "10px 12px" }}
                      />
                    </div>
                  </fieldset>

                  <fieldset className="tf-field">
                    <label htmlFor="email-register" className="tf-lable fw-medium">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input ref={emailRef} type="email" id="email-register" placeholder="your@email.com" required />
                  </fieldset>

                  <fieldset className="tf-field password-wrapper">
                    <label htmlFor="password-register" className="tf-lable fw-medium">
                      Password <span className="text-primary">*</span>
                    </label>
                    <PasswordField inputRef={passRef} id="password-register" placeholder="Min. 6 characters" required />
                  </fieldset>

                  <fieldset className="tf-field password-wrapper">
                    <label htmlFor="re-password-register" className="tf-lable fw-medium">
                      Confirm Password <span className="text-primary">*</span>
                    </label>
                    <PasswordField inputRef={confirmRef} id="re-password-register" placeholder="Repeat password" required />
                  </fieldset>
                </div>

                <button type="submit" className="action-create-account tf-btn animate-btn" disabled={loading}>
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-5 me-auto">
            <div className="col-right">
              <h4 className="mb-8">Already have an account?</h4>
              <p className="cl-text-2 mb-20">
                Welcome back. Sign in to access your personalized experience,
                saved preferences, and more.
              </p>
              <Link to={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="tf-btn animate-btn">Login</Link>
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Log;
