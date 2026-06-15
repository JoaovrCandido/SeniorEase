// src/presentation/components/ui/Modal.tsx
import React, { useEffect } from "react";
import styles from "./Modal.module.css";
import { HelpIcon } from "./Icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  position?: "center" | "left" | "right";
  onHelp?: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  position = "center",
  onHelp,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayClass = `${styles.overlay} ${styles[`overlay${position.charAt(0).toUpperCase() + position.slice(1)}`]}`;
  const modalClass = `${styles.modal} ${styles[`modal${position.charAt(0).toUpperCase() + position.slice(1)}`]}`;

  return (
    <div
      className={overlayClass}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <div className={styles.headerActions}>
            {onHelp && (
              <button
                id="tour-modal-help-btn"
                className={styles.helpButton} // <-- Classe exclusiva de Ajuda
                onClick={onHelp}
                aria-label="Ajuda sobre esta tela"
              >
                <HelpIcon /> Ajuda
              </button>
            )}
            <button
              className={styles.closeButton} // <-- Classe padrão e limpa
              onClick={onClose}
              aria-label="Fechar janela"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};