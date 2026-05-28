import React, { useState, useEffect } from 'react';
import { MeetingBlock } from '../../../domain/entities/Block';
import { Button } from '../ui/Button';

interface Props {
  block: MeetingBlock;
  onChangeContent: (id: string, title: string, url: string) => void;
  onDelete: (id: string) => void;
}

export const MeetingBlockUI: React.FC<Props> = ({ block, onChangeContent, onDelete }) => {
  const [url, setUrl] = useState(block.meetingUrl);
  useEffect(() => setUrl(block.meetingUrl), [block.meetingUrl]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', padding: '16px', backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', border: '2px solid #BFDBFE' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '24px' }}>🎥</span>
        <input 
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => url !== block.meetingUrl && onChangeContent(block.id, block.title, url)}
          placeholder="Cole o link da reunião aqui..."
          style={{ flexGrow: 1, height: '48px', border: 'none', background: 'transparent', fontSize: 'var(--text-base)' }}
        />
        <button onClick={() => onDelete(block.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-main)', cursor: 'pointer', height: '48px', width: '48px' }}>🗑️</button>
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ width: '100%', marginTop: '8px' }}>Entrar na Reunião Agora</Button>
        </a>
      )}
    </div>
  );
};