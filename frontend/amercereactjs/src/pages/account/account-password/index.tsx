import { Navigate } from "react-router-dom";

/** Password login removed — redirect to account settings. */
const AccountPasswordPage = () => <Navigate to="/account-setting" replace />;

export default AccountPasswordPage;
