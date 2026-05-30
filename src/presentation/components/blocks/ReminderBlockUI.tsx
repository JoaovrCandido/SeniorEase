import React, { useState, useEffect } from "react";
import { ReminderBlock } from "../../../domain/entities/Block";
import { DictationButton } from "../ui/DictationButton";
import { TrashIcon, ClockIcon } from "../ui/Icons";
import styles from "./ReminderBlockUI.module.css";

interface Props {
  block: ReminderBlock;
  onChangeContent: (id: string, content: string, date: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderBlockUI: React.FC<Props> = ({
  block,
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

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
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
            <DictationButton onDictate={handleDictate} />
          </div>
          <input
            className={styles.inputBase}
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={handleBlur}
          />
        </div>

        <button
          className={styles.deleteButton}
          onClick={() => onDelete(block.id)}
          aria-label="Apagar Lembrete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};
