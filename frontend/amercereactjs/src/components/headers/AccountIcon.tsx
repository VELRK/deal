import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";

interface AccountIconProps {
  hasText?: boolean;
}

export default function AccountIcon({ hasText = false }: AccountIconProps) {
  const { isLoggedIn, token, user, hydrated } = useAuthStore();
  const { openModal } = useModalStore();

  if (!hydrated) return null;

  if (isLoggedIn && token) {
    return (
      <Link to="/account-page" className={`nav-icon-item link ${hasText ? "has-text" : ""}`}>
        <i className="icon icon-User" />
        {hasText && <span className="d-none d-xl-block"> {user?.name?.split(" ")[0] ?? "Account"} </span>}
      </Link>
    );
  }

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        openModal("signIn");
      }}
      className={`nav-icon-item link ${hasText ? "has-text" : ""}`}
    >
      <i className="icon icon-User" />
      {hasText && <span className="d-none d-xl-block"> Account </span>}
    </a>
  );
}
