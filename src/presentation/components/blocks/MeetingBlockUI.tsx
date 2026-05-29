// src/presentation/components/blocks/MeetingBlockUI.tsx
import React, { useState, useEffect } from 'react';
import { MeetingBlock } from '../../../domain/entities/Block';
import { Button } from '../ui/Button';
import { DictationButton } from '../ui/DictationButton';

interface Props {
  block: MeetingBlock;
  onChangeContent: (id: string, title: string, url: string, date: string) => void;
  onDelete: (id: string) => void;
}

export const MeetingBlockUI: React.FC<Props> = ({ block, onChangeContent, onDelete }) => {
  const [title, setTitle] = useState(block.title);
  const [url, setUrl] = useState(block.meetingUrl);
  const [date, setDate] = useState(block.date || '');

  useEffect(() => { setTitle(block.title); setUrl(block.meetingUrl); setDate(block.date || ''); }, [block.title, block.meetingUrl, block.date]);

  const handleBlur = () => { if (title !== block.title || url !== block.meetingUrl || date !== block.date) onChangeContent(block.id, title, url, date); };

  const handleDictate = (text: string) => {
    const newTitle = title ? `${title} ${text}` : text;
    setTitle(newTitle);
    onChangeContent(block.id, newTitle, url, date);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', padding: '16px', backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', border: '2px solid #BFDBFE' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '24px', marginTop: '8px' }}>🎥</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleBlur} placeholder="Assunto da reunião" style={{ flexGrow: 1, height: '48px', border: 'none', background: 'transparent', fontSize: 'var(--text-base)', color: 'var(--text-heading)', fontWeight: 'bold' }} />
            <DictationButton onDictate={handleDictate} />
          </div>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} onBlur={handleBlur} style={{ height: '48px', border: 'none', background: 'transparent', fontSize: 'var(--text-base)', color: 'var(--text-heading)' }} />
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={handleBlur} placeholder="Cole o link (Zoom, Meet, Teams...)" style={{ height: '48px', border: 'none', background: 'transparent', fontSize: 'var(--text-base)', color: 'var(--text-body)' }} />
        </div>

        <button onClick={() => onDelete(block.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-main)', cursor: 'pointer', height: '48px', width: '48px', flexShrink: 0 }}>🗑️</button>
      </div>
      {url && <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}><Button variant="primary" style={{ width: '100%', marginTop: '8px' }}>Entrar na Reunião</Button></a>}
    </div>
  );
};