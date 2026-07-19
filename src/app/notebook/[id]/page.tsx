// src/app/notebook/[id]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNotebookContext } from "@/presentation/store/NotebookContext";
import { useToast } from "@/presentation/store/ToastContext";
import { useAccessibility } from "@/presentation/store/AccessibilityContext";
import { NotificationService } from "@/infrastructure/services/NotificationService";

import { TaskBlockUI } from "@/presentation/components/blocks/TaskBlockUI";
import { HeadingBlockUI } from "@/presentation/components/blocks/HeadingBlockUI";
import { ParagraphBlockUI } from "@/presentation/components/blocks/ParagraphBlockUI";
import { MeetingBlockUI } from "@/presentation/components/blocks/MeetingBlockUI";
import { ReminderBlockUI } from "@/presentation/components/blocks/ReminderBlockUI";
import { Modal } from "@/presentation/components/ui/Modal";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import { ReadAloudButton } from "@/presentation/components/ui/ReadAloudButton";
import {
  OnboardingTour,
  TourStep,
} from "@/presentation/components/ui/OnboardingTour";
import { CommandPalette } from "@/presentation/components/ui/CommandPalette";

import {
  BackIcon,
  HelpIcon,
  EditIcon,
  TrashIcon,
  BookIcon,
  TitleIcon,
  WriteIcon,
  TaskIcon,
  ClockIcon,
  VideoIcon,
  MicIcon,
  PrintIcon,
} from "@/presentation/components/ui/Icons";

import styles from "@/app/page.module.css";

