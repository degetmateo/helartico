import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  inputStyle?: React.CSSProperties;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder = "Contraseña",
  value,
  onChange,
  style,
  inputStyle,
  className,
  disabled,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div style={{ position: "relative", width: "100%", ...style }} className={className}>
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        style={{
          width: "100%",
          padding: "10px 42px 10px 12px",
          borderRadius: 8,
          border: "1px solid var(--color-border)",
          fontSize: "0.9rem",
          background: "#fff",
          outline: "none",
          ...inputStyle,
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        tabIndex={-1}
        title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
        aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          color: "var(--color-text-muted)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
          borderRadius: 6,
        }}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};
