// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useNotebook } from '@/presentation/hooks/useNotebook';
import { useNotifications } from '@/presentation/hooks/useNotifications';
import { useToast } from '@/presentation/store/ToastContext';

// Importação das Entidades e Componentes
import { ContentBlock } from '@/domain/entities/Block';
import { TaskBlockUI } from '@/presentation/components/blocks/TaskBlockUI';
import { HeadingBlockUI } from '@/presentation/components/blocks/HeadingBlockUI';
import { ParagraphBlockUI } from '@/presentation/components/blocks/ParagraphBlockUI';
import { MeetingBlockUI } from '@/presentation/components/blocks/MeetingBlockUI';
import { ReminderBlockUI } from '@/presentation/components/blocks/ReminderBlockUI';

import { AccessibilityPanel } from '@/presentation/components/ui/AccessibilityPanel';
import { Modal } from '@/presentation/components/ui/Modal';
import { Input } from '@/presentation/components/ui/Input';
import { Button } from '@/presentation/components/ui/Button';
import { ReadAloudButton } from '@/presentation/components/ui/ReadAloudButton';
import { OnboardingTour, TourStep } from '@/presentation/components/ui/OnboardingTour';
import { NotificationService } from '@/infrastructure/services/NotificationService';

import styles from './page.module.css';

// ==========================================
// TEXTOS INSTRUTIVOS (OS TOURS)
// ==========================================
const DASHBOARD_STEPS: TourStep[] = [
  { targetId: 'tour-accessibility', title: '1. Conforto Visual', description: 'Antes de começarmos, use estes botões para ajustar o tamanho da letra e as cores da tela. Deixe tudo confortável para os seus olhos.' },
  { targetId: 'tour-create', title: '2. Criar Cadernos', description: 'Aqui você cria um novo caderno. Pense nele como uma pasta para guardar as suas tarefas, exames médicos, ou anotações pessoais.' },
  { targetId: 'tour-trash-btn', title: '3. Acessar Lixeira', description: 'Se apagar algo sem querer, não se preocupe. Clicando aqui você acessa a Lixeira, onde poderá recuperar tudo com segurança.' }
];

const EDITOR_STEPS: TourStep[] = [
  { targetId: 'tour-editor-title', title: '1. O Seu Caderno', description: 'Aqui estão o Nome e a Descrição do seu caderno. Eles ajudam a lembrar rapidamente do que se trata este espaço.' },
  { targetId: 'tour-editor-actions', title: '2. Editar e Apagar', description: 'Você pode clicar nestes botões para modificar o Nome ou a Descrição do caderno a qualquer momento, ou para apagá-lo inteiro se não precisar mais dele.' },
  { targetId: 'tour-editor-a11y', title: '3. Leitura e Áudio', description: 'Para ler sem distrações, ative o Modo Leitura. Se a vista cansar, clique no botão "Ouvir Caderno" e eu lerei tudo para você!' },
  { targetId: 'tour-editor-add', title: '4. Adicionar Conteúdo', description: 'Esta é a sua barra de ferramentas! Use-a para criar Títulos, escrever Anotações, registrar Tarefas que precisam ser feitas, e até agendar Lembretes e Reuniões que te avisarão na hora certa.' }
];

const TRASH_STEPS: TourStep[] = [
  { targetId: 'tour-trash-header', title: '1. Área de Segurança', description: 'Bem-vindo à Lixeira. Tudo o que você apaga vem para cá e fica guardado com segurança.' },
  { targetId: 'tour-trash-content', title: '2. Como Recuperar', description: 'Nesta área abaixo você verá todos os cadernos inteiros ou anotações individuais que foram apagados. Basta clicar no botão azul "♻️ Restaurar" ao lado do item, e ele voltará imediatamente para o lugar de onde saiu!' }
];


