// src/presentation/components/blocks/TaskBlockUI.tsx
import React, { useState, useEffect } from "react";
import { TaskBlock } from "../../../domain/entities/Block";
import { DictationButton } from "../ui/DictationButton";
import { TrashIcon, UpArrowIcon, DownArrowIcon } from "../ui/Icons";
import { EmojiPicker } from "../ui/EmojiPicker";
import { useToast } from "../../store/ToastContext"; // <-- NOVO IMPORT
import styles from "./TaskBlockUI.module.css";

interface TaskBlockUIProps {
  block: TaskBlock;
  isFirst?: boolean;
  disableUp?: boolean;
  disableDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeContent: (id: string, newContent: string) => void;
}

export const TaskBlockUI: React.FC<TaskBlockUIProps> = ({
  block,
  isFirst,
  disableUp,
  disableDown,
  onMoveUp,
  onMoveDown,
  onToggle,
  onDelete,
  onChangeContent,
}) => {
  const [localContent, setLocalContent] = useState(block.content);
  const { showToast } = useToast(); // <-- Usando o Toast para os avisos

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

  const handleEmoji = (emoji: string) => {
    const newContent = localContent ? `${localContent} ${emoji}` : emoji;
    setLocalContent(newContent);
    onChangeContent(block.id, newContent);
  };

  // <-- NOVA FUNÇÃO DE VALIDAÇÃO -->
  const handleToggle = () => {
    if (!localContent || localContent.trim() === "") {
      showToast(
        "Escreva qual é a tarefa antes de marcá-la como concluída.",
        "error",
      );
      return;
    }
    onToggle(block.id);
  };

  return (
    <div
      className={`${styles.container} ${block.isCompleted ? styles.completed : ""}`}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginRight: "8px",
        }}
      >
        <button
          type="button"
          onClick={onMoveUp}
          disabled={disableUp}
          style={{
            background: "transparent",
            border: "none",
            cursor: disableUp ? "not-allowed" : "pointer",
            opacity: disableUp ? 0.3 : 1,
            color: "var(--primary-main)",
          }}
          aria-label="Mover para cima"
        >
          <UpArrowIcon />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={disableDown}
          style={{
            background: "transparent",
            border: "none",
            cursor: disableDown ? "not-allowed" : "pointer",
            opacity: disableDown ? 0.3 : 1,
            color: "var(--primary-main)",
          }}
          aria-label="Mover para baixo"
        >
          <DownArrowIcon />
        </button>
      </div>

      <button
        type="button"
        className={styles.checkboxButton}
        onClick={handleToggle} // <-- Usando a função com validação
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

      <div
        id={isFirst ? "tour-first-block-actions" : undefined}
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
      >
        <EmojiPicker onSelect={handleEmoji} />
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
