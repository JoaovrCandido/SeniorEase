// src/presentation/components/ui/DictationButton.tsx
import React from "react";
import { useDictation } from "../../hooks/useDictation";
import { MicIcon, StopIcon } from "./Icons";
import styles from "./DictationButton.module.css"; // <-- Importado

interface Props {
  onDictate: (text: string) => void;
  title?: string;
}

export const DictationButton: React.FC<Props> = ({
  onDictate,
  title = "Ditar texto com a voz",
}) => {
  const { isListening, startListening, stopListening } = useDictation();

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onDictate);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isListening ? "A gravar... Clique para parar" : title}
      aria-label={isListening ? "Parar gravação" : title}
      className={`${styles.button} ${isListening ? styles.listening : ""}`}
    >
      {isListening ? <StopIcon /> : <MicIcon />}
    </button>
  );
};
