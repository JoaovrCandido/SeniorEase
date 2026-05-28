// src/presentation/components/blocks/TaskBlockUI.tsx
import React, { useState, useEffect } from 'react';
import { TaskBlock } from '../../../domain/entities/Block';
import styles from './TaskBlockUI.module.css';

interface TaskBlockUIProps {
  block: TaskBlock;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeContent: (id: string, newContent: string) => void;
}

export const TaskBlockUI: React.FC<TaskBlockUIProps> = ({
  block,
  onToggle,
  onDelete,
  onChangeContent,
}) => {
  // Estado local para permitir que o utilizador escreva fluidamente
  // Só enviamos para a base de dados (onChangeContent) quando ele sai do campo (onBlur)
  const [localContent, setLocalContent] = useState(block.content);

  // Sincroniza caso o conteúdo mude por outra via (ex: Undo/Desfazer)
  useEffect(() => {
    setLocalContent(block.content);
  }, [block.content]);

  const handleBlur = () => {
    if (localContent !== block.content) {
      onChangeContent(block.id, localContent);
    }
  };

  return (
    <div className={`${styles.container} ${block.isCompleted ? styles.completed : ''}`}>
      
      {/* Botão de Checkbox Acessível */}
      <button
        type="button"
        className={styles.checkboxButton}
        onClick={() => onToggle(block.id)}
        aria-label={block.isCompleted ? "Marcar tarefa como não concluída" : "Concluir tarefa"}
      >
        <div className={styles.checkboxBox} aria-hidden="true">
          <svg className={styles.checkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </button>

      {/* Campo de Texto (O corpo do Bloco) */}
      <input
        type="text"
        className={styles.input}
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={handleBlur}
        placeholder="Escreva a sua tarefa aqui..."
        aria-label="Conteúdo da tarefa"
      />

      {/* Botão de Apagar */}
      <button
        type="button"
        className={styles.deleteButton}
        onClick={() => onDelete(block.id)}
        aria-label="Apagar tarefa"
        title="Apagar tarefa"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

    </div>
  );
};