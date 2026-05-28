// src/app/page.tsx
"use client";

import React, { useState } from "react";

import { NotificationService } from "@/infrastructure/services/NotificationService";

import { useNotebook } from "@/presentation/hooks/useNotebook";
import { useNotifications } from "@/presentation/hooks/useNotifications";

// Importação dos Componentes de Bloco
import { TaskBlockUI } from "@/presentation/components/blocks/TaskBlockUI";
import { HeadingBlockUI } from "@/presentation/components/blocks/HeadingBlockUI";
import { ParagraphBlockUI } from "@/presentation/components/blocks/ParagraphBlockUI";
import { MeetingBlockUI } from "@/presentation/components/blocks/MeetingBlockUI";
import { ReminderBlockUI } from "@/presentation/components/blocks/ReminderBlockUI";

// Importação dos Componentes de UI
import { AccessibilityPanel } from "@/presentation/components/ui/AccessibilityPanel";
import { Modal } from "@/presentation/components/ui/Modal";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import { ReadAloudButton } from "@/presentation/components/ui/ReadAloudButton";

import styles from "./page.module.css";

export default function Home() {
  const {
    notebooks,
    isLoading,
    createNotebook,
    addBlock,
    toggleTask,
    updateBlock,
    deleteBlock,
    updateNotebookInfo,
    deleteNotebook,
  } = useNotebook();

  // ATIVA AS NOTIFICAÇÕES GLOBAIS
  useNotifications(notebooks);

  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);

  // Estados dos Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Formulário de Caderno (Serve para Criar e Editar)
  const [notebookTitle, setNotebookTitle] = useState("");
  const [notebookDescription, setNotebookDescription] = useState("");

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId);

  // --- Funções de Ação ---
  const openCreateModal = () => {
    setNotebookTitle("");
    setNotebookDescription("");
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreate = async () => {
    if (notebookTitle.trim()) {
      await createNotebook(notebookTitle, notebookDescription);
      setIsCreateModalOpen(false);
    }
  };

  const openEditModal = () => {
    if (activeNotebook) {
      setNotebookTitle(activeNotebook.title);
      setNotebookDescription(activeNotebook.description || "");
      setIsEditModalOpen(true);
    }
  };

  const handleConfirmEdit = async () => {
    if (activeNotebook && notebookTitle.trim()) {
      await updateNotebookInfo(
        activeNotebook.id,
        notebookTitle,
        notebookDescription,
      );
      setIsEditModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (activeNotebook) {
      await deleteNotebook(activeNotebook.id);
      setIsDeleteModalOpen(false);
      setActiveNotebookId(null);
    }
  };

  const closeNotebook = () => {
    setActiveNotebookId(null);
    setIsReadingMode(false);
  };

  // ==========================================
  // RENDERIZAÇÃO: MODO EDITOR / LEITURA
  // ==========================================
  if (activeNotebookId && activeNotebook) {
    const hasHeading = activeNotebook.blocks.some(
      (block) => block.type === "heading",
    );

    // LÓGICA DE COMPILAÇÃO MELHORADA PARA VOZ
    const compiledTextToRead = activeNotebook.blocks
      .map((b) => {
        if (b.type === "heading" && b.content.trim() !== "")
          return `Título da secção: ${b.content}`;
        if (b.type === "paragraph" && b.content.trim() !== "")
          return `Anotação: ${b.content}`;
        if (b.type === "task" && b.content.trim() !== "")
          return `Tarefa ${b.isCompleted ? "concluída" : "pendente"}: ${b.content}`;
        if (b.type === "meeting" && b.title.trim() !== "")
          return `Reunião: ${b.title}`;
        if (b.type === "reminder" && (b.content?.trim() !== "" || b.date)) {
          const textoDescricao = b.content?.trim()
            ? b.content
            : "Sem assunto definido";
          const dataFormatada = b.date
            ? new Date(b.date).toLocaleString("pt-BR")
            : "Sem horário definido";
          return `Lembrete: ${textoDescricao}, agendado para: ${dataFormatada}`;
        }
        return "";
      })
      .filter((text) => text !== "")
      .join(". ");

    return (
      <main className={styles.main}>
        <div className={styles.editor}>
          <header
            className={styles.editorHeader}
            style={{
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <button className={styles.a11yButton} onClick={closeNotebook}>
                ← Voltar
              </button>

              <div>
                <h1 className={styles.editorTitle}>{activeNotebook.title}</h1>
                {activeNotebook.description && (
                  <p className={styles.editorDescription}>
                    {activeNotebook.description}
                  </p>
                )}
              </div>

              {/* Botões de Ação do Caderno */}
              {!isReadingMode && (
                <div className={styles.headerActions}>
                  <button
                    className={styles.secondaryButton}
                    onClick={openEditModal}
                  >
                    ✏️ Editar Nome e Descrição
                  </button>
                  <button
                    className={styles.dangerButton}
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    🗑️ Apagar Caderno
                  </button>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <button
                className={`${styles.toggleReadingButton} ${isReadingMode ? styles.active : ""}`}
                onClick={() => setIsReadingMode(!isReadingMode)}
              >
                {isReadingMode ? "📖 Sair da Leitura" : "📖 Modo Leitura"}
              </button>
              {compiledTextToRead && (
                <ReadAloudButton
                  textToRead={`Nome do Caderno: ${activeNotebook.title}. ${activeNotebook.description ? `Descrição: ${activeNotebook.description}.` : ""} ${compiledTextToRead}`}
                />
              )}
            </div>
          </header>

          {isReadingMode ? (
            <article className={styles.readingContainer}>
              {activeNotebook.blocks.length === 0 ? (
                <p className={styles.readParagraph}>Este caderno está vazio.</p>
              ) : (
                activeNotebook.blocks.map((block) => {
                  switch (block.type) {
                    case "heading":
                      return (
                        <h2 key={block.id} className={styles.readHeading}>
                          {block.content}
                        </h2>
                      );
                    case "paragraph":
                      return (
                        <p key={block.id} className={styles.readParagraph}>
                          {block.content}
                        </p>
                      );
                    case "task":
                      return (
                        <div
                          key={block.id}
                          className={`${styles.readTask} ${block.isCompleted ? styles.completed : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={block.isCompleted}
                            readOnly
                            className={styles.readCheckbox}
                            aria-hidden="true"
                          />
                          <span>{block.content}</span>
                        </div>
                      );
                    case "meeting":
                      return (
                        <div key={block.id} className={styles.readCard}>
                          <strong>🎥 Reunião: {block.title}</strong>
                          {block.meetingUrl && (
                            <a
                              href={block.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Acessar link da reunião
                            </a>
                          )}
                        </div>
                      );
                    case "reminder":
                      return (
                        <div key={block.id} className={styles.readCard}>
                          <strong>⏰ Lembrete: {block.content}</strong>
                          {block.date && (
                            <span>
                              Data:{" "}
                              {new Date(block.date).toLocaleString("pt-BR")}
                            </span>
                          )}
                        </div>
                      );
                    default:
                      return null;
                  }
                })
              )}
            </article>
          ) : (
            <section>
              {activeNotebook.blocks.length === 0 ? (
                <p className={styles.emptyState}>
                  O seu caderno está vazio. Comece a adicionar conteúdo na barra
                  abaixo!
                </p>
              ) : (
                activeNotebook.blocks.map((block) => {
                  switch (block.type) {
                    case "heading":
                      return (
                        <HeadingBlockUI
                          key={block.id}
                          block={block}
                          onDelete={(id) => deleteBlock(activeNotebook.id, id)}
                          onChangeContent={(id, content) =>
                            updateBlock(activeNotebook.id, id, { content })
                          }
                        />
                      );
                    case "task":
                      return (
                        <TaskBlockUI
                          key={block.id}
                          block={block}
                          onToggle={(id) => toggleTask(activeNotebook.id, id)}
                          onDelete={(id) => deleteBlock(activeNotebook.id, id)}
                          onChangeContent={(id, content) =>
                            updateBlock(activeNotebook.id, id, { content })
                          }
                        />
                      );
                    case "paragraph":
                      return (
                        <ParagraphBlockUI
                          key={block.id}
                          block={block}
                          onDelete={(id) => deleteBlock(activeNotebook.id, id)}
                          onChangeContent={(id, content) =>
                            updateBlock(activeNotebook.id, id, { content })
                          }
                        />
                      );
                    case "meeting":
                      return (
                        <MeetingBlockUI
                          key={block.id}
                          block={block}
                          onDelete={(id) => deleteBlock(activeNotebook.id, id)}
                          onChangeContent={(id, title, meetingUrl, date) =>
                            updateBlock(activeNotebook.id, id, {
                              title,
                              meetingUrl,
                              date,
                            })
                          }
                        />
                      );
                    case "reminder":
                      return (
                        <ReminderBlockUI
                          key={block.id}
                          block={block}
                          onDelete={(id) => deleteBlock(activeNotebook.id, id)}
                          onChangeContent={(id, content, date) =>
                            updateBlock(activeNotebook.id, id, {
                              content,
                              date,
                            })
                          }
                        />
                      );
                    default:
                      return null;
                  }
                })
              )}
            </section>
          )}
        </div>

        {!isReadingMode && (
          <nav
            className={styles.bottomBar}
            aria-label="Adicionar elementos"
            style={{ flexWrap: "wrap" }}
          >
            {!hasHeading && (
              <button
                className={styles.actionButton}
                onClick={() =>
                  addBlock(activeNotebook.id, { type: "heading", content: "" })
                }
              >
                <span aria-hidden="true" style={{ fontSize: "24px" }}>
                  📝
                </span>{" "}
                Título
              </button>
            )}
            <button
              className={styles.actionButton}
              onClick={() =>
                addBlock(activeNotebook.id, { type: "paragraph", content: "" })
              }
            >
              <span aria-hidden="true" style={{ fontSize: "24px" }}>
                ✍️
              </span>{" "}
              Anotação
            </button>
            <button
              className={styles.actionButton}
              onClick={() =>
                addBlock(activeNotebook.id, {
                  type: "task",
                  content: "",
                  isCompleted: false,
                })
              }
            >
              <span aria-hidden="true" style={{ fontSize: "24px" }}>
                ✅
              </span>{" "}
              Tarefa
            </button>
            <button
              className={styles.actionButton}
              onClick={async () => {
                // Pede permissão ANTES de criar o bloco
                await NotificationService.requestPermission();
                addBlock(activeNotebook.id, {
                  type: "reminder",
                  content: "",
                  date: "",
                });
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "24px" }}>
                ⏰
              </span>{" "}
              Lembrete
            </button>

            <button
              className={styles.actionButton}
              onClick={async () => {
                // Pede permissão ANTES de criar o bloco
                await NotificationService.requestPermission();
                addBlock(activeNotebook.id, {
                  type: "meeting",
                  title: "",
                  meetingUrl: "",
                  date: "",
                });
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "24px" }}>
                🎥
              </span>{" "}
              Reunião
            </button>
          </nav>
        )}

        {/* Modal de Edição do Caderno */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Caderno"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-lg)",
            }}
          >
            <Input
              label="Nome do Caderno"
              value={notebookTitle}
              onChange={(e) => setNotebookTitle(e.target.value)}
            />
            <Input
              label="Descrição (Opcional)"
              value={notebookDescription}
              onChange={(e) => setNotebookDescription(e.target.value)}
              placeholder="Do que se trata este caderno?"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirmEdit();
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--space-md)",
              }}
            >
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmEdit}
                disabled={!notebookTitle.trim()}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal de Exclusão do Caderno */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Apagar Caderno"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-lg)",
            }}
          >
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--text-heading)",
              }}
            >
              Tem certeza que deseja apagar o caderno{" "}
              <strong>{activeNotebook.title}</strong>? Esta ação não pode ser
              desfeita e todo o conteúdo será perdido.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--space-md)",
              }}
            >
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Sim, Apagar Caderno
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO: MODO DASHBOARD (HOME)
  // ==========================================
  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Os meus Cadernos</h1>
        </header>

        <AccessibilityPanel />

        {isLoading ? (
          <p className={styles.emptyState}>A carregar os seus cadernos...</p>
        ) : (
          <div className={styles.grid}>
            <button
              className={styles.card}
              onClick={openCreateModal}
              style={{ borderStyle: "dashed", backgroundColor: "transparent" }}
            >
              <span className={styles.cardTitle}>+ Criar Novo Caderno</span>
              <span className={styles.cardDate}>
                Clique aqui para começar um novo projeto ou aula.
              </span>
            </button>

            {notebooks.map((notebook) => (
              <button
                key={notebook.id}
                className={styles.card}
                onClick={() => setActiveNotebookId(notebook.id)}
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

      {/* Modal de Criação de Caderno */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Novo Caderno"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          <Input
            label="Nome do Caderno"
            placeholder="Ex: Aula de Matemática, Reuniões..."
            value={notebookTitle}
            onChange={(e) => setNotebookTitle(e.target.value)}
            autoFocus
          />
          <Input
            label="Descrição (Opcional)"
            placeholder="Do que se trata este caderno?"
            value={notebookDescription}
            onChange={(e) => setNotebookDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmCreate();
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-md)",
            }}
          >
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
    </main>
  );
}
