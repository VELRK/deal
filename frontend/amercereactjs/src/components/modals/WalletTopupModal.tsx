import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "@/components/Modal";
import { paymentAPI, userAPI } from "@/services/api";
import { loadRazorpayScript } from "@/utils/razorpay";
import { curlecCheckoutRedirect } from "@/utils/curlecPayment";
import { formatPrice } from "@/utils/formatPrice";

const BASE_PRESETS = [100, 150, 200, 250, 500] as const;
const MIN_TOPUP_RM = 100;

interface WalletTopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
  orderPayable?: number;
  shortfall?: number;
  onSuccess?: (newBalance?: number) => void;
}

export default function WalletTopupModal({
  isOpen,
  onClose,
  currentBalance = 0,
  orderPayable,
  shortfall,
  onSuccess,
}: WalletTopupModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initialize or update suggested amount when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      setLoading(false);
      if (shortfall && shortfall > 0) {
        const suggested = Math.max(MIN_TOPUP_RM, Math.ceil(shortfall));
        setAmount(String(suggested));
      } else {
        setAmount(String(MIN_TOPUP_RM));
      }
    }
  }, [isOpen, shortfall]);

  const numericAmount = parseFloat(amount);
  const isAmountTooLow =
    amount.trim() !== "" && (!Number.isFinite(numericAmount) || numericAmount < MIN_TOPUP_RM);

  function handlePresetClick(val: number) {
    setAmount(String(val));
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
    callback_url?: string;
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
      image: new URL(
        "assets/logo/logo.png",
        window.location.origin + import.meta.env.BASE_URL,
      ).href,
      prefill: d.prefill ?? {},
      theme: { color: "#3EC1BC" },
      ...curlecCheckoutRedirect(d.callback_url),
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
            const bal = verifyRes.data.data?.balance ?? verifyRes.data.data?.balance_rm;
            const newBal = bal != null ? Number(bal) : currentBalance + numericAmount;
            setSuccessMsg(
              verifyRes.data.message ||
                `RM ${numericAmount.toFixed(2)} added to your wallet!`,
            );
            if (onSuccess) {
              onSuccess(newBal);
            }
            setTimeout(() => {
              onClose();
            }, 1200);
          } else {
            setError(verifyRes.data?.message || "Payment verification failed.");
          }
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setError(msg ?? "Payment received but verification failed. Please contact support.");
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

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount to top up.");
      return;
    }
    if (numericAmount < MIN_TOPUP_RM) {
      setError(`Minimum top-up is RM ${MIN_TOPUP_RM.toFixed(2)}. Please enter RM ${MIN_TOPUP_RM} or more.`);
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
          callback_url: (d as { callback_url?: string }).callback_url,
        });
        return;
      }

      if (gateway === "toyyibpay" && d.payment_url) {
        window.location.href = d.payment_url;
        return;
      }

      if (d.credited || gateway === "sandbox") {
        const newBal = currentBalance + numericAmount;
        setSuccessMsg(
          res.data.message || `RM ${numericAmount.toFixed(2)} added to your wallet!`,
        );
        if (onSuccess) {
          onSuccess(newBal);
        }
        setLoading(false);
        setTimeout(() => {
          onClose();
        }, 1200);
        return;
      }

      setError("Payment gateway did not return a checkout session. Contact support.");
      setLoading(false);
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errMsg ?? "Failed to start top-up. Please try again.");
      setLoading(false);
    }
  }

  const walletIcon = (
    <span style={{ fontSize: "20px", display: "inline-flex", alignItems: "center" }}>
      👛
    </span>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="520px">
      <ModalHeader
        title="Add Funds to Wallet"
        subtitle="Top up instantly via FPX / Net Banking / Card"
        onClose={onClose}
        icon={walletIcon}
      />
      <ModalBody>
        <div className="wallet-modal-content">
          <style>{`
            .wallet-modal-content {
              font-family: inherit;
            }
            .wallet-summary-banner {
              background: linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%);
              border: 1px solid #99f6e4;
              border-radius: 12px;
              padding: 14px 16px;
              margin-bottom: 18px;
            }
            .wallet-summary-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 13.5px;
              color: #115e59;
              margin-bottom: 4px;
            }
            .wallet-summary-row:last-child {
              margin-bottom: 0;
            }
            .wallet-summary-row.shortfall-highlight {
              border-top: 1px dashed #99f6e4;
              padding-top: 6px;
              margin-top: 6px;
              font-weight: 700;
              color: #b91c1c;
            }
            .wallet-input-group {
              margin-bottom: 16px;
            }
            .wallet-input-label {
              display: block;
              font-size: 13.5px;
              font-weight: 600;
              color: #334155;
              margin-bottom: 6px;
            }
            .wallet-input-wrapper {
              position: relative;
              display: flex;
              align-items: center;
            }
            .wallet-amount-input {
              width: 100%;
              height: 50px;
              padding: 10px 14px;
              font-size: 20px;
              font-weight: 700;
              color: #0f172a;
              border: 1.5px solid #cbd5e1;
              border-radius: 10px;
              outline: none;
              transition: all 0.2s ease;
            }
            .wallet-amount-input:focus {
              border-color: #3ec1bc;
              box-shadow: 0 0 0 3px rgba(62, 193, 188, 0.15);
            }
            .wallet-presets {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 12px;
            }
            .wallet-preset-btn {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              color: #334155;
              padding: 8px 14px;
              font-size: 13px;
              font-weight: 600;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .wallet-preset-btn:hover {
              background: #f1f5f9;
              border-color: #cbd5e1;
            }
            .wallet-preset-btn.active {
              background: #f0fdfa;
              border-color: #3ec1bc;
              color: #0f766e;
              box-shadow: 0 0 0 1px #3ec1bc;
            }
            .wallet-preset-btn.shortfall-btn {
              background: #fffbeb;
              border-color: #fde68a;
              color: #b45309;
            }
            .wallet-preset-btn.shortfall-btn.active {
              background: #fef3c7;
              border-color: #f59e0b;
              color: #92400e;
              box-shadow: 0 0 0 1px #f59e0b;
            }
            .wallet-gateway-info {
              display: flex;
              align-items: center;
              gap: 8px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 10px 12px;
              font-size: 12.5px;
              color: #475569;
              margin-top: 16px;
            }
            .wallet-modal-actions {
              display: flex;
              justify-content: flex-end;
              gap: 10px;
              margin-top: 22px;
              padding-top: 16px;
              border-top: 1px solid #f1f5f9;
            }
            .btn-wallet-cancel {
              padding: 10px 18px;
              font-size: 14px;
              font-weight: 600;
              border-radius: 8px;
              background: #fff;
              border: 1px solid #d1d5db;
              color: #475569;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .btn-wallet-cancel:hover {
              background: #f8fafc;
            }
            .btn-wallet-submit {
              padding: 10px 22px;
              font-size: 14px;
              font-weight: 700;
              border-radius: 8px;
              background: #3ec1bc;
              border: 1px solid #3ec1bc;
              color: #fff;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: all 0.2s ease;
              box-shadow: 0 2px 6px rgba(62, 193, 188, 0.25);
            }
            .btn-wallet-submit:hover:not(:disabled) {
              background: #2bb0ab;
              border-color: #2bb0ab;
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(62, 193, 188, 0.35);
            }
            .btn-wallet-submit:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          `}</style>

          {/* Current balance & shortfall context if from checkout */}
          <div className="wallet-summary-banner">
            <div className="wallet-summary-row">
              <span>Current Wallet Balance:</span>
              <strong>{formatPrice(currentBalance)}</strong>
            </div>
            {orderPayable != null && orderPayable > 0 && (
              <div className="wallet-summary-row">
                <span>Order Total Payable:</span>
                <strong>{formatPrice(orderPayable)}</strong>
              </div>
            )}
            {shortfall != null && shortfall > 0 && (
              <div className="wallet-summary-row shortfall-highlight">
                <span>Shortfall needed for order:</span>
                <span>{formatPrice(shortfall)}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-danger py-2 mb-3" style={{ fontSize: "13.5px" }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2 mb-3" style={{ fontSize: "13.5px" }}>
              ✓ {successMsg}
            </div>
          )}

          <form onSubmit={handleTopup}>
            <div className="wallet-input-group">
              <label className="wallet-input-label" htmlFor="wallet-topup-amount">
                Top-up Amount (MYR)
              </label>
              <div className="wallet-input-wrapper">
                <input
                  id="wallet-topup-amount"
                  type="number"
                  step="0.01"
                  min={MIN_TOPUP_RM}
                  required
                  className="wallet-amount-input"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                />
              </div>

              <div
                style={{
                  fontSize: "12.5px",
                  marginTop: "6px",
                  color: isAmountTooLow ? "#b91c1c" : "#64748b",
                  fontWeight: isAmountTooLow ? 600 : 400,
                }}
              >
                Minimum top-up is RM {MIN_TOPUP_RM.toFixed(2)}.
              </div>

              {/* Presets */}
              <div className="wallet-presets">
                {shortfall != null && shortfall > 0 && (
                  <button
                    type="button"
                    className={`wallet-preset-btn shortfall-btn ${
                      amount === String(Math.max(MIN_TOPUP_RM, Math.ceil(shortfall))) ? "active" : ""
                    }`}
                    onClick={() => handlePresetClick(Math.max(MIN_TOPUP_RM, Math.ceil(shortfall)))}
                    disabled={loading}
                  >
                    ⚡ Top up Needed: RM {Math.max(MIN_TOPUP_RM, Math.ceil(shortfall))}
                  </button>
                )}
                {BASE_PRESETS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`wallet-preset-btn ${amount === String(val) ? "active" : ""}`}
                    onClick={() => handlePresetClick(val)}
                    disabled={loading}
                  >
                    RM {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="wallet-gateway-info">
              <span>🔒</span>
              <span>
                Instant top-up via <strong>FPX Net Banking, Credit/Debit Cards, & E-Wallets</strong>.
              </span>
            </div>

            <div className="wallet-modal-actions">
              <button
                type="button"
                className="btn-wallet-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-wallet-submit"
                disabled={loading || isAmountTooLow || !amount.trim()}
              >
                {loading ? "Processing..." : `Pay & Add ${amount ? `RM ${amount}` : "Funds"}`}
              </button>
            </div>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
}
