// src/app/trash/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotebookContext } from "@/presentation/store/NotebookContext";
import { useToast } from "@/presentation/store/ToastContext";
import { Button } from "@/presentation/components/ui/Button";
import {
  OnboardingTour,
  TourStep,
} from "@/presentation/components/ui/OnboardingTour";
import {
  BackIcon,
  HelpIcon,
  RestoreIcon,
} from "@/presentation/components/ui/Icons";
import styles from "@/app/page.module.css";

const TRASH_STEPS: TourStep[] = [
  {
    targetId: "tour-help-btn",
    title: "1. Precisa de Ajuda?",
    description:
      "Sempre que tiver dúvidas sobre como recuperar algo, clique neste botão.",
  },
  {
    targetId: "tour-back-btn",
    title: "2. Voltar",
    description:
      "Clique aqui quando quiser sair da Lixeira e voltar ao ecrã inicial.",
  },
  {
    targetId: "tour-trash-content",
    title: "3. Como Recuperar",
    description:
      'Usando este primeiro item como exemplo: veja que ele tem um botão "Restaurar". Basta clicar nele para que o item volte ao seu local original com total segurança. Os restantes itens apagados funcionam exatamente da mesma forma!',
  },
];

export default function TrashPage() {
  const router = useRouter();
  const { notebooks, deletedNotebooks, restoreNotebook, restoreBlock } =
    useNotebookContext();
  const { showToast } = useToast();
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("@SeniorEase:tour:trash")) {
      setIsTourOpen(true);
      localStorage.setItem("@SeniorEase:tour:trash", "true");
    }
  }, []);

  const deletedBlocksList = notebooks.flatMap((notebook) =>
    notebook.blocks
      .filter((block) => block.isDeleted)
      .map((block) => ({
        notebookId: notebook.id,
        notebookTitle: notebook.title,
        block,
      })),
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
            <h1 className={styles.title}>Lixeira</h1>
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
        <div className={styles.trashContainer}>
          {deletedNotebooks.length === 0 && deletedBlocksList.length === 0 ? (
            <p className={styles.emptyState}>A sua lixeira está vazia.</p>
          ) : (
            <>
              {deletedNotebooks.length > 0 && (
                <section>
                  <h2 className={styles.sectionTitle}>Cadernos Apagados</h2>
                  <div className={styles.grid}>
                    {deletedNotebooks.map((notebook, index) => (
                      <div
                        key={notebook.id}
                        id={index === 0 ? "tour-trash-content" : undefined}
                        className={`${styles.card} ${styles.cardDanger}`}
                      >
                        <span className={styles.cardTitle}>
                          {notebook.title}
                        </span>
                        {notebook.description && (
                          <span className={styles.cardDescription}>
                            {notebook.description}
                          </span>
                        )}
                        <Button
                          variant="primary"
                          onClick={async () => {
                            await restoreNotebook(notebook.id);
                            showToast("Restaurado!", "success");
                          }}
                          className={styles.mt16}
                        >
                          <RestoreIcon /> Restaurar Caderno
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {deletedBlocksList.length > 0 && (
                <section>
                  <h2 className={styles.sectionTitle}>Itens Apagados</h2>
                  <div className={styles.grid}>
                    {deletedBlocksList.map(
                      ({ notebookId, notebookTitle, block }, index) => (
                        <div
                          key={block.id}
                          id={
                            deletedNotebooks.length === 0 && index === 0
                              ? "tour-trash-content"
                              : undefined
                          }
                          className={`${styles.card} ${styles.cardDashed}`}
                        >
                          <span className={styles.textBaseBody}>
                            {block.type === "heading"
                              ? "Título"
                              : block.type === "paragraph"
                                ? "Anotação"
                                : block.type === "task"
                                  ? "Tarefa"
                                  : block.type === "meeting"
                                    ? "Reunião"
                                    : "Lembrete"}{" "}
                            de: {notebookTitle}
                          </span>
                          <Button
                            variant="primary"
                            onClick={async () => {
                              await restoreBlock(notebookId, block.id);
                              showToast("Restaurado!", "success");
                            }}
                            className={styles.mt16}
                          >
                            <RestoreIcon /> Restaurar Item
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={TRASH_STEPS}
      />
    </main>
  );
}
