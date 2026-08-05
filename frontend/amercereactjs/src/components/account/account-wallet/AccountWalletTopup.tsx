import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { paymentAPI, userAPI } from "@/services/api";
import { loadRazorpayScript } from "@/utils/razorpay";

const POINTS_PER_RM = 5;
const presets = [50, 100, 200, 500];

export default function AccountWalletTopup() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const numericAmount = parseFloat(amount);
  const pointsPreview = useMemo(() => {
    if (isNaN(numericAmount) || numericAmount <= 0) return 0;
    return Math.round(numericAmount * POINTS_PER_RM);
  }, [numericAmount]);

  function handlePresetClick(val: number) {
    setAmount(val.toString());
    setError(null);
  }

  async function openRazorpayCheckout(d: {
    reference: string;
    amount_rm?: number;
    points?: number;
    razorpay_order_id: string;
    amount: number;
    currency: string;
    key_id: string;
    prefill?: { name: string; email: string; contact: string };
  }) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Could not load payment gateway. Please try again.");
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: d.key_id,
      amount: d.amount,
      currency: d.currency,
      order_id: d.razorpay_order_id,
      name: "2Deal",
      description: `Wallet top-up RM ${(d.amount_rm ?? numericAmount).toFixed(2)}`,
      image: `${import.meta.env.BASE_URL}assets/logo/logo.png`,
      prefill: d.prefill ?? {},
      theme: { color: "#3EC1BC" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifyRes = await paymentAPI.verifyWalletTopup({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            reference: d.reference,
          });
          if (verifyRes.data?.success) {
            setSuccessMsg(
              verifyRes.data.message ||
                `RM ${numericAmount.toFixed(2)} added to your wallet${d.points ? ` (${d.points} pts)` : ""}.`,
            );
            setTimeout(() => navigate("/account-wallet?topup=success"), 1200);
          } else {
            setError(verifyRes.data?.message || "Payment verification failed.");
          }
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setError(msg ?? "Payment received but verification failed. Contact support.");
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setError("Payment cancelled. No amount was charged.");
          setLoading(false);
        },
      },
    });
    rzp.open();
  }

  async function handleTopup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (isNaN(numericAmount) || numericAmount < 1) {
      setError("Enter at least RM 1.00 to top up.");
      return;
    }

    setLoading(true);
    try {
      const res = await userAPI.topupWallet({ amount: numericAmount });
      if (!res.data?.success) {
        setError(res.data?.message || "Failed to start top-up.");
        setLoading(false);
        return;
      }

      const d = res.data.data;
      const gateway = d.gateway ?? (d.payment_url ? "toyyibpay" : d.credited ? "sandbox" : undefined);

      if (gateway === "razorpay" && d.razorpay_order_id && d.key_id && d.amount && d.currency && d.reference) {
        await openRazorpayCheckout({
          reference: d.reference,
          amount_rm: d.amount_rm,
          points: d.points,
          razorpay_order_id: d.razorpay_order_id,
          amount: d.amount,
          currency: d.currency,
          key_id: d.key_id,
          prefill: d.prefill,
        });
        return;
      }

      if (gateway === "toyyibpay" && d.payment_url) {
        window.location.href = d.payment_url;
        return;
      }

      if (d.credited || gateway === "sandbox") {
        setSuccessMsg(
          res.data.message ||
            `RM ${numericAmount.toFixed(2)} added${d.points ? ` (${d.points} pts)` : ""}.`,
        );
        setLoading(false);
        setTimeout(() => navigate("/account-wallet?topup=success"), 1500);
        return;
      }

      setError("Payment gateway did not return a checkout URL. Contact support.");
      setLoading(false);
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errMsg ?? "Failed to start top-up. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AccountSection title="Add Funds to Wallet">
      <div className="topup-container-custom">
        <style>{`
          .topup-container-custom { font-family: 'Inter', sans-serif; color: #222; }
          .topup-card-custom {
            background: #fff; border-radius: 20px; border: 1px solid rgba(193,16,105,.06);
            padding: 32px; box-shadow: 0 4px 24px rgba(193,16,105,.02); max-width: 600px;
          }
          @media (max-width: 576px) {
            .topup-card-custom { padding: 20px 16px; }
            .presets-list { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .preset-btn { width: 100%; text-align: center; }
            .form-actions { flex-direction: column-reverse; gap: 10px; }
            .btn-cancel, .btn-topup { width: 100%; text-align: center; justify-content: center; }
          }
          .form-group-custom { margin-bottom: 22px; }
          .form-group-custom label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
          .input-amount-wrapper { position: relative; display: flex; align-items: center; }
          .input-amount {
            width: 100%; height: 52px; padding: 10px 16px; font-size: 20px; font-weight: 700;
            border: 1px solid #d1d5db; border-radius: 10px; outline: none;
          }
          .input-amount:focus { border-color: #3ec1bc; box-shadow: 0 0 0 4px rgba(62,193,188,.1); }
          .points-preview { font-size: 13px; color: #0f766e; margin-top: 8px; }
          .gateway-note {
            background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 14px;
            font-size: 13px; color: #115e59; margin-bottom: 20px;
          }
          .presets-list { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
          .preset-btn {
            background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; padding: 8px 16px;
            font-size: 13px; font-weight: 600; border-radius: 8px; cursor: pointer;
          }
          .preset-btn.selected { background: #f0fdfa; border-color: #3ec1bc; color: #0f766e; }
          .form-actions {
            display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
            border-top: 1px solid #f1f5f9; padding-top: 20px;
          }
          .btn-cancel, .btn-topup {
            padding: 10px 20px; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none !important;
          }
          .btn-cancel { background: #fff; border: 1px solid #d1d5db; color: #475569; }
          .btn-topup { background: #3ec1bc; border: 1px solid #3ec1bc; color: #fff; cursor: pointer; }
          .btn-topup:disabled { opacity: .7; cursor: not-allowed; }
        `}</style>

        <div className="topup-card-custom">
          <div className="gateway-note">
            Pay securely via <strong>FPX / online banking / card</strong> (Razorpay or ToyyibPay).
            Funds are added to your wallet after payment is confirmed.
          </div>

          {error && <div className="alert alert-danger mb-4">{error}</div>}
          {successMsg && <div className="alert alert-success mb-4">✓ {successMsg}</div>}

          <form onSubmit={handleTopup}>
            <div className="form-group-custom">
              <label htmlFor="amount">Top-up amount (MYR)</label>
              <div className="input-amount-wrapper">
                <input
                  type="number"
                  id="amount"
                  className="input-amount"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(null); }}
                  required
                  min="1"
                  step="0.01"
                  disabled={loading}
                />
              </div>
              {pointsPreview > 0 && (
                <div className="points-preview">≈ {pointsPreview} wallet points (500 pts = RM 100)</div>
              )}
              <div className="presets-list">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`preset-btn ${amount === val.toString() ? "selected" : ""}`}
                    onClick={() => handlePresetClick(val)}
                    disabled={loading}
                  >
                    +RM {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <Link to="/account-wallet" className="btn-cancel">Cancel</Link>
              <button type="submit" className="btn-topup" disabled={loading}>
                {loading ? "Opening payment…" : "Pay & Add to Wallet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountSection>
  );
}
