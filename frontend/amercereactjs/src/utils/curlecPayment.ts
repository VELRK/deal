/** User-facing copy for Curlec / Razorpay checkout outcomes. */
export function curlecUserMessage(err?: {
  reason?: string;
  description?: string;
  code?: string;
} | null): { kind: "pending" | "failed"; message: string; retry: boolean } {
  const reason = (err?.reason || "").toLowerCase().trim();
  const desc = (err?.description || "").trim();
  const code = (err?.code || "").toUpperCase();

  if (
    reason === "payment_pending_gateway" ||
    /taking more time than usual|being processed|notified shortly/i.test(desc)
  ) {
    return {
      kind: "pending",
      retry: false,
      message:
        "Your Touch ’n Go / online payment is still processing. Do not pay again — we will confirm the order automatically. Check My Orders in a few minutes.",
    };
  }

  const byReason: Record<string, string> = {
    card_declined:
      "Card was declined by the bank. Try another card, or pay with FPX / Touch ’n Go. Your order is saved under My Orders.",
    payment_session_expired:
      "The bank payment session expired. Open My Orders and tap Complete payment to try FPX again.",
    payment_timed_out:
      "The bank took too long to respond. Please try again from My Orders.",
    authentication_failed:
      "Card / bank authentication failed. Try again or use another payment method.",
    insufficient_funds:
      "Insufficient funds. Use another card, FPX, or Touch ’n Go.",
  };

  if (byReason[reason]) {
    return { kind: "failed", retry: true, message: byReason[reason] };
  }
  if (code === "GATEWAY_ERROR") {
    return {
      kind: "failed",
      retry: true,
      message:
        "The payment gateway had a technical error. Please try again in a few minutes from My Orders.",
    };
  }
  if (desc) {
    return {
      kind: "failed",
      retry: true,
      message: `${desc} Your order is saved under My Orders.`,
    };
  }
  return {
    kind: "failed",
    retry: true,
    message:
      "Payment was not completed. Try another method from My Orders. If money was deducted, it is usually returned in 5–7 working days.",
  };
}
