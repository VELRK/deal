import { useState } from "react";
import type { RefObject } from "react";

type PasswordFieldProps = {
  id: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export function PasswordField({
  id,
  className = "password-field",
  placeholder = "Password",
  required = false,
  inputRef,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-wrapper w-100">
      <button
        type="button"
        className="toggle-pass border-0 bg-transparent p-0"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((prev) => !prev)}
      >
        <span className={`${visible ? "icon-Eye" : "icon-EyeSlash"} fs-20 cl-text-3`} />
      </button>
      <input
        ref={inputRef}
        className={className}
        type={visible ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
