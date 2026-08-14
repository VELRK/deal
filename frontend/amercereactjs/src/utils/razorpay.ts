declare global {
  interface Window {
    Razorpay: new (options: object) => {
      open(): void;
      on(event: string, handler: (response: unknown) => void): void;
    };
  }
}

import { paymentAPI } from "@/services/api";
import { curlecCheckoutRedirect, curlecUserMessage } from "@/utils/curlecPayment";

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type CurlecPayData = {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  order_number?: string;
  callback_url?: string;
  prefill?: { name?: string; email?: string; contact?: string };
};

/**
 * Open Curlec for an existing shop order (checkout or My Orders retry).
 */
export async function completeOrderPayment(
  orderId: number,
  onMessage: (message: string) => void,
): Promise<"confirmed" | "pending" | "failed" | "cancelled"> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onMessage("Failed to load payment gateway. Please try again.");
    return "failed";
  }

  const payRes = await paymentAPI.createOrder({ order_id: orderId });
  const payData = payRes.data as {
    success?: boolean;
    message?: string;
    data?: CurlecPayData;
  };
  if (!payData.success || !payData.data?.razorpay_order_id) {
    onMessage(payData.message ?? "Payment gateway error. Please try again.");
    return "failed";
  }

  const pd = payData.data;
  const checkoutLogo = new URL(
    "assets/logo/logo.png",
    window.location.origin + import.meta.env.BASE_URL,
  ).href;

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key: pd.key_id,
      amount: pd.amount,
      currency: pd.currency,
      order_id: pd.razorpay_order_id,
      name: "2Deal",
      description: pd.order_number ? `Order #${pd.order_number}` : "2Deal order",
      image: checkoutLogo,
      prefill: pd.prefill ?? {},
      theme: { color: "#3EC1BC" },
      ...curlecCheckoutRedirect(pd.callback_url),
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifyRes = await paymentAPI.verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id: orderId,
          });
          const body = verifyRes.data as {
            success?: boolean;
            message?: string;
            data?: { confirmed?: boolean; pending?: boolean; failed?: boolean };
          };
          if (body?.data?.confirmed || body?.success) {
            if (body?.data?.pending) {
              onMessage(body.message || curlecUserMessage({ reason: "payment_pending_gateway" }).message);
              resolve("pending");
              return;
            }
            if (body?.data?.failed) {
              onMessage(body.message || curlecUserMessage().message);
              resolve("failed");
              return;
            }
            onMessage(body.message || "Payment successful! Your order is confirmed.");
            resolve("confirmed");
            return;
          }
          if (body?.data?.pending) {
            onMessage(body.message || curlecUserMessage({ reason: "payment_pending_gateway" }).message);
            resolve("pending");
            return;
          }
          onMessage(body?.message || curlecUserMessage().message);
          resolve("failed");
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          onMessage(msg ?? "Payment received but confirmation is still pending. Check My Orders shortly.");
          resolve("pending");
        }
      },
      modal: {
        ondismiss: () => resolve("cancelled"),
      },
    });
    rzp.on("payment.failed", (response: unknown) => {
      const err = (response as {
        error?: { description?: string; reason?: string; code?: string };
      })?.error;
      const mapped = curlecUserMessage(err);
      onMessage(mapped.message);
      resolve(mapped.kind === "pending" ? "pending" : "failed");
    });
    rzp.open();
  });
}

