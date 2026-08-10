import { Navigate } from "react-router-dom";

/** Password login removed — forgot-password redirects to OTP login. */
const ForgetPasswordPage = () => <Navigate to="/login" replace />;

export default ForgetPasswordPage;
