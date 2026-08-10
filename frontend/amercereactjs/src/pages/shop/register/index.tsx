import { Navigate, useLocation } from "react-router-dom";

/** Register is merged into phone-OTP login — send users there. */
const RegisterPage = () => {
  const location = useLocation();
  const qs = location.search || "";
  const redirect = new URLSearchParams(qs).get("redirect");
  const to = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : "/login";
  return <Navigate to={to} replace />;
};

export default RegisterPage;