export default function Home() {
  const { notebooks, deletedNotebooks, isLoading, createNotebook, updateNotebookInfo, deleteNotebook, restoreNotebook, addBlock, toggleTask, updateBlock, deleteBlock, restoreBlock } = useNotebook();

  useNotifications(notebooks);
  const { showToast } = useToast();

  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  
  // Estado que controla QUAL tour está aberto no momento
  const [currentTour, setCurrentTour] = useState<'dashboard' | 'editor' | 'trash' | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
  const [notebookTitle, setNotebookTitle] = useState('');
  const [notebookDescription, setNotebookDescription] = useState('');

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId);

  // ==========================================
  // DISPARADORES AUTOMÁTICOS DOS TOURS
  // ==========================================
  useEffect(() => {
    if (!isLoading && !localStorage.getItem('@SeniorEase:tour:dashboard')) {
      setCurrentTour('dashboard');
      localStorage.setItem('@SeniorEase:tour:dashboard', 'true');
    }
  }, [isLoading]);

  useEffect(() => {
    if (activeNotebookId && !localStorage.getItem('@SeniorEase:tour:editor')) {
      setCurrentTour('editor');
      localStorage.setItem('@SeniorEase:tour:editor', 'true');
    }
  }, [activeNotebookId]);

  useEffect(() => {
    if (isTrashOpen && !localStorage.getItem('@SeniorEase:tour:trash')) {
      setCurrentTour('trash');
      localStorage.setItem('@SeniorEase:tour:trash', 'true');
    }
  }, [isTrashOpen]);

  // ==========================================
  // FUNÇÕES AUXILIARES DA LIXEIRA
  // ==========================================
  const deletedBlocksList = notebooks.flatMap(notebook => 
    notebook.blocks.filter(block => block.isDeleted).map(block => ({ notebookId: notebook.id, notebookTitle: notebook.title, block }))
  );

  const getBlockTypeName = (type: string) => {
    switch (type) {
      case 'heading': return 'Título';
      case 'paragraph': return 'Anotação';
      case 'task': return 'Tarefa';
      case 'meeting': return 'Reunião';
      case 'reminder': return 'Lembrete';
      default: return 'Item';
    }
  };

  const getBlockPreview = (block: ContentBlock) => {
    switch (block.type) {
      case 'meeting': return block.title || 'Reunião sem assunto';
      case 'reminder': return block.content || 'Lembrete sem texto';
      case 'heading': case 'paragraph': case 'task': return block.content || 'Conteúdo vazio';
      default: return '';
    }
  };

  const openCreateModal = () => { setNotebookTitle(''); setNotebookDescription(''); setIsCreateModalOpen(true); };
  
  const handleConfirmCreate = async () => {
    if (notebookTitle.trim()) {
      await createNotebook(notebookTitle, notebookDescription);
      setIsCreateModalOpen(false);
      showToast('Caderno criado com sucesso!', 'success');
    }
  };

  const openEditModal = () => {
    if (activeNotebook) {
      setNotebookTitle(activeNotebook.title);
      setNotebookDescription(activeNotebook.description || '');
      setIsEditModalOpen(true);
    }
  };

  const handleConfirmEdit = async () => {
    if (activeNotebook && notebookTitle.trim()) {
      await updateNotebookInfo(activeNotebook.id, notebookTitle, notebookDescription);
      setIsEditModalOpen(false);
      showToast('Alterações salvas com sucesso!', 'success');
    }
  };

  const handleConfirmDelete = async () => {
    if (activeNotebook) {
      await deleteNotebook(activeNotebook.id);
      setIsDeleteModalOpen(false);
      setActiveNotebookId(null);
      showToast('Caderno movido para a lixeira.', 'info');
    }
  };

  const confirmBlockDelete = async () => {
    if (activeNotebookId && blockToDelete) {
      await deleteBlock(activeNotebookId, blockToDelete);
      setBlockToDelete(null);
      showToast('Item movido para a lixeira.', 'info');
    }
  };

  const closeNotebook = () => { setActiveNotebookId(null); setIsReadingMode(false); };


  // ==========================================
  // RENDERIZAÇÃO 1: PAINEL DA LIXEIRA
  // ==========================================
  if (isTrashOpen) {
    return (
      <main className={styles.main}>
        <div className={styles.dashboard}>
          <header id="tour-trash-header" className={styles.header} style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button className={styles.a11yButton} onClick={() => setIsTrashOpen(false)}>← Voltar</button>
              <h1 className={styles.title}>Lixeira</h1>
            </div>
            <button onClick={() => setCurrentTour('trash')} style={{ backgroundColor: 'var(--primary-surface)', border: 'none', color: 'var(--primary-main)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span aria-hidden="true" style={{ fontSize: '20px' }}>❓</span> Ajuda
            </button>
          </header>

          <AccessibilityPanel />

          <div id="tour-trash-content" style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '24px' }}>
            {deletedNotebooks.length === 0 && deletedBlocksList.length === 0 ? (
              <p className={styles.emptyState}>A sua lixeira está vazia.</p>
            ) : (
              <>
                {deletedNotebooks.length > 0 && (
                  <section>
                    <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '16px', color: 'var(--text-heading)' }}>Cadernos Apagados</h2>
                    <div className={styles.grid}>
                      {deletedNotebooks.map(notebook => (
                        <div key={notebook.id} className={styles.card} style={{ cursor: 'default', border: '2px solid var(--danger-main)', opacity: 0.9 }}>
                          <span className={styles.cardTitle}>{notebook.title}</span>
                          {notebook.description && <span className={styles.cardDescription}>{notebook.description}</span>}
                          <Button variant="primary" onClick={async () => { await restoreNotebook(notebook.id); showToast('Caderno restaurado com sucesso!', 'success'); }} style={{ marginTop: '16px' }}>
                            ♻️ Restaurar Caderno
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {deletedBlocksList.length > 0 && (
                  <section>
                    <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '16px', color: 'var(--text-heading)' }}>Anotações e Tarefas Apagadas</h2>
                    <div className={styles.grid}>
                      {deletedBlocksList.map(({ notebookId, notebookTitle, block }) => (
                        <div key={block.id} className={styles.card} style={{ cursor: 'default', border: '2px dashed var(--text-body)', opacity: 0.9 }}>
                          <span className={styles.cardTitle} style={{ fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>{getBlockTypeName(block.type)}</span>
                          <span className={styles.cardDescription} style={{ fontStyle: 'italic', color: 'var(--primary-main)' }}>Pertence ao caderno: {notebookTitle}</span>
                          <span className={styles.cardDate} style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--text-heading)', marginTop: '8px' }}>"{getBlockPreview(block)}"</span>
                          <Button variant="primary" onClick={async () => { await restoreBlock(notebookId, block.id); showToast('Item restaurado para o caderno original!', 'success'); }} style={{ marginTop: '16px' }}>
                            ♻️ Restaurar Item
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>

        <OnboardingTour isOpen={currentTour === 'trash'} onClose={() => setCurrentTour(null)} steps={TRASH_STEPS} />
      </main>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO 2: MODO EDITOR / LEITURA
  // ==========================================
  if (activeNotebookId && activeNotebook) {
    const hasHeading = activeNotebook.blocks.some((block) => block.type === 'heading' && !block.isDeleted);
    const activeBlocks = activeNotebook.blocks.filter((block) => !block.isDeleted);

    const compiledTextToRead = activeBlocks.map(b => {
      if (b.type === 'heading' && b.content.trim() !== '') return `Título da secção: ${b.content}`;
      if (b.type === 'paragraph' && b.content.trim() !== '') return `Anotação: ${b.content}`;
      if (b.type === 'task' && b.content.trim() !== '') return `Tarefa ${b.isCompleted ? 'concluída' : 'pendente'}: ${b.content}`;
      if (b.type === 'meeting' && b.title.trim() !== '') return `Reunião: ${b.title}`;
      if (b.type === 'reminder' && (b.content?.trim() !== '' || b.date)) {
        const textoDescricao = b.content?.trim() ? b.content : 'Sem assunto definido';
        const dataFormatada = b.date ? new Date(b.date).toLocaleString('pt-BR') : 'Sem horário definido';
        return `Lembrete: ${textoDescricao}, agendado para: ${dataFormatada}`;
      }
      return '';
    }).filter(text => text !== '').join('. ');

    return (
      <main className={styles.main}>
        <div className={styles.editor}>
          <header className={styles.editorHeader} style={{ flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className={styles.a11yButton} onClick={closeNotebook}>← Voltar</button>
                <button onClick={() => setCurrentTour('editor')} style={{ backgroundColor: 'var(--primary-surface)', border: 'none', color: 'var(--primary-main)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span aria-hidden="true" style={{ fontSize: '20px' }}>❓</span> Ajuda
                </button>
              </div>
              
              <div id="tour-editor-title" style={{ marginTop: '16px' }}>
                <h1 className={styles.editorTitle}>{activeNotebook.title}</h1>
                {activeNotebook.description && (
                  <p className={styles.editorDescription}>{activeNotebook.description}</p>
                )}
              </div>

              {!isReadingMode && (
                <div id="tour-editor-actions" className={styles.headerActions}>
                  <button className={styles.secondaryButton} onClick={openEditModal}>✏️ Editar Nome/Descrição</button>
                  <button className={styles.dangerButton} onClick={() => setIsDeleteModalOpen(true)}>🗑️ Apagar Caderno</button>
                </div>
              )}
            </div>

            <div id="tour-editor-a11y" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', padding: '8px' }}>
              <button className={`${styles.toggleReadingButton} ${isReadingMode ? styles.active : ''}`} onClick={() => setIsReadingMode(!isReadingMode)}>
                {isReadingMode ? '📖 Sair da Leitura' : '📖 Modo Leitura'}
              </button>
              {compiledTextToRead && (
                <ReadAloudButton textToRead={`Nome do Caderno: ${activeNotebook.title}. ${activeNotebook.description ? `Descrição: ${activeNotebook.description}.` : ''} ${compiledTextToRead}`} />
              )}
            </div>
          </header>

          {isReadingMode ? (
            <article className={styles.readingContainer}>
              {activeBlocks.length === 0 ? <p className={styles.readParagraph}>Este caderno está vazio.</p> : activeBlocks.map((block) => {
                  switch (block.type) {
                    case 'heading': return <h2 key={block.id} className={styles.readHeading}>{block.content}</h2>;
                    case 'paragraph': return <p key={block.id} className={styles.readParagraph}>{block.content}</p>;
                    case 'task': return <div key={block.id} className={`${styles.readTask} ${block.isCompleted ? styles.completed : ''}`}><input type="checkbox" checked={block.isCompleted} readOnly className={styles.readCheckbox} aria-hidden="true" /><span>{block.content}</span></div>;
                    case 'meeting': return <div key={block.id} className={styles.readCard}><strong>🎥 Reunião: {block.title}</strong>{block.meetingUrl && <a href={block.meetingUrl} target="_blank" rel="noopener noreferrer">Acessar link da reunião</a>}</div>;
                    case 'reminder': return <div key={block.id} className={styles.readCard}><strong>⏰ Lembrete: {block.content}</strong>{block.date && <span>Data: {new Date(block.date).toLocaleString('pt-BR')}</span>}</div>;
                    default: return null;
                  }
              })}
            </article>
          ) : (
            <section>
              {activeBlocks.length === 0 ? <p className={styles.emptyState}>O seu caderno está vazio. Comece a adicionar conteúdo na barra abaixo!</p> : activeBlocks.map((block) => {
                  switch (block.type) {
                    case 'heading': return <HeadingBlockUI key={block.id} block={block} onDelete={(id) => setBlockToDelete(id)} onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} />;
                    case 'task': return <TaskBlockUI key={block.id} block={block} onToggle={(id) => toggleTask(activeNotebook.id, id)} onDelete={(id) => setBlockToDelete(id)} onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} />;
                    case 'paragraph': return <ParagraphBlockUI key={block.id} block={block} onDelete={(id) => setBlockToDelete(id)} onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} />;
                    case 'meeting': return <MeetingBlockUI key={block.id} block={block} onDelete={(id) => setBlockToDelete(id)} onChangeContent={(id, title, meetingUrl, date) => updateBlock(activeNotebook.id, id, { title, meetingUrl, date })} />;
                    case 'reminder': return <ReminderBlockUI key={block.id} block={block} onDelete={(id) => setBlockToDelete(id)} onChangeContent={(id, content, date) => updateBlock(activeNotebook.id, id, { content, date })} />;
                    default: return null;
                  }
              })}
            </section>
          )}
        </div>

        {!isReadingMode && (
          <nav id="tour-editor-add" className={styles.bottomBar} aria-label="Adicionar elementos" style={{ flexWrap: 'wrap' }}>
            {!hasHeading && <button className={styles.actionButton} onClick={() => { addBlock(activeNotebook.id, { type: 'heading', content: '' }); showToast('Título adicionado', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>📝</span> Título</button>}
            <button className={styles.actionButton} onClick={() => { addBlock(activeNotebook.id, { type: 'paragraph', content: '' }); showToast('Anotação adicionada', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>✍️</span> Anotação</button>
            <button className={styles.actionButton} onClick={() => { addBlock(activeNotebook.id, { type: 'task', content: '', isCompleted: false }); showToast('Tarefa adicionada', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>✅</span> Tarefa</button>
            <button className={styles.actionButton} onClick={async () => { await NotificationService.requestPermission(); addBlock(activeNotebook.id, { type: 'reminder', content: '', date: '' }); showToast('Lembrete adicionado', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>⏰</span> Lembrete</button>
            <button className={styles.actionButton} onClick={async () => { await NotificationService.requestPermission(); addBlock(activeNotebook.id, { type: 'meeting', title: '', meetingUrl: '', date: '' }); showToast('Reunião adicionada', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>🎥</span> Reunião</button>
          </nav>
        )}

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Caderno">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <Input label="Nome do Caderno" value={notebookTitle} onChange={(e) => setNotebookTitle(e.target.value)} />
            <Input label="Descrição (Opcional)" value={notebookDescription} onChange={(e) => setNotebookDescription(e.target.value)} placeholder="Do que se trata este caderno?" onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmEdit(); }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={handleConfirmEdit} disabled={!notebookTitle.trim()}>Salvar Alterações</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Apagar Caderno">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-heading)' }}>
              Tem certeza que deseja apagar o caderno <strong>{activeNotebook.title}</strong>? Ele será enviado para a lixeira.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
              <Button variant="danger" onClick={handleConfirmDelete}>Sim, Apagar Caderno</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={!!blockToDelete} onClose={() => setBlockToDelete(null)} title="Apagar Item">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-heading)' }}>
              Tem certeza que deseja apagar este item? Ele será enviado para a lixeira.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
              <Button variant="ghost" onClick={() => setBlockToDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmBlockDelete}>Sim, Apagar Item</Button>
            </div>
          </div>
        </Modal>

        <OnboardingTour isOpen={currentTour === 'editor'} onClose={() => setCurrentTour(null)} steps={EDITOR_STEPS} />
      </main>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO 3: MODO DASHBOARD (HOME)
  // ==========================================
  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        
        <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h1 className={styles.title}>Os meus Cadernos</h1>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setCurrentTour('dashboard')}
              style={{ backgroundColor: 'var(--primary-surface)', border: 'none', color: 'var(--primary-main)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span aria-hidden="true" style={{ fontSize: '20px' }}>❓</span> Ajuda
            </button>
            
            <button 
              id="tour-trash-btn"
              onClick={() => setIsTrashOpen(true)}
              style={{ backgroundColor: 'transparent', border: '2px solid var(--text-body)', color: 'var(--text-heading)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🗑️ Acessar Lixeira
            </button>
          </div>
        </header>

        <div id="tour-accessibility">
          <AccessibilityPanel />
        </div>

        {isLoading ? (
          <p className={styles.emptyState}>A carregar os seus cadernos...</p>
        ) : (
          <div className={styles.grid}>
            <button id="tour-create" className={styles.card} onClick={openCreateModal} style={{ borderStyle: 'dashed', backgroundColor: 'transparent' }}>
              <span className={styles.cardTitle}>+ Criar Novo Caderno</span>
              <span className={styles.cardDate}>Clique aqui para começar um novo projeto ou aula.</span>
            </button>

            {notebooks.map((notebook) => (
              <button key={notebook.id} className={styles.card} onClick={() => setActiveNotebookId(notebook.id)}>
                <span className={styles.cardTitle}>{notebook.title}</span>
                {notebook.description && <span className={styles.cardDescription}>{notebook.description}</span>}
                <span className={styles.cardDate}>Última alteração: {notebook.updatedAt.toLocaleDateString('pt-BR')}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Criar Novo Caderno">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <Input label="Nome do Caderno" placeholder="Ex: Aula de Matemática, Reuniões..." value={notebookTitle} onChange={(e) => setNotebookTitle(e.target.value)} autoFocus />
          <Input label="Descrição (Opcional)" placeholder="Do que se trata este caderno?" value={notebookDescription} onChange={(e) => setNotebookDescription(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmCreate(); }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleConfirmCreate} disabled={!notebookTitle.trim()}>Criar Caderno</Button>
          </div>
        </div>
      </Modal>

      <OnboardingTour isOpen={currentTour === 'dashboard'} onClose={() => setCurrentTour(null)} steps={DASHBOARD_STEPS} />
    </main>
  );
}