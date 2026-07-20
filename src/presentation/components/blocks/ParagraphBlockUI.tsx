// src/presentation/components/blocks/ParagraphBlockUI.tsx
import React, { useState, useEffect } from "react";
import { ParagraphBlock } from "../../../domain/entities/Block";
import { DictationButton } from "../ui/DictationButton";
import { EmojiPicker } from "../ui/EmojiPicker";
import { TrashIcon, UpArrowIcon, DownArrowIcon } from "../ui/Icons";
import styles from "./ParagraphBlockUI.module.css";

interface Props {
  block: ParagraphBlock;
  isFirst?: boolean;
  disableUp?: boolean;
  disableDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onChangeContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const ParagraphBlockUI: React.FC<Props> = ({
  block,
  isFirst,
  disableUp,
  disableDown,
  onMoveUp,
  onMoveDown,
  onChangeContent,
  onDelete,
}) => {
  const [localContent, setLocalContent] = useState(block.content);
  useEffect(() => setLocalContent(block.content), [block.content]);

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

  return (
    <div className={styles.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginRight: "8px",
          paddingTop: "8px",
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

      <textarea
        className={styles.textarea}
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={() =>
          localContent !== block.content &&
          onChangeContent(block.id, localContent)
        }
        placeholder="Digite sua anotação aqui..."
      />
      
      {/* CORREÇÃO: Remoção do style inline e adição da classe actionsWrapper */}
      <div
        id={isFirst ? "tour-first-block-actions" : undefined}
        className={styles.actionsWrapper}
      >
        <EmojiPicker onSelect={handleEmoji} />
        <DictationButton onDictate={handleDictate} />
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(block.id)}
          aria-label="Apagar anotação"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};