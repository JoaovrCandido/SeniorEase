// src/presentation/components/blocks/HeadingBlockUI.tsx
import React, { useState, useEffect } from 'react';
import { HeadingBlock } from '../../../domain/entities/Block';
import { DictationButton } from '../ui/DictationButton';
import styles from './HeadingBlockUI.module.css';

interface HeadingBlockUIProps {
  block: HeadingBlock;
  onDelete: (id: string) => void;
  onChangeContent: (id: string, newContent: string) => void;
}

export const HeadingBlockUI: React.FC<HeadingBlockUIProps> = ({ block, onDelete, onChangeContent }) => {
  const [localContent, setLocalContent] = useState(block.content);
  useEffect(() => { setLocalContent(block.content); }, [block.content]);

  const handleBlur = () => { if (localContent !== block.content) onChangeContent(block.id, localContent); };

  const handleDictate = (text: string) => {
    const newContent = localContent ? `${localContent} ${text}` : text;
    setLocalContent(newContent);
    onChangeContent(block.id, newContent);
  };

  return (
    <div className={styles.container}>
      <input type="text" className={styles.input} value={localContent} onChange={(e) => setLocalContent(e.target.value)} onBlur={handleBlur} placeholder="Escreva um Título Principal..." />
      <DictationButton onDictate={handleDictate} />
      <button type="button" className={styles.deleteButton} onClick={() => onDelete(block.id)} title="Apagar">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
};