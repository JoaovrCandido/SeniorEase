// src/presentation/store/ToastContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAccessibility } from "./AccessibilityContext";
import { useUserProfile } from "./UserProfileContext";
import styles from "../components/ui/Toast.module.css";
import { CheckIcon, InfoIcon } from "../components/ui/Icons";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Ligamos o sistema de Toasts às configurações do utilizador!
  const { personalizedMessages } = useAccessibility();
  const { name } = useUserProfile();

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      let finalMessage = message;

      // Magia: Verifica se a personalização está ligada e se temos o nome
      if (personalizedMessages === "on" && name && name.trim() !== "") {
        const firstName = name.trim().split(" ")[0]; // Pega apenas o primeiro nome

        if (type === "success") {
          // Elogios vibrantes para conquistas
          const successGreetings = [
            "Muito bem",
            "Excelente",
            "Fantástico",
            "Isso aí",
            "Parabéns",
          ];
          const randomGreeting =
            successGreetings[
              Math.floor(Math.random() * successGreetings.length)
            ];
          finalMessage = `${randomGreeting}, ${firstName}! ${message}`;
        } else if (type === "info") {
          // Elogios neutros/tranquilos para ações do dia a dia (como apagar ou mover)
          const infoGreetings = ["Feito", "Tudo certo", "Anotado", "Pronto"];
          const randomGreeting =
            infoGreetings[Math.floor(Math.random() * infoGreetings.length)];
          finalMessage = `${randomGreeting}, ${firstName}. ${message}`;
        }
      }

      const id = crypto.randomUUID();

      setToasts((prev) => [...prev, { id, message: finalMessage, type }]);

      // Remove automaticamente após 5 segundos
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [personalizedMessages, name],
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Container que renderiza os Toasts no ecrã - aria-live avisa o leitor de tela imediatamente */}
      <div className={styles.toastContainer} aria-live="assertive">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
            role="alert"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {toast.type === "success" && <CheckIcon />}
              {toast.type === "info" && <InfoIcon />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={styles.closeBtn}
              aria-label="Fechar aviso"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};
