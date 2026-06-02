// src/presentation/components/blocks/ReminderBlockUI.tsx
import React, { useState, useEffect } from "react";
import { ReminderBlock } from "../../../domain/entities/Block";
import { DictationButton } from "../ui/DictationButton";
import { EmojiPicker } from "../ui/EmojiPicker";
import { TrashIcon, ClockIcon, UpArrowIcon, DownArrowIcon } from "../ui/Icons";
import styles from "./ReminderBlockUI.module.css";

interface Props {
  block: ReminderBlock;
  isFirst?: boolean;
  disableUp?: boolean;
  disableDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onChangeContent: (id: string, content: string, date: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderBlockUI: React.FC<Props> = ({
  block,
  isFirst,
  disableUp,
  disableDown,
  onMoveUp,
  onMoveDown,
  onChangeContent,
  onDelete,
}) => {
  const [content, setContent] = useState(block.content || "");
  const [date, setDate] = useState(block.date);

  useEffect(() => {
    setContent(block.content || "");
    setDate(block.date);
  }, [block.content, block.date]);

  const handleBlur = () => {
    if (content !== block.content || date !== block.date)
      onChangeContent(block.id, content, date);
  };

  const handleDictate = (text: string) => {
    const newContent = content ? `${content} ${text}` : text;
    setContent(newContent);
    onChangeContent(block.id, newContent, date);
  };

  const handleEmoji = (emoji: string) => {
    const newContent = content ? `${content} ${emoji}` : emoji;
    setContent(newContent);
    onChangeContent(block.id, newContent, date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginRight: "8px", justifyContent: "center" }}>
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

        <div className={styles.iconWrapper}>
          <ClockIcon />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputRow}>
            <input
              className={styles.inputTitle}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleBlur}
              placeholder="Do que você precisa se lembrar?"
            />
          </div>
          <input
            className={styles.inputBase}
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={handleBlur}
          />
        </div>

        <div
          id={isFirst ? "tour-first-block-actions" : undefined}
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <EmojiPicker onSelect={handleEmoji} />
          <DictationButton onDictate={handleDictate} />
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(block.id)}
            aria-label="Apagar Lembrete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
};