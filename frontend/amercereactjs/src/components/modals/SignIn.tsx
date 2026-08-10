import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { Modal, ModalHeader, ModalBody } from "@/components/Modal";
import PhoneLoginForm, { type OtpAuthResult } from "@/components/auth/PhoneLoginForm";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { activeModal, closeModal } = useModalStore();
  const isOpen =
    activeModal === "signIn"
    || activeModal === "phoneOTP"
    || activeModal === "register"
    || activeModal === "forgotPassword";

  const finishLogin = async (result: OtpAuthResult) => {
    login(result.token, result.user);
    try {
      const { afterLoginCartSync } = await import("@/utils/cartSync");
      await afterLoginCartSync();
    } catch {
      /* ignore */
    }
    closeModal();
    // Stay on intended page; name/email/address are collected at checkout (Amazon/Flipkart style)
    const dest = useModalStore.getState().consumeAuthRedirect("/account-page");
    navigate(dest, { replace: true });
  };

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="420px">
      <ModalHeader
        title="Login"
        onClose={closeModal}
        icon={icon}
      />
      <ModalBody>
        <PhoneLoginForm onSuccess={finishLogin} idPrefix="signin-otp" variant="modal" />
      </ModalBody>
    </Modal>
  );
}
