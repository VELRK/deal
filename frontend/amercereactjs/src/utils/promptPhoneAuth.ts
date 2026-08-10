import { useModalStore } from "@/store/modalStore";

/** Open the minimal phone-OTP box (used when buying / checkout before login). */
export function promptPhoneAuth(redirect?: string) {
  useModalStore.getState().openModal("signIn", redirect ? { redirect } : undefined);
}
