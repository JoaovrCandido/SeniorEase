// src/presentation/components/ui/DictationButton.tsx
import React from 'react';
import { useDictation } from '../../hooks/useDictation';

interface Props {
  onDictate: (text: string) => void;
  title?: string;
}

export const DictationButton: React.FC<Props> = ({ onDictate, title = "Ditar texto com a voz" }) => {
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
      style={{
        background: isListening ? '#FEE2E2' : 'transparent',
        border: isListening ? '2px solid var(--danger-main)' : '2px solid transparent',
        color: isListening ? 'var(--danger-main)' : 'var(--text-body)',
        cursor: 'pointer',
        minWidth: '48px',
        minHeight: '48px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        flexShrink: 0
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '24px' }}>{isListening ? '🔴' : '🎤'}</span>
    </button>
  );
};