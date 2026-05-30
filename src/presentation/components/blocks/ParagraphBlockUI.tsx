import React, { useState, useEffect } from "react";
import { ParagraphBlock } from "../../../domain/entities/Block";
import { DictationButton } from "../ui/DictationButton";
import { TrashIcon } from "../ui/Icons";
import styles from "./ParagraphBlockUI.module.css";

interface Props {
  block: ParagraphBlock;
  onChangeContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const ParagraphBlockUI: React.FC<Props> = ({
  block,
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

  return (
    <div className={styles.container}>
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
      <DictationButton onDictate={handleDictate} />
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(block.id)}
        aria-label="Apagar anotação"
      >
        <TrashIcon />
      </button>
    </div>
  );
};
