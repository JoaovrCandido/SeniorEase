// src/presentation/components/blocks/ReminderBlockUI.tsx
import React, { useState, useEffect } from 'react';
import { ReminderBlock } from '../../../domain/entities/Block';
import { DictationButton } from '../ui/DictationButton';

interface Props {
  block: ReminderBlock;
  onChangeContent: (id: string, content: string, date: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderBlockUI: React.FC<Props> = ({ block, onChangeContent, onDelete }) => {
  const [content, setContent] = useState(block.content || '');
  const [date, setDate] = useState(block.date);

  useEffect(() => { setContent(block.content || ''); setDate(block.date); }, [block.content, block.date]);

  const handleBlur = () => { if (content !== block.content || date !== block.date) onChangeContent(block.id, content, date); };

  const handleDictate = (text: string) => {
    const newContent = content ? `${content} ${text}` : text;
    setContent(newContent);
    onChangeContent(block.id, newContent, date);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', padding: '16px', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-md)', border: '2px solid #FDE68A' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '24px', marginTop: '8px' }}>⏰</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <input type="text" value={content} onChange={(e) => setContent(e.target.value)} onBlur={handleBlur} placeholder="Do que você precisa se lembrar?" style={{ flexGrow: 1, height: '48px', border: 'none', background: 'transparent', fontSize: 'var(--text-base)', color: 'var(--text-heading)', fontWeight: 'bold' }} />
            <DictationButton onDictate={handleDictate} />
          </div>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} onBlur={handleBlur} style={{ height: '48px', border: 'none', background: 'transparent', fontSize: 'var(--text-base)', color: 'var(--text-heading)' }} />
        </div>
        <button onClick={() => onDelete(block.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-main)', cursor: 'pointer', height: '48px', width: '48px', flexShrink: 0 }}>🗑️</button>
      </div>
    </div>
  );
};