import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PhoneLoginForm, { type OtpAuthResult } from "@/components/auth/PhoneLoginForm";
import { sanitizeAuthRedirect, rememberAuthReturn } from "@/utils/authRedirect";

function Log() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuthStore();

  const redirectTo = sanitizeAuthRedirect(
    new URLSearchParams(location.search).get("redirect"),
    "/",
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
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div
              className="p-4"
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #eef2f7",
              }}
            >
              <h3 className="fw-semibold mb-3" style={{ fontSize: 20 }}>Mobile number</h3>
              <PhoneLoginForm onSuccess={finishLogin} idPrefix="page-otp" variant="page" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Log;
