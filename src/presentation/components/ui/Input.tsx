// src/presentation/components/ui/Input.tsx
import React, { InputHTMLAttributes, useId } from "react";
import { DictationButton } from "./DictationButton";
import { EmojiPicker } from "./EmojiPicker"; // <-- Importação do Emoji
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onDictate?: (text: string) => void;
  onEmoji?: (emoji: string) => void; // <-- Nova propriedade
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className,
  onDictate,
  onEmoji,
  ...props
}) => {
  const defaultId = useId();
  const inputId = id || defaultId;

  return (
    <div className={`${styles.container} ${className || ""}`.trim()}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          className={`${styles.input} ${styles.inputFlex}`}
          {...props}
        />
        {/* Renderiza o Emoji se a propriedade for passada */}
        {onEmoji && (
          <EmojiPicker
            onSelect={onEmoji}
            title={`Emoji para ${label.toLowerCase()}`}
          />
        )}
        {onDictate && (
          <DictationButton
            onDictate={onDictate}
            title={`Ditar ${label.toLowerCase()}`}
          />
        )}
      </div>
    </div>
  );
};
