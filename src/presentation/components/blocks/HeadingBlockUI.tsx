// src/presentation/components/blocks/HeadingBlockUI.tsx
import React, { useState, useEffect } from "react";
import { HeadingBlock } from "../../../domain/entities/Block";
import { DictationButton } from "../ui/DictationButton";
import { EmojiPicker } from "../ui/EmojiPicker";
import { TrashIcon, UpArrowIcon, DownArrowIcon } from "../ui/Icons";
import styles from "./HeadingBlockUI.module.css";

interface HeadingBlockUIProps {
  block: HeadingBlock;
  isFirst?: boolean;
  disableUp?: boolean;
  disableDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: (id: string) => void;
  onChangeContent: (id: string, newContent: string) => void;
}

export const HeadingBlockUI: React.FC<HeadingBlockUIProps> = ({
  block,
  isFirst,
  disableUp,
  disableDown,
  onMoveUp,
  onMoveDown,
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

  const handleEmoji = (emoji: string) => {
    const newContent = localContent ? `${localContent} ${emoji}` : emoji;
    setLocalContent(newContent);
    onChangeContent(block.id, newContent);
  };

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginRight: "8px" }}>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={disableUp}
          style={{ background: "transparent", border: "none", cursor: disableUp ? "not-allowed" : "pointer", opacity: disableUp ? 0.3 : 1, color: "var(--primary-main)" }}
          aria-label="Mover para cima"
        >
          <UpArrowIcon />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={disableDown}
          style={{ background: "transparent", border: "none", cursor: disableDown ? "not-allowed" : "pointer", opacity: disableDown ? 0.3 : 1, color: "var(--primary-main)" }}
          aria-label="Mover para baixo"
        >
          <DownArrowIcon />
        </button>
      </div>

      <input
        type="text"
        className={styles.input}
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={handleBlur}
        placeholder="Escreva um Título Principal..."
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
          aria-label="Apagar Título"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};