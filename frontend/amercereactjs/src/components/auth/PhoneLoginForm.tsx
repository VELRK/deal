import { useCallback, useRef, useState } from "react";
import { authAPI } from "@/services/api";
import type { ApiUser } from "@/services/api";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  formatMalaysiaIntl,
  isValidMalaysiaMobile,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";

const OTP_LENGTH = 4;
const DEV_TEST_PHONE_LOCAL = "0180000000";
const DEV_TEST_OTP = "1234";
const IS_DEV = import.meta.env.DEV;

export type OtpAuthResult = {
  token: string;
  user: ApiUser;
  is_new?: boolean;
  profile_complete?: boolean;
  has_address?: boolean;
};

type Props = {
  /** Called after successful OTP verify (before navigation). */
  onSuccess: (result: OtpAuthResult) => void | Promise<void>;
  /** Optional form id prefix when multiple instances exist. */
  idPrefix?: string;
  /** Compact styling for modal vs full page. */
  variant?: "modal" | "page";
};

export default function PhoneLoginForm({
  onSuccess,
  idPrefix = "phone-login",
  variant = "modal",
}: Props) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [sentPhone, setSentPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpValue = otpDigits.join("");

  const handleOtpDigit = useCallback((idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus();
  }, []);

  const handleOtpKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }, [otpDigits]);

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }, []);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidMalaysiaMobile(phone.trim())) {
      setError(MY_PHONE_ERROR);
      return;
    }
    const e164 = toMalaysiaE164(phone.trim());
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.otpRequest({ phone: e164 });
      const r = res.data as {
        success: boolean;
        message: string;
        data?: { test_otp?: string; dev_hint?: string };
      };
      if (r.success) {
        setSentPhone(e164);
        setStep("otp");
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
        const devHint = r.data?.dev_hint ?? r.data?.test_otp
          ? `Developer OTP: ${r.data?.test_otp ?? DEV_TEST_OTP}`
          : "";
        setHint(devHint);
      } else {
        setError(r.message ?? "Failed to send OTP.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to send OTP. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.otpVerify({ phone: sentPhone, otp: otpValue });
      const r = res.data as {
        success: boolean;
        message?: string;
        data?: OtpAuthResult;
      };
      if (r.success && r.data?.token && r.data.user) {
        await onSuccess(r.data);
      } else {
        setError(r.message ?? "Invalid OTP.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const requestFormId = `${idPrefix}-request`;
  const verifyFormId = `${idPrefix}-verify`;
  const inputPad = variant === "page" ? "14px 16px" : "12px";

  return (
    <div>
      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            color: "#DC2626",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {step === "phone" ? (
        <form id={requestFormId} onSubmit={handleRequestOTP} noValidate>
          <div className="mb-3">
            <div
              className="d-flex align-items-center"
              style={{ border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}
            >
              <span
                className="px-3 fw-medium"
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRight: "1px solid #E2E8F0",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                +{MY_COUNTRY_CODE}
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={12}
                placeholder="Enter mobile number"
                value={formatMalaysiaDisplay(phone)}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
                  setError("");
                }}
                required
                autoFocus
                style={{ width: "100%", padding: inputPad, border: "none", outline: "none" }}
              />
            </div>
            {IS_DEV && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 12px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#166534",
                }}
              >
                <strong>Developer test</strong>
                <br />
                Mobile:{" "}
                <button
                  type="button"
                  className="border-0 bg-transparent p-0 text-decoration-underline"
                  style={{ color: "#166534", cursor: "pointer" }}
                  onClick={() => setPhone(DEV_TEST_PHONE_LOCAL)}
                >
                  018-000 0000
                </button>
                {" · "}OTP: <strong>{DEV_TEST_OTP}</strong>
              </div>
            )}
          </div>
        </form>
      ) : (
        <form id={verifyFormId} onSubmit={handleVerifyOTP} noValidate>
          {hint && (
            <p style={{ color: "#0f766e", fontSize: "13px", marginBottom: "16px" }}>{hint}</p>
          )}
          <div className="text-center mb-3">
            <p className="mb-0" style={{ fontSize: "14px", color: "#64748B" }}>
              {formatMalaysiaIntl(sentPhone)}
            </p>
          </div>
          <div className="d-flex justify-content-center gap-3 mb-4" onPaste={handleOtpPaste}>
            {otpDigits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                autoFocus={i === 0}
                style={{
                  width: "50px",
                  height: "56px",
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: 600,
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  backgroundColor: d ? "#F8FAFC" : "#fff",
                  outlineColor: "#3EC1BC",
                }}
                onChange={(e) => handleOtpDigit(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
              />
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="bg-transparent border-0 text-decoration-underline"
              onClick={() => {
                setStep("phone");
                setOtpDigits(Array(OTP_LENGTH).fill(""));
                setError("");
                setHint("");
              }}
              style={{ fontSize: "13px", color: "#0f766e", cursor: "pointer" }}
            >
              ← Change number
            </button>
            <button
              type="button"
              className="bg-transparent border-0"
              disabled={loading}
              onClick={() => {
                const fakeEvent = { preventDefault() {} } as React.FormEvent;
                void handleRequestOTP(fakeEvent);
              }}
              style={{ fontSize: "13px", color: "#64748B", cursor: "pointer" }}
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}

      <button
        type="button"
        className="tf-btn animate-btn w-100 mt-4"
        disabled={loading}
        onClick={() => {
          const form = document.getElementById(step === "phone" ? requestFormId : verifyFormId) as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        style={{ minHeight: 48 }}
      >
        {loading ? "Please wait…" : step === "phone" ? "Request OTP" : "Verify"}
      </button>
    </div>
  );
}
