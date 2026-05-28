import React, { useState, useEffect } from 'react';
import { ParagraphBlock } from '../../../domain/entities/Block';

interface Props {
  block: ParagraphBlock;
  onChangeContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const ParagraphBlockUI: React.FC<Props> = ({ block, onChangeContent, onDelete }) => {
  const [localContent, setLocalContent] = useState(block.content);
  useEffect(() => setLocalContent(block.content), [block.content]);

  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', padding: '16px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)' }}>
      <textarea
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={() => localContent !== block.content && onChangeContent(block.id, localContent)}
        placeholder="Digite sua anotação aqui..."
        style={{ flexGrow: 1, minHeight: '80px', border: 'none', background: 'transparent', fontSize: 'var(--text-base)', color: 'var(--text-body)', fontFamily: 'var(--font-sans)', resize: 'vertical' }}
      />
      <button onClick={() => onDelete(block.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-main)', cursor: 'pointer', height: '48px', width: '48px' }}>🗑️</button>
    </div>
  );
};