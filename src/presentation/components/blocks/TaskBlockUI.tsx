// src/presentation/components/blocks/TaskBlockUI.tsx
import React, { useState, useEffect } from "react";
import { TaskBlock } from "../../../domain/entities/Block";
import { DictationButton } from "../ui/DictationButton";
import { TrashIcon } from "../ui/Icons";
import styles from "./TaskBlockUI.module.css";

interface TaskBlockUIProps {
  block: TaskBlock;
  isFirst?: boolean; // Propriedade nova para o Tour de Ajuda
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeContent: (id: string, newContent: string) => void;
}

export const TaskBlockUI: React.FC<TaskBlockUIProps> = ({
  block,
  isFirst,
  onToggle,
  onDelete,
  onChangeContent,
}) => {
  const [localContent, setLocalContent] = useState(block.content);

  useEffect(() => {
    setLocalContent(block.content);
  }, [block.content]);

  const handleBlur = () => {
    if (localContent !== block.content) onChangeContent(block.id, localContent);
  };

  const handleDictate = (text: string) => {
    const newContent = localContent ? `${localContent} ${text}` : text;
    setLocalContent(newContent);
    onChangeContent(block.id, newContent);
  };

  return (
    <div
      className={`${styles.container} ${block.isCompleted ? styles.completed : ""}`}
    >
      <button
        type="button"
        className={styles.checkboxButton}
        onClick={() => onToggle(block.id)}
        aria-label="Concluir tarefa"
      >
        <div className={styles.checkboxBox} aria-hidden="true">
          <svg
            className={styles.checkIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </button>

      <input
        type="text"
        className={styles.input}
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={handleBlur}
        placeholder="Escreva a sua tarefa aqui..."
      />

      {/* NOVO: Div isolando as ações para o foco da ajuda */}
      <div
        id={isFirst ? "tour-first-block-actions" : undefined}
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
      >
        <DictationButton onDictate={handleDictate} />
        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDelete(block.id)}
          aria-label="Apagar Tarefa"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};
