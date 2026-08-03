import { Link } from "react-router-dom";
import ResetPasswordFlow from "@/components/auth/ResetPasswordFlow";

function Log() {
  return (
    <section className="section-log flat-spacing">
      <div className="container">
        <div className="row align-items-center gy-30">
          <div className="col-md-5 ms-auto">
            <div className="col-left">
              <h4 className="title mb-10">Reset your password</h4>
              <p className="cl-text-2 mb-20">
                We&apos;ll email you a verification code. After verifying, you can choose a new password.
              </p>
              <ResetPasswordFlow variant="page" />
            </div>
          </div>
          <div className="col-md-5 me-auto">
            <div className="col-right">
              <h4 className="mb-8">Already have an account?</h4>
              <p className="cl-text-2 mb-20">
                Welcome back. Sign in to access your personalized experience,
                saved preferences, and more.
              </p>
              <Link to="/login" className="tf-btn animate-btn">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Log;
