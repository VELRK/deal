import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PhoneLoginForm, { type OtpAuthResult } from "@/components/auth/PhoneLoginForm";
import { sanitizeAuthRedirect, rememberAuthReturn } from "@/utils/authRedirect";

function Log() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuthStore();

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

  const finishLogin = async (result: OtpAuthResult) => {
    login(result.token, result.user);
    try {
      const { afterLoginCartSync } = await import("@/utils/cartSync");
      await afterLoginCartSync();
    } catch {
      /* ignore */
    }
    // Return to where they came from; checkout asks for name/email/address if needed
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div
              className="p-4 p-md-5"
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #eef2f7",
                boxShadow: "0 8px 30px rgba(15,23,42,.04)",
              }}
            >
              <h3 className="fw-semibold mb-3" style={{ fontSize: 24 }}>Login</h3>
              <PhoneLoginForm onSuccess={finishLogin} idPrefix="page-otp" variant="page" />
              <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: 13 }}>
                By continuing, you agree to our{" "}
                <Link to="/terms-of-use">Terms</Link> &{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Log;
