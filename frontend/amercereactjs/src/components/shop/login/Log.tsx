import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiUser } from "@/services/api";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  formatMalaysiaIntl,
  isValidMalaysiaMobile,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";
import { sanitizeAuthRedirect, rememberAuthReturn } from "@/utils/authRedirect";

const OTP_LENGTH = 4;

function Log() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuthStore();

  // Honour ?redirect= so e.g. /login?redirect=/view-cart goes back there after login
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

  const [tab, setTab] = useState<"email" | "otp">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [sentPhoneE164, setSentPhoneE164] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const otpEmailRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Email login ── */
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login({
        email: emailRef.current?.value.trim() ?? "",
        password: passRef.current?.value ?? "",
      });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message ?? e?.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP request ── */
  async function handleOtpRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidMalaysiaMobile(otpPhone)) {
      setError(MY_PHONE_ERROR);
      return;
    }
    const e164 = toMalaysiaE164(otpPhone);
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
    const otpValue = otpDigits.join("");
    if (!sentPhoneE164 || otpValue.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.otpVerify({ phone: sentPhoneE164, otp: otpValue });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <>
      <section className="section-log flat-spacing" style={{ backgroundColor: "#f8f9fa", minHeight: "80vh", display: "flex", alignItems: "center", padding: "60px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12">
              <div className="login-popup-wrapper bg-white shadow-lg p-4 p-md-5" style={{ borderRadius: "20px" }}>
                <div className="row align-items-center gy-30">
                  <div className="col-md-5 ms-auto">
                    <div className="col-left">
                      <h4 className="title mb-20">Login</h4>

                      {/* Tab switcher */}
                      <div className="d-flex mb-20 pb-2" style={{ borderBottom: "1px solid #eee" }}>
                        <button
                          type="button"
                          className={`flex-grow-1 border-0 bg-transparent fw-medium pb-2 ${tab === "email" ? "text-primary border-bottom border-primary" : "text-muted"}`}
                          onClick={() => { setTab("email"); setOtpSent(false); setError(""); }}
                        >
                          Password
                        </button>
                        <button
                          type="button"
                          className={`flex-grow-1 border-0 bg-transparent fw-medium pb-2 ${tab === "otp" ? "text-primary border-bottom border-primary" : "text-muted"}`}
                          onClick={() => { setTab("otp"); setOtpSent(false); setError(""); }}
                        >
                          OTP
                        </button>
                      </div>

                      {error && (
                        <div className="alert alert-danger py-2 px-3 mb-16 text-caption-01" role="alert">
                          {error}
                        </div>
                      )}

                      {tab === "email" ? (
                        <form className="form-log" onSubmit={handleEmailSubmit}>
                          <div className="form-content">
                            <fieldset className="tf-field">
                              <label htmlFor="user-email" className="tf-lable fw-medium">
                                Email Address <span className="text-primary">*</span>
                              </label>
                              <input
                                ref={emailRef}
                                type="email"
                                id="user-email"
                                placeholder="your@email.com"
                                required
                              />
                            </fieldset>
                            <fieldset className="tf-field password-wrapper">
                              <label htmlFor="user-pass" className="tf-lable fw-medium">
                                Password <span className="text-primary">*</span>
                              </label>
                              <PasswordField inputRef={passRef} id="user-pass" placeholder="Password" required />
                            </fieldset>
                            <fieldset className="field-bottom mb-20">
                              <div className="checkbox-wrap">
                                <input className="tf-check style-2" type="checkbox" id="remember-2" />
                                <label htmlFor="remember-2"> Remember me </label>
                              </div>
                              <Link to="/forget-password" className="link text-decoration-underline">
                                <span className="text-caption-01 fw-semibold">Forgot Password?</span>
                              </Link>
                            </fieldset>
                          </div>
                          <button type="submit" className="tf-btn animate-btn w-100" disabled={loading}>
                            {loading ? "Signing in…" : "Login"}
                          </button>
                        </form>
                      ) : !otpSent ? (
                        <form className="form-log" onSubmit={handleOtpRequest}>
                          <div className="form-content">
                            <fieldset className="tf-field">
                              <label htmlFor="otp-phone" className="tf-lable fw-medium">
                                Phone Number <span className="text-primary">*</span>
                              </label>
                              <div className="d-flex align-items-center" style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
                                <span className="px-3 fw-medium" style={{ backgroundColor: "#f8f9fa", borderRight: "1px solid #ddd" }}>+{MY_COUNTRY_CODE}</span>
                                <input
                                  ref={otpEmailRef}
                                  type="tel"
                                  id="otp-phone"
                                  inputMode="numeric"
                                  maxLength={12}
                                  placeholder="12-345 6789"
                                  value={formatMalaysiaDisplay(otpPhone)}
                                  onChange={(e) => { setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setError(""); }}
                                  required
                                  style={{ border: "none", outline: "none", width: "100%", padding: "10px 12px" }}
                                />
                              </div>
                            </fieldset>
                          </div>
                          <button type="submit" className="tf-btn animate-btn w-100" disabled={loading}>
                            {loading ? "Sending OTP…" : "Send OTP"}
                          </button>
                        </form>
                      ) : (
                        <form className="form-log" onSubmit={handleOtpVerify}>
                          <div className="text-center mb-20">
                            <p className="mb-4">OTP sent to <strong>{formatMalaysiaIntl(sentPhoneE164)}</strong></p>
                            <p className="text-muted small">Enter the {OTP_LENGTH}-digit code (e.g. 1234)</p>
                          </div>
                          <div className="d-flex justify-content-center gap-2 mb-24">
                            {otpDigits.map((d, i) => (
                              <input
                                key={i}
                                ref={(el) => { otpRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={d}
                                style={{
                                  width: "48px",
                                  height: "54px",
                                  textAlign: "center",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px"
                                }}
                                onChange={(e) => handleOtpDigit(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                              />
                            ))}
                          </div>
                          <button type="submit" className="tf-btn animate-btn w-100 mb-16" disabled={loading || otpDigits.join("").length < OTP_LENGTH}>
                            {loading ? "Verifying…" : "Verify & Login"}
                          </button>
                          <button
                            type="button"
                            className="w-100 bg-transparent border-0 text-muted small"
                            onClick={() => setOtpSent(false)}
                          >
                            ← Change number
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                  <div className="col-md-5 me-auto">
                    <div className="col-right">
                      <h4 className="mb-8">New Customer</h4>
                      <p className="cl-text-2 mb-20">
                        Be part of our growing family of new customers! Join us today
                        and unlock a world of exclusive benefits, offers, and
                        personalized experiences.
                      </p>
                      <Link to={`/register?redirect=${encodeURIComponent(redirectTo)}`} className="tf-btn animate-btn">
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Log;
