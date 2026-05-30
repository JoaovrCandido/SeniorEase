// src/presentation/components/ui/Button.tsx
import React, { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className,
  ...props
}) => {
  // Combina a classe base com a variante escolhida
  const buttonClass =
    `${styles.button} ${styles[variant]} ${className || ""}`.trim();

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
