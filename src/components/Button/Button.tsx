import type { ReactNode } from "react";

import "./Button.css";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function Button({
  children,
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button type={type} disabled={disabled} className="button">
      {children}
    </button>
  );
}