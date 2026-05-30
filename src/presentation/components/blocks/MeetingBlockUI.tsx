import React, { useState, useEffect } from "react";
import { MeetingBlock } from "../../../domain/entities/Block";
import { Button } from "../ui/Button";
import { DictationButton } from "../ui/DictationButton";
import { TrashIcon, VideoIcon } from "../ui/Icons";
import styles from "./MeetingBlockUI.module.css";

interface Props {
  block: MeetingBlock;
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
  onChangeContent,
  onDelete,
}) => {
  const [title, setTitle] = useState(block.title);
  const [url, setUrl] = useState(block.meetingUrl);
  const [date, setDate] = useState(block.date || "");

  useEffect(() => {
    setTitle(block.title);
    setUrl(block.meetingUrl);
    setDate(block.date || "");
  }, [block.title, block.meetingUrl, block.date]);

  const handleBlur = () => {
    if (
      title !== block.title ||
      url !== block.meetingUrl ||
      date !== block.date
    )
      onChangeContent(block.id, title, url, date);
  };

  const handleDictate = (text: string) => {
    const newTitle = title ? `${title} ${text}` : text;
    setTitle(newTitle);
    onChangeContent(block.id, newTitle, url, date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
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
            <DictationButton onDictate={handleDictate} />
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

        <button
          className={styles.deleteButton}
          onClick={() => onDelete(block.id)}
          aria-label="Apagar Reunião"
        >
          <TrashIcon />
        </button>
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
