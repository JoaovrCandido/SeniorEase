// src/app/history/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotebookContext } from "@/presentation/store/NotebookContext";
import {
  BackIcon,
  CheckIcon,
  HelpIcon,
} from "@/presentation/components/ui/Icons";
import {
  OnboardingTour,
  TourStep,
} from "@/presentation/components/ui/OnboardingTour";
import styles from "@/app/page.module.css";

const HISTORY_STEPS: TourStep[] = [
  {
    targetId: "tour-help-btn",
    title: "1. Precisa de Ajuda?",
    description: "Sempre que tiver dúvidas, clique neste botão.",
  },
  {
    targetId: "tour-back-btn",
    title: "2. Voltar",
    description: "Use este botão para voltar à tela principal.",
  },
  {
    targetId: "tour-history-list",
    title: "3. O Seu Registo",
    description:
      "Usando este primeiro item como exemplo: veja que aqui estão as informações do que você completou. Todos os outros itens da lista abaixo funcionam exatamente da mesma forma e representam o seu arquivo de sucessos!",
  },
];

export default function HistoryPage() {
  const router = useRouter();
  const { notebooks } = useNotebookContext();
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("@SeniorEase:tour:history")) {
      setIsTourOpen(true);
      localStorage.setItem("@SeniorEase:tour:history", "true");
    }
  }, []);

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
        <header className={styles.pageHeaderBetween}>
          <div className={styles.flexAlignCenter}>
            <button
              id="tour-back-btn"
              className={styles.backButton}
              onClick={() => router.push("/")}
            >
              <BackIcon /> Voltar
            </button>
            <h1 className={`${styles.title} ${styles.textSuccess}`}>
              Histórico de Atividades
            </h1>
          </div>
          <button
            id="tour-help-btn"
            onClick={() => setIsTourOpen(true)}
            className={styles.btnPrimarySurface}
          >
            <HelpIcon /> Ajuda
          </button>
        </header>

        {/* O ID FOI REMOVIDO DAQUI */}
        <div className={styles.contentWrapper}>
          {completedTasksList.length === 0 ? (
            <p className={styles.emptyState}>
              Você ainda não concluiu nenhuma tarefa. Continue assim, um passo
              de cada vez!
            </p>
          ) : (
            <div className={styles.grid}>
              {completedTasksList.map(({ notebookTitle, block }, index) => (
                <div
                  key={block.id}
                  id={index === 0 ? "tour-history-list" : undefined}
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

      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={HISTORY_STEPS}
      />
    </main>
  );
}
