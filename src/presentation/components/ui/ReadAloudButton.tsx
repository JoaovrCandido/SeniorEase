// src/presentation/components/ui/ReadAloudButton.tsx
import React from "react";
import { useSpeech } from "../../hooks/useSpeech";
import { SoundIcon, StopIcon } from "./Icons";
import styles from "./ReadAloudButton.module.css";

interface ReadAloudButtonProps {
  textToRead: string;
  className?: string;
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({
  textToRead,
  className,
}) => {
  const { isSpeaking, readText } = useSpeech();

  return (
    <button
      onClick={() => readText(textToRead)}
      className={`${styles.button} ${isSpeaking ? styles.speaking : ""} ${className || ""}`}
      aria-label={
        isSpeaking ? "Parar leitura em voz alta" : "Ouvir conteúdo em voz alta"
      }
    >
      <span className={styles.iconWrapper} aria-hidden="true">
        {isSpeaking ? <StopIcon /> : <SoundIcon />}
      </span>
      {isSpeaking ? "Parar Leitura" : "Ouvir Caderno"}
    </button>
  );
};
