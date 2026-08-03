import { create } from "zustand";
import { rememberAuthReturn, resolveAuthRedirect, clearAuthReturn } from "@/utils/authRedirect";

type ModalType =
  | "signIn"
  | "register"
  | "forgotPassword"
  | "cart"
  | "phoneOTP"
  | "quickAdd"
  | "quickView"
  | "affiliateEnquiry"
  | "none";

const AUTH_MODALS: ModalType[] = ["signIn", "register", "phoneOTP"];

interface ModalState {
  activeModal: ModalType;
  /** Where to go after successful sign-in / register / OTP */
  redirectAfterAuth: string | null;
  openModal: (modal: ModalType, opts?: { redirect?: string }) => void;
  closeModal: () => void;
  clearAuthRedirect: () => void;
  /** Close modal and return the resolved post-auth path */
  consumeAuthRedirect: (fallback?: string) => string;
}

export const useModalStore = create<ModalState>((set, get) => ({
  activeModal: "none",
  redirectAfterAuth: null,

  openModal: (modal, opts) => {
    if (AUTH_MODALS.includes(modal)) {
      const redirect = opts?.redirect?.trim() || null;
      if (redirect) {
        rememberAuthReturn(redirect);
        set({ activeModal: modal, redirectAfterAuth: redirect });
        return;
      }
      // Keep existing redirect if switching between signIn ↔ register
      const existing = get().redirectAfterAuth;
      set({ activeModal: modal, redirectAfterAuth: existing });
      return;
    }
    set({ activeModal: modal });
  },

  closeModal: () => set({ activeModal: "none" }),

  clearAuthRedirect: () => {
    clearAuthReturn();
    set({ redirectAfterAuth: null });
  },

  consumeAuthRedirect: (fallback = "/account-page") => {
    const explicit = get().redirectAfterAuth;
    const dest = resolveAuthRedirect(explicit, fallback);
    clearAuthReturn();
    set({ activeModal: "none", redirectAfterAuth: null });
    return dest;
  },
}));
