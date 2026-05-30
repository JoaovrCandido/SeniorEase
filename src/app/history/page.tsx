// src/app/history/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNotebookContext } from "@/presentation/store/NotebookContext";
import { BackIcon, CheckIcon } from "@/presentation/components/ui/Icons";
import styles from "@/app/page.module.css";

export default function HistoryPage() {
  const router = useRouter();
  const { notebooks } = useNotebookContext();

  const completedTasksList = notebooks.flatMap((notebook) =>
    notebook.blocks
      .filter(
        (block) =>
          !block.isDeleted && block.type === "task" && block.isCompleted,
      )
      .map((block) => ({ notebookTitle: notebook.title, block })),
  );

  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        <header className={styles.pageHeader}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            <BackIcon /> Voltar
          </button>
          <h1 className={styles.title}>Personalizar Tela</h1>
        </header>

        <div className={styles.contentWrapper}>
          {completedTasksList.length === 0 ? (
            <p className={styles.emptyState}>
              Você ainda não concluiu nenhuma tarefa. Continue assim, um passo
              de cada vez!
            </p>
          ) : (
            <div className={styles.grid}>
              {completedTasksList.map(({ notebookTitle, block }) => (
                <div
                  key={block.id}
                  className={`${styles.card} ${styles.cardSuccess}`}
                >
                  <span className={styles.textBaseHeading}>
                    <CheckIcon /> {block.content || "Tarefa concluída"}
                  </span>
                  <span className={styles.textItalicSuccess}>
                    Concluído no caderno: {notebookTitle}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
