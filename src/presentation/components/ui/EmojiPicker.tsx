// src/presentation/components/ui/EmojiPicker.tsx
import React, { useState } from 'react';
import { SmileIcon } from './Icons';
import styles from './EmojiPicker.module.css';

interface Props {
  onSelect: (emoji: string) => void;
  title?: string;
}

export const EmojiPicker: React.FC<Props> = ({ onSelect, title = "Adicionar Emoji" }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lista selecionada a pensar nas necessidades de anotações práticas
  const EMOJIS = [
    "😀", "😃", "😊", "🥰", "😎", "🤔", "😅", "😂",
    "👍", "👏", "🙏", "🤝", "✌️", "💪", "❤️", "💖",
    "✅", "❌", "⚠️", "📌", "📍", "🔔", "📅", "⏰",
    "📝", "🛒", "💊", "📞", "🏠", "🚌", "🎉", "🌟"
  ];

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => setIsOpen(true)}
        aria-label={title}
        title={title}
      >
        <SmileIcon />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.header}>
              <h3 className={styles.title}>Escolher Emoji</h3>
              <button 
                className={styles.closeButton} 
                onClick={() => setIsOpen(false)} 
                aria-label="Fechar"
                title="Fechar"
              >
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.grid}>
              {EMOJIS.map(emoji => (
                <button 
                  key={emoji} 
                  className={styles.emojiButton} 
                  onClick={() => handleSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};