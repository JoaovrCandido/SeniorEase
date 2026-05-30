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
    targetId: "tour-trash-header",
    title: "1. Área de Segurança",
    description:
      "Bem-vindo à Lixeira. Tudo o que você apaga vem para cá e fica guardado com segurança.",
  },
  {
    targetId: "tour-trash-content",
    title: "2. Como Recuperar",
    description:
      "Basta clicar no botão Restaurar ao lado do item, e ele voltará imediatamente para o lugar de onde saiu!",
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
        <header className={styles.pageHeader}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            <BackIcon /> Voltar
          </button>
          <h1 className={styles.title}>Personalizar Tela</h1>
        </header>

        <div id="tour-trash-content" className={styles.trashContainer}>
          {deletedNotebooks.length === 0 && deletedBlocksList.length === 0 ? (
            <p className={styles.emptyState}>A sua lixeira está vazia.</p>
          ) : (
            <>
              {deletedNotebooks.length > 0 && (
                <section>
                  <h2 className={styles.sectionTitle}>Cadernos Apagados</h2>
                  <div className={styles.grid}>
                    {deletedNotebooks.map((notebook) => (
                      <div
                        key={notebook.id}
                        className={`${styles.card} ${styles.cardDanger}`}
                      >
                        <span className={styles.cardTitle}>
                          {notebook.title}
                        </span>
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
                      ({ notebookId, notebookTitle, block }) => (
                        <div
                          key={block.id}
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
