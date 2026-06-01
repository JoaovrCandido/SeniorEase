// src/presentation/components/blocks/HeadingBlockUI.tsx
import React, { useState, useEffect } from "react";
import { HeadingBlock } from "../../../domain/entities/Block";
import { DictationButton } from "../ui/DictationButton";
import { TrashIcon } from "../ui/Icons";
import styles from "./HeadingBlockUI.module.css";

interface HeadingBlockUIProps {
  block: HeadingBlock;
  isFirst?: boolean; // Propriedade nova para o Tour de Ajuda
  onDelete: (id: string) => void;
  onChangeContent: (id: string, newContent: string) => void;
}

export const HeadingBlockUI: React.FC<HeadingBlockUIProps> = ({
  block,
  isFirst,
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
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={handleBlur}
        placeholder="Escreva um Título Principal..."
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
          aria-label="Apagar Título"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};
