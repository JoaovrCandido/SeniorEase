// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotebookContext } from "@/presentation/store/NotebookContext";
import { useToast } from "@/presentation/store/ToastContext";
import { useUserProfile } from "@/presentation/store/UserProfileContext";

import { Modal } from "@/presentation/components/ui/Modal";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import { AccessibilityPanel } from "@/presentation/components/ui/AccessibilityPanel";
import {
  OnboardingTour,
  TourStep,
} from "@/presentation/components/ui/OnboardingTour";

import {
  HelpIcon,
  UserIcon,
  PhoneIcon,
  HistoryIcon,
  TrashIcon,
  SettingsIcon,
  BookIcon,
  TaskIcon, // <-- IMPORTADO PARA DIFERENCIAR NA LISTA
} from "@/presentation/components/ui/Icons";

import styles from "./page.module.css";

const DASHBOARD_STEPS: TourStep[] = [
  {
    targetId: "tour-help-btn",
    title: "1. Precisa de Ajuda?",
    description: "Sempre que tiver dúvidas sobre o que fazer nesta tela, clique neste botão e eu explicarei tudo!",
  },
  {
    targetId: "tour-accessibility-btn",
    title: "2. O Seu Perfil",
    description: "Acesse esta tela para preencher os seus contatos pessoais.",
  },
  {
    targetId: "tour-settings-btn",
    title: "3. Personalizar Tela",
    description: "Ajuste o tamanho da letra, o contraste e outras opções para tornar tudo mais fácil de ler.",
  },
  {
    targetId: "tour-create",
    title: "4. Criar Cadernos ou Listas",
    description: "Crie cadernos para textos completos ou listas apenas para tarefas.",
  },
  {
    targetId: "tour-history-btn",
    title: "5. Histórico",
    description: "Veja tudo o que já concluiu aqui.",
  },
  {
    targetId: "tour-trash-btn",
    title: "6. Lixeira",
    description: "Recupere itens apagados com facilidade.",
  }
];

const SETTINGS_STEPS: TourStep[] = [
  {
    targetId: "tour-modal-help-btn",
    title: "1. Precisa de Ajuda?",
    description: "Sempre que tiver dúvidas sobre o que fazer nesta tela, clique neste botão e eu explicarei tudo!",
  },
  {
    targetId: "tour-accessibility-panel",
    title: "2. Personalização",
    description: "Altere o tamanho da letra, as cores e a segurança para deixar tudo perfeitamente confortável para si.",
  }
];

export default function Home() {
  const router = useRouter();
  const { notebooks, isLoading, createNotebook } = useNotebookContext();
  const { emergencyContact } = useUserProfile();
  const { showToast } = useToast();

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isSettingsTourOpen, setIsSettingsTourOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // <-- NOVO: Estado para saber qual o tipo a criar
  const [createType, setCreateType] = useState<"notebook" | "todo">("notebook");
  
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
      await createNotebook(notebookTitle, notebookDescription, createType); // <-- NOVO TIPO ENVIADO
      setIsCreateModalOpen(false);
      showToast(createType === "todo" ? "Lista criada com sucesso!" : "Caderno criado!", "success");
      setNotebookTitle("");
      setNotebookDescription("");
    }
  };

  const openCreateModal = (type: "notebook" | "todo") => {
    setCreateType(type);
    setIsCreateModalOpen(true);
  };

  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        <header className={styles.pageHeaderBetween}>
          <h1 className={styles.title}>Meus Cadernos & Listas</h1>

          <div className={styles.flexWrapGap16}>
            {emergencyContact && (
              <a 
                href={`tel:${emergencyContact.replace(/\D/g, '')}`} 
                className={styles.btnPrimarySurface}
                style={{ backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#f87171' }}
              >
                <PhoneIcon /> Ligar S.O.S
              </a>
            )}

            <button
              id="tour-help-btn"
              onClick={() => setIsTourOpen(true)}
              className={styles.btnPrimarySurface}
            >
              <HelpIcon /> Ajuda
            </button>
            <button
              id="tour-accessibility-btn"
              onClick={() => router.push("/profile")}
              className={styles.btnOutline}
            >
              <UserIcon /> Meu Perfil
            </button>

            <button
              id="tour-settings-btn"
              onClick={() => setIsSettingsModalOpen(true)}
              className={styles.btnOutline}
            >
              <SettingsIcon /> Personalizar
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
          <div id="tour-create" className={styles.grid}>
            
            {/* BOTÃO 1: Criar Caderno Normal */}
            <button
              className={`${styles.card} ${styles.cardDashedCreate}`}
              onClick={() => openCreateModal("notebook")}
            >
              <span className={styles.cardTitle}>+ Criar Caderno</span>
              <span className={styles.cardDate}>
                Para anotações, reuniões e textos.
              </span>
            </button>

            {/* BOTÃO 2: Criar Apenas Lista de Tarefas */}
            <button
              className={`${styles.card} ${styles.cardDashedCreate}`}
              onClick={() => openCreateModal("todo")}
              style={{ borderColor: "var(--primary-main)", borderStyle: "dashed" }}
            >
              <span className={styles.cardTitle}>+ Criar Lista de Tarefas</span>
              <span className={styles.cardDate}>
                Apenas para listas rápidas e tarefas.
              </span>
            </button>

            {notebooks.map((notebook) => (
              <button
                key={notebook.id}
                className={styles.card}
                onClick={() => router.push(`/notebook/${notebook.id}`)}
              >
                {/* Diferenciação Visual por Ícone */}
                <div className={styles.flexAlignCenter} style={{ marginBottom: "8px", color: "var(--primary-main)" }}>
                  {notebook.type === "todo" ? <TaskIcon /> : <BookIcon />}
                  <span className={styles.cardTitle} style={{ margin: 0 }}>{notebook.title}</span>
                </div>
                
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
        title={createType === "todo" ? "Criar Nova Lista" : "Criar Novo Caderno"}
        position="center"
      >
        <div className={styles.modalContent}>
          <Input
            label={createType === "todo" ? "Nome da Lista" : "Nome do Caderno"}
            placeholder={createType === "todo" ? "Ex: Compras do Supermercado..." : "Ex: Aulas..."}
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
            onEmoji={(emoji) => setNotebookDescription((prev) => (prev ? `${prev} ${emoji}` : emoji))}
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
              Criar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Personalizar Tela"
        position="left" 
        onHelp={() => setIsSettingsTourOpen(true)}
      >
        <AccessibilityPanel />
      </Modal>

      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={DASHBOARD_STEPS}
      />

      <OnboardingTour
        isOpen={isSettingsTourOpen}
        onClose={() => setIsSettingsTourOpen(false)}
        steps={SETTINGS_STEPS}
      />
    </main>
  );
}