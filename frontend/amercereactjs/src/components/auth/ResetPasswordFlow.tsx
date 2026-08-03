import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";

const CODE_LENGTH = 6;

type Step = "email" | "verify" | "password" | "done";

type ResetPasswordFlowProps = {
  variant?: "modal" | "page";
  onSuccess?: () => void;
  signInHref?: string;
};

function extractMessage(err: unknown, fallback: string) {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;
}

export default function ResetPasswordFlow({
  variant = "page",
  onSuccess,
  signInHref = "/login",
}: ResetPasswordFlowProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  const codeValue = codeDigits.join("");

  const handleCodeDigit = useCallback((idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    setCodeDigits((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < CODE_LENGTH - 1) {
      codeRefs.current[idx + 1]?.focus();
    }
  }, []);

  const handleCodeKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codeDigits[idx] && idx > 0) {
      codeRefs.current[idx - 1]?.focus();
    }
  }, [codeDigits]);

  const handleCodePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const next = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setCodeDigits(next);
    const lastFilled = Math.min(pasted.length, CODE_LENGTH - 1);
    codeRefs.current[lastFilled]?.focus();
  }, []);

  async function handleSendCode(e?: React.FormEvent, resendEmail?: string) {
    e?.preventDefault();
    setError("");
    setHint("");
    const emailVal = resendEmail ?? emailRef.current?.value.trim() ?? "";
    if (!emailVal) {
      setError("Email address is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email: emailVal });
      const body = res.data as { success: boolean; message: string; data?: { dev_code?: string } };
      if (!body.success) {
        setError(body.message ?? "Failed to send verification code.");
        return;
      }
      setEmail(emailVal);
      setCodeDigits(Array(CODE_LENGTH).fill(""));
      setStep("verify");
      setHint(body.data?.dev_code ? `Dev code: ${body.data.dev_code}` : body.message);
      setTimeout(() => codeRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setError(extractMessage(err, "Failed to send verification code."));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (codeValue.length < CODE_LENGTH) {
      setError(`Enter all ${CODE_LENGTH} digits from your email.`);
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.verifyResetCode({ email, code: codeValue });
      const body = res.data as { success: boolean; message: string; data?: { reset_token?: string } };
      if (!body.success || !body.data?.reset_token) {
        setError(body.message ?? "Invalid verification code.");
        return;
      }
      setResetToken(body.data.reset_token);
      setStep("password");
      setHint(body.message);
    } catch (err: unknown) {
      setError(extractMessage(err, "Invalid or expired verification code."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const password = passRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email,
        reset_token: resetToken,
        password,
        password_confirmation: confirm,
      });
      const body = res.data as { success: boolean; message: string };
      if (!body.success) {
        setError(body.message ?? "Unable to reset password.");
        return;
      }
      setStep("done");
      setHint(body.message);
      onSuccess?.();
    } catch (err: unknown) {
      setError(extractMessage(err, "Unable to reset password. Please verify your email again."));
    } finally {
      setLoading(false);
    }
  }

  const signInLink =
    variant === "modal" ? (
      <a href="#sign" data-bs-toggle="modal" className="text-primary text-decoration-underline">
        Sign In
      </a>
    ) : (
      <Link to={signInHref} className="text-primary text-decoration-underline">
        Sign In
      </Link>
    );

  return (
    <>
      {error && (
        <div className="alert alert-danger py-2 px-3 mb-16 text-caption-01" role="alert">
          {error}
        </div>
      )}
      {hint && step !== "done" && (
        <div className="alert alert-info py-2 px-3 mb-16 text-caption-01" role="status">
          {hint}
        </div>
      )}

      {step === "email" && (
        <form className="form-log" onSubmit={handleSendCode} noValidate>
          <div className="form-content">
            <fieldset className="tf-field">
              <label htmlFor="reset-email" className="tf-lable fw-medium">
                Email address <span className="text-primary">*</span>
              </label>
              <input
                ref={emailRef}
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </fieldset>
          </div>
          <div className="group-action">
            <button type="submit" className="tf-btn animate-btn w-100" disabled={loading}>
              {loading ? "Sending…" : "Send Verification Code"}
            </button>
            <p className="orther-log text-center mt-12">
              Remember your password? {signInLink}
            </p>
          </div>
        </form>
      )}

      {step === "verify" && (
        <form className="form-log" onSubmit={handleVerifyCode} noValidate>
          <div className="text-center mb-24">
            <p className="mb-4">
              Verification code sent to <strong>{email}</strong>
            </p>
            <p className="text-muted small">Enter the 6-digit code from your email</p>
          </div>
          <div className="d-flex justify-content-center gap-2 mb-24" onPaste={handleCodePaste}>
            {codeDigits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { codeRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                style={{
                  width: "44px",
                  height: "52px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
                onChange={(e) => handleCodeDigit(i, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(i, e)}
              />
            ))}
          </div>
          <div className="group-action">
            <button
              type="submit"
              className="tf-btn animate-btn w-100"
              disabled={loading || codeValue.length < CODE_LENGTH}
            >
              {loading ? "Verifying…" : "Verify Email"}
            </button>
            <div className="d-flex justify-content-between align-items-center mt-16">
              <button
                type="button"
                className="bg-transparent border-0 text-primary small text-decoration-underline"
                onClick={() => { setStep("email"); setCodeDigits(Array(CODE_LENGTH).fill("")); setError(""); setHint(""); }}
              >
                ← Change email
              </button>
              <button
                type="button"
                className="bg-transparent border-0 text-muted small"
                disabled={loading}
                onClick={() => handleSendCode(undefined, email)}
              >
                Resend code
              </button>
            </div>
          </div>
        </form>
      )}

      {step === "password" && (
        <form className="form-log" onSubmit={handleResetPassword} noValidate>
          <div className="form-content">
            <fieldset className="tf-field password-wrapper">
              <label htmlFor="reset-pass" className="tf-lable fw-medium">
                New password <span className="text-primary">*</span>
              </label>
              <PasswordField inputRef={passRef} id="reset-pass" placeholder="Enter new password" required />
            </fieldset>
            <fieldset className="tf-field password-wrapper">
              <label htmlFor="reset-pass-confirm" className="tf-lable fw-medium">
                Confirm password <span className="text-primary">*</span>
              </label>
              <PasswordField inputRef={confirmRef} id="reset-pass-confirm" placeholder="Confirm new password" required />
            </fieldset>
          </div>
          <div className="group-action">
            <button type="submit" className="tf-btn animate-btn w-100" disabled={loading}>
              {loading ? "Updating…" : "Set New Password"}
            </button>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className="text-center">
          <p className="text-success mb-20">{hint || "Password updated successfully."}</p>
          {variant === "modal" ? (
            <a href="#sign" data-bs-toggle="modal" className="tf-btn animate-btn w-100">
              Sign In
            </a>
          ) : (
            <Link to={signInHref} className="tf-btn animate-btn">
              Sign In
            </Link>
          )}
        </div>
      )}
    </>
  );
}
