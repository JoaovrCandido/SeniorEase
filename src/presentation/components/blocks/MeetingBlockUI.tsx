// src/presentation/components/blocks/MeetingBlockUI.tsx
import React, { useState, useEffect } from "react";
import { MeetingBlock } from "../../../domain/entities/Block";
import { Button } from "../ui/Button";
import { DictationButton } from "../ui/DictationButton";
import { EmojiPicker } from "../ui/EmojiPicker";
import { TrashIcon, VideoIcon, UpArrowIcon, DownArrowIcon } from "../ui/Icons";
import { useToast } from "../../store/ToastContext"; // <-- NOVO IMPORT
import styles from "./MeetingBlockUI.module.css";

interface Props {
  block: MeetingBlock;
  isFirst?: boolean;
  disableUp?: boolean;
  disableDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onChangeContent: (
    id: string,
    title: string,
    url: string,
    date: string,
  ) => void;
  onDelete: (id: string) => void;
}

export const MeetingBlockUI: React.FC<Props> = ({
  block,
  isFirst,
  disableUp,
  disableDown,
  onMoveUp,
  onMoveDown,
  onChangeContent,
  onDelete,
}) => {
  const [title, setTitle] = useState(block.title);
  const [url, setUrl] = useState(block.meetingUrl);
  const [date, setDate] = useState(block.date || "");
  const { showToast } = useToast(); // <-- Usando o Toast

  useEffect(() => {
    setTitle(block.title);
    setUrl(block.meetingUrl);
    setDate(block.date || "");
  }, [block.title, block.meetingUrl, block.date]);

  // <-- NOVA VALIDAÇÃO DE URL -->
  const handleBlur = () => {
    let validUrl = url.trim();
    let hasChanges = false;

    // Se a pessoa preencheu o link, mas esqueceu do 'http', adicionamos automaticamente
    if (validUrl !== "" && !validUrl.startsWith("http")) {
      validUrl = "https://" + validUrl;
      setUrl(validUrl);
      hasChanges = true;
      showToast(
        "Adicionamos 'https://' ao link para garantir que funcione.",
        "info",
      );
    }

    if (
      title !== block.title ||
      validUrl !== block.meetingUrl ||
      date !== block.date ||
      hasChanges
    ) {
      onChangeContent(block.id, title, validUrl, date);
    }
  };

  const handleDictate = (text: string) => {
    const newTitle = title ? `${title} ${text}` : text;
    setTitle(newTitle);
    onChangeContent(block.id, newTitle, url, date);
  };

  const handleEmoji = (emoji: string) => {
    const newTitle = title ? `${title} ${emoji}` : emoji;
    setTitle(newTitle);
    onChangeContent(block.id, newTitle, url, date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginRight: "8px",
            justifyContent: "center",
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

        <div className={styles.iconWrapper}>
          <VideoIcon />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputRow}>
            <input
              className={styles.inputTitle}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              placeholder="Assunto da reunião"
            />
          </div>
          <input
            className={styles.inputBase}
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={handleBlur}
          />
          <input
            className={styles.inputUrl}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleBlur}
            placeholder="Cole o link (Zoom, Meet, Teams...)"
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
            aria-label="Apagar Reunião"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Button variant="primary" style={{ width: "100%", marginTop: "8px" }}>
            Entrar na Reunião
          </Button>
        </a>
      )}
    </div>
  );
};
