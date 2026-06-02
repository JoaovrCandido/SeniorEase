// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotebookContext } from "@/presentation/store/NotebookContext";
import { useToast } from "@/presentation/store/ToastContext";

import { Modal } from "@/presentation/components/ui/Modal";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import {
  OnboardingTour,
  TourStep,
} from "@/presentation/components/ui/OnboardingTour";

import {
  HelpIcon,
  SettingsIcon,
  HistoryIcon,
  TrashIcon,
} from "@/presentation/components/ui/Icons";

import styles from "./page.module.css";

const DASHBOARD_STEPS: TourStep[] = [
  {
    targetId: "tour-help-btn",
    title: "1. Precisa de Ajuda?",
    description:
      "Sempre que tiver dúvidas sobre o que fazer nesta tela, clique neste botão e eu explicarei tudo!",
  },
  {
    targetId: "tour-accessibility-btn",
    title: "2. Conforto Visual",
    description:
      "Ajuste o tamanho da letra e o contraste para facilitar a leitura.",
  },
  {
    targetId: "tour-create",
    title: "3. Criar Cadernos",
    description: "Crie cadernos para guardar tarefas e notas.",
  },
  {
    targetId: "tour-history-btn",
    title: "4. Histórico",
    description: "Veja tudo o que já concluiu aqui.",
  },
  {
    targetId: "tour-trash-btn",
    title: "5. Lixeira",
    description: "Recupere itens apagados com facilidade.",
  },
];

export default function Home() {
  const router = useRouter();
  const { notebooks, isLoading, createNotebook } = useNotebookContext();
  const { showToast } = useToast();

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notebookTitle, setNotebookTitle] = useState("");
  const [notebookDescription, setNotebookDescription] = useState("");

  useEffect(() => {
    if (!isLoading && !localStorage.getItem("@SeniorEase:tour:dashboard")) {
      setIsTourOpen(true);
      localStorage.setItem("@SeniorEase:tour:dashboard", "true");
    }
  }, [isLoading]);

  const handleConfirmCreate = async () => {
    if (notebookTitle.trim()) {
      await createNotebook(notebookTitle, notebookDescription);
      setIsCreateModalOpen(false);
      showToast("Caderno criado!", "success");
      setNotebookTitle("");
      setNotebookDescription("");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        <header className={styles.pageHeaderBetween}>
          <h1 className={styles.title}>Os meus Cadernos</h1>

          <div className={styles.flexWrapGap16}>
            <button
              id="tour-help-btn"
              onClick={() => setIsTourOpen(true)}
              className={styles.btnPrimarySurface}
            >
              <HelpIcon /> Ajuda
            </button>
            <button
              id="tour-accessibility-btn"
              onClick={() => router.push("/settings")}
              className={styles.btnOutline}
            >
              <SettingsIcon /> Personalizar Tela
            </button>
            <button
              id="tour-history-btn"
              onClick={() => router.push("/history")}
              className={styles.btnOutlineSuccess}
            >
              <HistoryIcon /> Histórico
            </button>
            <button
              id="tour-trash-btn"
              onClick={() => router.push("/trash")}
              className={styles.btnOutline}
            >
              <TrashIcon /> Lixeira
            </button>
          </div>
        </header>

        {isLoading ? (
          <p className={styles.emptyState}>A carregar...</p>
        ) : (
          <div className={styles.grid}>
            <button
              id="tour-create"
              className={`${styles.card} ${styles.cardDashedCreate}`}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <span className={styles.cardTitle}>+ Criar Novo Caderno</span>
              <span className={styles.cardDate}>
                Clique aqui para começar um novo projeto.
              </span>
            </button>

            {notebooks.map((notebook) => (
              <button
                key={notebook.id}
                className={styles.card}
                onClick={() => router.push(`/notebook/${notebook.id}`)}
              >
                <span className={styles.cardTitle}>{notebook.title}</span>
                {notebook.description && (
                  <span className={styles.cardDescription}>
                    {notebook.description}
                  </span>
                )}
                <span className={styles.cardDate}>
                  Última alteração:{" "}
                  {notebook.updatedAt.toLocaleDateString("pt-BR")}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Novo Caderno"
      >
        <div className={styles.modalContent}>
          <Input
            label="Nome do Caderno"
            placeholder="Ex: Aulas..."
            value={notebookTitle}
            onChange={(e) => setNotebookTitle(e.target.value)}
            onDictate={(text) =>
              setNotebookTitle((prev) => (prev ? `${prev} ${text}` : text))
            }
            autoFocus
            onEmoji={(emoji) => setNotebookTitle((prev) => (prev ? `${prev} ${emoji}` : emoji))}
          />
          <Input
            label="Descrição (Opcional)"
            value={notebookDescription}
            onChange={(e) => setNotebookDescription(e.target.value)}
            onDictate={(text) =>
              setNotebookDescription((prev) =>
                prev ? `${prev} ${text}` : text,
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmCreate();
            }}
            onEmoji={(emoji) => setNotebookTitle((prev) => (prev ? `${prev} ${emoji}` : emoji))}
          />
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmCreate}
              disabled={!notebookTitle.trim()}
            >
              Criar Caderno
            </Button>
          </div>
        </div>
      </Modal>

      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={DASHBOARD_STEPS}
      />
    </main>
  );
}
