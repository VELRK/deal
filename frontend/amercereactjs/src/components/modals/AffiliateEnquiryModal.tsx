import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import { useModalStore } from "@/store/modalStore";
import { contactAPI } from "@/services/api";
import { generatePromoCode } from "@/utils/generatePromoCode";
import {
  MY_COUNTRY_CODE,
  MY_PHONE_ERROR,
  formatMalaysiaDisplay,
  isValidMalaysiaMobile,
  toMalaysiaE164,
} from "@/utils/malaysiaPhone";

export default function AffiliateEnquiryModal() {
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "affiliateEnquiry";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [suggestedPromo, setSuggestedPromo] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (name.trim() && phone.trim()) {
      setSuggestedPromo(generatePromoCode(name, toMalaysiaE164(phone)));
    } else {
      setSuggestedPromo("");
    }
  }, [isOpen, name, phone]);

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setDetails("");
    setSuggestedPromo("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullPhone = toMalaysiaE164(phone);
    if (!isValidMalaysiaMobile(phone)) {
      setError(MY_PHONE_ERROR);
      setLoading(false);
      return;
    }
    const promoPreview = generatePromoCode(name, fullPhone);
    const message = [
      "Affiliate programme enquiry",
      "",
      `Phone: ${fullPhone}`,
      `Suggested promo code: ${promoPreview}`,
      "",
      "Details:",
      details.trim(),
    ].join("\n");

    try {
      const res = await contactAPI.send({ name: name.trim(), email: email.trim(), message });
      if (res.data?.success) {
        setSuccess(true);
        resetForm();
        setTimeout(() => {
          setSuccess(false);
          closeModal();
        }, 3000);
      } else {
        setError(res.data?.message || "Could not submit enquiry. Please try again.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Could not submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="500px">
      <ModalHeader
        title="Affiliate Enquiry"
        subtitle="Join our affiliate program and earn commission on every sale."
        onClose={closeModal}
        icon={icon}
      />
      <ModalBody>
        {success ? (
          <div className="text-center py-4">
            <div style={{ color: "#10B981", marginBottom: "15px" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h5 className="fw-medium mb-2">Enquiry Sent!</h5>
            <p className="text-muted" style={{ fontSize: "14px" }}>
              Thank you for your interest. Our team will contact you with your affiliate promo code after approval.
            </p>
          </div>
        ) : (
          <form id="affiliate-enquiry-form" onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger py-2 mb-3" style={{ fontSize: "13px" }}>
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }} htmlFor="ae-name">
                Full Name <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <input
                id="ae-name"
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "12px", border: "1px solid var(--modal-border)", borderRadius: "8px", outline: "none" }}
              />
            </div>

            <div className="mb-3">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }} htmlFor="ae-phone">
                Phone Number <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <div className="d-flex align-items-stretch" style={{ border: "1px solid var(--modal-border)", borderRadius: "8px", overflow: "hidden" }}>
                <span
                  className="px-3 fw-medium d-flex align-items-center"
                  style={{ backgroundColor: "#F8FAFC", borderRight: "1px solid var(--modal-border)" }}
                >
                  🇲🇾 +{MY_COUNTRY_CODE}
                </span>
                <input
                  id="ae-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="12-345 6789"
                  required
                  value={formatMalaysiaDisplay(phone)}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  style={{ width: "100%", padding: "12px", border: "none", outline: "none" }}
                />
              </div>
            </div>

            {suggestedPromo && (
              <div className="mb-3 p-2 rounded" style={{ background: "#f0fdfa", border: "1px solid #99f6e4", fontSize: "13px" }}>
                <span className="text-muted">Your promo code will be like: </span>
                <strong style={{ letterSpacing: "1px" }}>{suggestedPromo}</strong>
                <div className="text-muted mt-1" style={{ fontSize: "12px" }}>
                  First 4 letters of name (padded with 0) + last 4 phone digits
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }} htmlFor="ae-email">
                Email Address <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <input
                id="ae-email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "12px", border: "1px solid var(--modal-border)", borderRadius: "8px", outline: "none" }}
              />
            </div>

            <div className="mb-3">
              <label className="fw-medium mb-1 d-block" style={{ fontSize: "14px" }} htmlFor="ae-details">
                Details <span style={{ color: "var(--modal-danger)" }}>*</span>
              </label>
              <textarea
                id="ae-details"
                placeholder="Tell us about yourself and how you plan to promote our products..."
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{ width: "100%", padding: "12px", border: "1px solid var(--modal-border)", borderRadius: "8px", outline: "none", resize: "none" }}
              />
            </div>
          </form>
        )}
      </ModalBody>
      {!success && (
        <ModalFooter
          primaryAction={{
            label: loading ? "Submitting..." : "Submit Enquiry",
            onClick: () => {
              const form = document.getElementById("affiliate-enquiry-form") as HTMLFormElement;
              if (form) form.requestSubmit();
            },
            loading: loading,
            variant: "gold"
          }}
          secondaryAction={{
            label: "Cancel",
            onClick: closeModal
          }}
        />
      )}
    </Modal>
  );
}