export default function NotebookEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    notebooks,
    updateNotebookInfo,
    deleteNotebook,
    addBlock,
    toggleTask,
    updateBlock,
    deleteBlock,
    moveBlock,
  } = useNotebookContext();
  const { showToast } = useToast();
  const { actionConfirmation } = useAccessibility();

  const endOfListRef = useRef<HTMLDivElement>(null);

  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  const activeNotebook = notebooks.find((n) => n.id === id);
  const isTodoList = activeNotebook?.type === "todo"; 

  const [notebookTitle, setNotebookTitle] = useState(
    activeNotebook?.title || "",
  );
  const [notebookDescription, setNotebookDescription] = useState(
    activeNotebook?.description || "",
  );

  useEffect(() => {
    if (activeNotebook && !localStorage.getItem("@SeniorEase:tour:editor")) {
      setIsTourOpen(true);
      localStorage.setItem("@SeniorEase:tour:editor", "true");
    }
  }, [activeNotebook]);

  if (!activeNotebook) {
    return <p className={styles.emptyState}>Documento não encontrado...</p>;
  }

  const activeBlocks = activeNotebook.blocks.filter((b) => !b.isDeleted);
  const hasHeading = activeBlocks.some((b) => b.type === "heading");

  const editorSteps: TourStep[] = [
    {
      targetId: "tour-help-btn",
      title: "1. Precisa de Ajuda?",
      description: "Sempre que se esquecer de como usar, clique aqui.",
    },
    {
      targetId: "tour-editor-actions",
      title: "2. Editar e Apagar",
      description: "Você pode modificar o Nome ou apagá-lo inteiro.",
    },
    ...(activeBlocks.length > 0
      ? [
          {
            targetId: "tour-first-block-actions",
            title: "3. Ações no Item",
            description: (
              <div className={styles.flexColGap8}>
                <span>Em cada item criado, você tem botões mágicos ao lado:</span>
                <span className={styles.textBaseBody}>
                  <MicIcon /> <strong>Microfone:</strong> Fale e o sistema escreve por si.
                </span>
                <span className={styles.textBaseBody}>
                  <TrashIcon /> <strong>Lixeira:</strong> Apaga apenas este item.
                </span>
              </div>
            )
          },
        ]
      : []),
    {
      targetId: "tour-editor-add",
      title: isTodoList ? "Nova Tarefa" : "Adicionar Mais",
      description: isTodoList 
        ? "Clique no botão gigante abaixo para adicionar as suas tarefas uma a uma."
        : "Use esta barra para adicionar Anotações, Tarefas e Lembretes ao seu caderno.",
    },
  ];

  const handleOpenEditModal = () => {
    if (activeNotebook) {
      setNotebookTitle(activeNotebook.title);
      setNotebookDescription(activeNotebook.description || "");
      setIsEditModalOpen(true);
    }
  };

  const handleConfirmEdit = async () => {
    await updateNotebookInfo(activeNotebook.id, notebookTitle, notebookDescription);
    setIsEditModalOpen(false);
    showToast("Salvo com sucesso!", "success");
  };

  const executeNotebookDelete = async () => {
    await deleteNotebook(activeNotebook.id);
    showToast(`${isTodoList ? 'Lista movida' : 'Caderno movido'} para a lixeira.`, "info");
    router.push("/");
  };

  const executeBlockDelete = async () => {
    if (blockToDelete) {
      await deleteBlock(activeNotebook.id, blockToDelete);
      setBlockToDelete(null);
      showToast("Item apagado.", "info");
    }
  };

  const handleAddBlock = async (
    type: "heading" | "paragraph" | "task" | "meeting" | "reminder",
    initialData: Record<string, unknown>,
    toastMessage: string,
  ) => {
    if (type === "reminder" || type === "meeting") {
      await NotificationService.requestPermission();
    }

    addBlock(activeNotebook.id, { type, ...initialData });
    showToast(toastMessage, "success");

    setTimeout(() => {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const compiledTextToRead = activeBlocks
    .map((b) => {
      if (b.type === "heading" && b.content.trim() !== "") return `Título da secção: ${b.content}`;
      if (b.type === "paragraph" && b.content.trim() !== "") return `Anotação: ${b.content}`;
      if (b.type === "task" && b.content.trim() !== "") return `Tarefa ${b.isCompleted ? "concluída" : "pendente"}: ${b.content}`;
      if (b.type === "meeting" && b.title.trim() !== "") return `Reunião: ${b.title}`;
      if (b.type === "reminder" && (b.content?.trim() !== "" || b.date)) {
        const textoDescricao = b.content?.trim() ? b.content : "Sem assunto definido";
        const dataFormatada = b.date ? new Date(b.date).toLocaleString("pt-BR") : "Sem horário definido";
        return `Lembrete: ${textoDescricao}, agendado para: ${dataFormatada}`;
      }
      return "";
    }).filter(text => text !== "").join(". ");

  return (
    <main className={styles.main}>
      <div className={styles.editor}>
        <header className={`${styles.editorHeader} ${styles.editorHeaderWrap}`}>
          <div className={styles.flexColGap8}>
            <div className={styles.flexAlignCenter}>
              <button className={styles.backButton} onClick={() => router.push("/")}>
                <BackIcon /> Voltar
              </button>
              <button id="tour-help-btn" onClick={() => setIsTourOpen(true)} className={styles.btnPrimarySurface}>
                <HelpIcon /> Ajuda
              </button>

              {!isTodoList && (
                <button
                  className={`${styles.toggleReadingButton} ${isReadingMode ? styles.active : ""}`}
                  onClick={() => setIsReadingMode(!isReadingMode)}
                >
                  <div className={styles.iconText}>
                    <BookIcon /> {isReadingMode ? "Sair da Leitura" : "Modo Leitura"}
                  </div>
                </button>
              )}

              <button
                className={styles.toggleReadingButton}
                onClick={() => window.print()}
                aria-label="Imprimir para papel"
              >
                <div className={styles.iconText}>
                  <PrintIcon /> Imprimir
                </div>
              </button>

              {compiledTextToRead && (
                <ReadAloudButton
                  textToRead={`Nome ${isTodoList ? 'da Lista' : 'do Caderno'}: ${activeNotebook.title}. ${compiledTextToRead}`}
                />
              )}
            </div>

            <div className={styles.divider}>
              <div id="tour-editor-title" className={styles.headerTitleandDescriptionSection}>
                <h1 className={styles.editorTitle}>
                  {isTodoList && <span style={{ opacity: 0.5, marginRight: '8px' }}>Lista:</span>}
                  {activeNotebook.title}
                </h1>
                {activeNotebook.description && (
                  <p className={styles.editorDescription}>{activeNotebook.description}</p>
                )}
              </div>

              {!isReadingMode && (
                <div id="tour-editor-actions" className={styles.headerActions}>
                  <button className={styles.secondaryButton} onClick={handleOpenEditModal}>
                    <div className={styles.iconText}>
                      <EditIcon /> Editar Nome
                    </div>
                  </button>
                  <button className={styles.dangerButton} onClick={() => actionConfirmation === "on" ? setIsDeleteModalOpen(true) : executeNotebookDelete()}>
                    <div className={styles.iconText}>
                      <TrashIcon /> Apagar {isTodoList ? "Lista" : "Caderno"}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {isReadingMode ? (
          <article className={styles.readingContainer}>
            {activeBlocks.length === 0 ? (
              <p className={styles.readParagraph}>Sem conteúdo.</p>
            ) : (
              activeBlocks.map((block) => {
                switch (block.type) {
                  case "heading": return <h2 key={block.id} className={styles.readHeading}>{block.content}</h2>;
                  case "paragraph": return <p key={block.id} className={styles.readParagraph}>{block.content}</p>;
                  case "task":
                    return (
                      <div key={block.id} className={`${styles.readTask} ${block.isCompleted ? styles.completed : ""}`}>
                        <input type="checkbox" checked={block.isCompleted} readOnly className={styles.readCheckbox} aria-hidden="true" />
                        <span>{block.content}</span>
                      </div>
                    );
                  case "meeting":
                    return (
                      <div key={block.id} className={styles.readCard}>
                        <strong>Reunião: {block.title}</strong>
                        {block.meetingUrl && <a href={block.meetingUrl} target="_blank" rel="noopener noreferrer">Acessar link da reunião</a>}
                      </div>
                    );
                  case "reminder":
                    return (
                      <div key={block.id} className={styles.readCard}>
                        <strong>Lembrete: {block.content}</strong>
                        {block.date && <span>Data: {new Date(block.date).toLocaleString("pt-BR")}</span>}
                      </div>
                    );
                  default: return null;
                }
              })
            )}
          </article>
        ) : (
          <section>
            {activeBlocks.length === 0 ? (
              <p className={styles.emptyState}>
                A sua {isTodoList ? "lista" : "caderno"} está {isTodoList ? "vazia" : "vazio"}. Comece a adicionar conteúdo abaixo!
              </p>
            ) : (
              activeBlocks.map((block, index) => {
                const isFirstBlock = index === 0;
                const disableUp = index === 0;
                const disableDown = index === activeBlocks.length - 1;

                const blockContent = (() => {
                  switch (block.type) {
                    case "heading":
                      return <HeadingBlockUI block={block} isFirst={isFirstBlock} disableUp={disableUp} disableDown={disableDown} onMoveUp={() => moveBlock(activeNotebook.id, block.id, 'up')} onMoveDown={() => moveBlock(activeNotebook.id, block.id, 'down')} onDelete={(id) => actionConfirmation === "on" ? setBlockToDelete(id) : deleteBlock(activeNotebook.id, id)} onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} />;
                    case "task":
                      return <TaskBlockUI block={block} isFirst={isFirstBlock} disableUp={disableUp} disableDown={disableDown} onMoveUp={() => moveBlock(activeNotebook.id, block.id, 'up')} onMoveDown={() => moveBlock(activeNotebook.id, block.id, 'down')} onDelete={(id) => actionConfirmation === "on" ? setBlockToDelete(id) : deleteBlock(activeNotebook.id, id)} onToggle={async (id) => { await toggleTask(activeNotebook.id, id); if (!block.isCompleted) showToast("Parabéns concluído com sucesso!", "success"); }} onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} />;
                    case "paragraph":
                      return <ParagraphBlockUI block={block} isFirst={isFirstBlock} disableUp={disableUp} disableDown={disableDown} onMoveUp={() => moveBlock(activeNotebook.id, block.id, 'up')} onMoveDown={() => moveBlock(activeNotebook.id, block.id, 'down')} onDelete={(id) => actionConfirmation === "on" ? setBlockToDelete(id) : deleteBlock(activeNotebook.id, id)} onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} />;
                    case "meeting":
                      return <MeetingBlockUI block={block} isFirst={isFirstBlock} disableUp={disableUp} disableDown={disableDown} onMoveUp={() => moveBlock(activeNotebook.id, block.id, 'up')} onMoveDown={() => moveBlock(activeNotebook.id, block.id, 'down')} onDelete={(id) => actionConfirmation === "on" ? setBlockToDelete(id) : deleteBlock(activeNotebook.id, id)} onChangeContent={(id, title, url, date) => updateBlock(activeNotebook.id, id, { title, meetingUrl: url, date })} />;
                    case "reminder":
                      return <ReminderBlockUI block={block} isFirst={isFirstBlock} disableUp={disableUp} disableDown={disableDown} onMoveUp={() => moveBlock(activeNotebook.id, block.id, 'up')} onMoveDown={() => moveBlock(activeNotebook.id, block.id, 'down')} onDelete={(id) => actionConfirmation === "on" ? setBlockToDelete(id) : deleteBlock(activeNotebook.id, id)} onChangeContent={(id, content, date) => updateBlock(activeNotebook.id, id, { content, date })} />;
                    default: return null;
                  }
                })();

                {/* NOVO: Div Wrapper com a classe 'advanced-block-container' */}
                return <div key={block.id} className="advanced-block-container" style={{ width: "100%", padding: "4px" }}>{blockContent}</div>;
              })
            )}
            <div ref={endOfListRef} aria-hidden="true" />
          </section>
        )}
      </div>

      {!isReadingMode && (
        <nav id="tour-editor-add" className={styles.bottomBar}>
          {isTodoList ? (
            <button
              className={styles.btnPrimarySurface}
              style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "1.2rem" }}
              onClick={() => handleAddBlock("task", { content: "", isCompleted: false }, "Nova Tarefa criada")}
            >
              <TaskIcon /> Adicionar Nova Tarefa
            </button>
          ) : (
            <>
              {!hasHeading && (
                <button className={styles.actionButton} onClick={() => handleAddBlock("heading", { content: "" }, "Novo Título criado")}>
                  <TitleIcon /> Título
                </button>
              )}
              <button className={styles.actionButton} onClick={() => handleAddBlock("paragraph", { content: "" }, "Nova Anotação criada")}>
                <WriteIcon /> Anotação
              </button>
              <button className={styles.actionButton} onClick={() => handleAddBlock("task", { content: "", isCompleted: false }, "Nova Tarefa criada")}>
                <TaskIcon /> Tarefa
              </button>
              <button className={styles.actionButton} onClick={() => handleAddBlock("reminder", { content: "", date: "" }, "Novo Lembrete criado")}>
                <ClockIcon /> Lembrete
              </button>
              <button className={styles.actionButton} onClick={() => handleAddBlock("meeting", { title: "", meetingUrl: "", date: "" }, "Nova Reunião criada")}>
                <VideoIcon /> Reunião
              </button>
            </>
          )}

        </nav>
      )}

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Editar ${isTodoList ? 'Lista' : 'Caderno'}`}>
        <div className={styles.modalContent}>
          <Input label="Nome" value={notebookTitle} onChange={(e) => setNotebookTitle(e.target.value)} onDictate={(text) => setNotebookTitle((prev) => (prev ? `${prev} ${text}` : text))} onEmoji={(emoji) => setNotebookTitle((prev) => (prev ? `${prev} ${emoji}` : emoji))} />
          <Input label="Descrição (Opcional)" value={notebookDescription} onChange={(e) => setNotebookDescription(e.target.value)} onDictate={(text) => setNotebookDescription((prev) => prev ? `${prev} ${text}` : text)} onKeyDown={(e) => { if (e.key === "Enter") handleConfirmEdit(); }} onEmoji={(emoji) => setNotebookDescription((prev) => (prev ? `${prev} ${emoji}` : emoji))} />
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleConfirmEdit} disabled={!notebookTitle.trim()}>Salvar Alterações</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title={`Apagar ${isTodoList ? 'Lista' : 'Caderno'}`}>
        <div className={styles.modalContent}>
          <p className={styles.textBaseHeading}>Tem certeza que deseja apagar <strong>{activeNotebook.title}</strong>? O ficheiro será enviado para a lixeira.</p>
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={executeNotebookDelete}>Sim, Apagar</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!blockToDelete} onClose={() => setBlockToDelete(null)} title="Apagar Item">
        <div className={styles.modalContent}>
          <p className={styles.textBaseHeading}>Tem certeza que deseja apagar este item? Ele será enviado para a lixeira.</p>
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setBlockToDelete(null)}>Cancelar</Button>
            <Button variant="danger" onClick={executeBlockDelete}>Sim, Apagar</Button>
          </div>
        </div>
      </Modal>

      <OnboardingTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} steps={editorSteps} />

      <CommandPalette />
    </main>
  );
}