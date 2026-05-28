import React, { useState, useEffect } from 'react';
import { ReminderBlock } from '../../../domain/entities/Block';

interface Props {
  block: ReminderBlock;
  onChangeContent: (id: string, date: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderBlockUI: React.FC<Props> = ({ block, onChangeContent, onDelete }) => {
  const [date, setDate] = useState(block.date);
  useEffect(() => setDate(block.date), [block.date]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', padding: '16px', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-md)', border: '2px solid #FDE68A' }}>
      <span style={{ fontSize: '24px' }}>⏰</span>
      <input 
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        onBlur={() => date !== block.date && onChangeContent(block.id, date)}
        style={{ flexGrow: 1, height: '48px', border: 'none', background: 'transparent', fontSize: 'var(--text-base)', color: 'var(--text-heading)' }}
      />
      <button onClick={() => onDelete(block.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-main)', cursor: 'pointer', height: '48px', width: '48px' }}>🗑️</button>
    </div>
  );
};