import { useId } from "react";

import "./Input.css";

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  const inputId = useId();

  return (
    <div className="input-group">
      <label htmlFor={inputId}>{label}</label>

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
