import ResetPasswordFlow from "@/components/auth/ResetPasswordFlow";
import { Modal, ModalHeader, ModalBody } from "@/components/Modal";
import { useModalStore } from "@/store/modalStore";

export default function ForgotPass() {
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "forgotPassword";

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="450px">
      <ModalHeader
        title="Forgot Password"
        subtitle="Verify your email, then set a new password."
        onClose={closeModal}
        icon={icon}
      />
      <ModalBody>
        <ResetPasswordFlow variant="modal" />
      </ModalBody>
    </Modal>
  );
}
