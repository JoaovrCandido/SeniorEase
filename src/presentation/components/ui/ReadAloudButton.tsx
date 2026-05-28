// src/presentation/components/ui/ReadAloudButton.tsx
import React from 'react';
import { useSpeech } from '../../hooks/useSpeech';

interface ReadAloudButtonProps {
  textToRead: string;
  className?: string;
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({ textToRead, className }) => {
  const { isSpeaking, readText } = useSpeech();

  return (
    <button
      onClick={() => readText(textToRead)}
      className={className}
      aria-label={isSpeaking ? "Parar leitura em voz alta" : "Ouvir conteúdo em voz alta"}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: isSpeaking ? '#FEE2E2' : 'var(--primary-surface)',
        color: isSpeaking ? 'var(--danger-main)' : 'var(--primary-main)',
        border: 'none',
        padding: '12px 24px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 'var(--text-base)',
        minHeight: 'var(--touch-target-min)',
        transition: 'all 0.2s ease'
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '24px' }}>
        {isSpeaking ? '⏹️' : '🔊'}
      </span>
      {isSpeaking ? 'Parar Leitura' : 'Ouvir Caderno'}
    </button>
  );
};