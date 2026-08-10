import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { Modal, ModalHeader, ModalBody } from "@/components/Modal";
import PhoneLoginForm, { type OtpAuthResult } from "@/components/auth/PhoneLoginForm";

/**
 * Flipkart-style auth box: phone + Request OTP only.
 * No "Login" title — same flow for new and existing customers.
 */
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
    const dest = useModalStore.getState().consumeAuthRedirect("/");
    navigate(dest, { replace: true });
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="380px">
      <ModalHeader onClose={closeModal} />
      <ModalBody>
        <PhoneLoginForm onSuccess={finishLogin} idPrefix="signin-otp" variant="modal" />
      </ModalBody>
    </Modal>
  );
}
