// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { useNotebook } from '@/presentation/hooks/useNotebook';
import { useNotifications } from '@/presentation/hooks/useNotifications';
import { useToast } from '@/presentation/store/ToastContext';

// Importação das Entidades (para Tipagem Segura)
import { ContentBlock } from '@/domain/entities/Block';

// Importação dos Componentes de Bloco
import { TaskBlockUI } from '@/presentation/components/blocks/TaskBlockUI';
import { HeadingBlockUI } from '@/presentation/components/blocks/HeadingBlockUI';
import { ParagraphBlockUI } from '@/presentation/components/blocks/ParagraphBlockUI';
import { MeetingBlockUI } from '@/presentation/components/blocks/MeetingBlockUI';
import { ReminderBlockUI } from '@/presentation/components/blocks/ReminderBlockUI';

// Importação dos Componentes de UI
import { AccessibilityPanel } from '@/presentation/components/ui/AccessibilityPanel';
import { Modal } from '@/presentation/components/ui/Modal';
import { Input } from '@/presentation/components/ui/Input';
import { Button } from '@/presentation/components/ui/Button';
import { ReadAloudButton } from '@/presentation/components/ui/ReadAloudButton';
import { NotificationService } from '@/infrastructure/services/NotificationService';

import styles from './page.module.css';

export default function Home() {
  const { 
    notebooks, deletedNotebooks, isLoading, 
    createNotebook, updateNotebookInfo, deleteNotebook, restoreNotebook,
    addBlock, toggleTask, updateBlock, deleteBlock, restoreBlock
  } = useNotebook();

  // Instancia as notificações e o sistema de avisos visuais
  useNotifications(notebooks);
  const { showToast } = useToast();

  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  
  // NOVO: Estado para abrir o Painel da Lixeira
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  // Estados dos Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  // Formulário de Caderno
  const [notebookTitle, setNotebookTitle] = useState('');
  const [notebookDescription, setNotebookDescription] = useState('');

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId);

  // --- Funções Auxiliares da Lixeira ---
  // Mapeia todos os blocos apagados dos cadernos ativos para a lista da Lixeira
  const deletedBlocksList = notebooks.flatMap(notebook => 
    notebook.blocks
      .filter(block => block.isDeleted)
      .map(block => ({ notebookId: notebook.id, notebookTitle: notebook.title, block }))
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
      case 'heading':
      case 'paragraph':
      case 'task':
        return block.content || 'Conteúdo vazio';
      default:
        return '';
    }
  };

  // --- Funções de Ação ---
  const openCreateModal = () => {
    setNotebookTitle('');
    setNotebookDescription('');
    setIsCreateModalOpen(true);
  };

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

  const closeNotebook = () => {
    setActiveNotebookId(null);
    setIsReadingMode(false);
  };


  // ==========================================
  // RENDERIZAÇÃO 1: PAINEL DA LIXEIRA
  // ==========================================
  if (isTrashOpen) {
    return (
      <main className={styles.main}>
        <div className={styles.dashboard}>
          <header className={styles.header} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button className={styles.a11yButton} onClick={() => setIsTrashOpen(false)}>← Voltar</button>
            <h1 className={styles.title}>Lixeira</h1>
          </header>

          <AccessibilityPanel />

          {deletedNotebooks.length === 0 && deletedBlocksList.length === 0 ? (
            <p className={styles.emptyState}>A sua lixeira está vazia.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              
              {/* Secção de Cadernos Apagados */}
              {deletedNotebooks.length > 0 && (
                <section>
                  <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '16px', color: 'var(--text-heading)' }}>Cadernos Apagados</h2>
                  <div className={styles.grid}>
                    {deletedNotebooks.map(notebook => (
                      <div key={notebook.id} className={styles.card} style={{ cursor: 'default', border: '2px solid var(--danger-main)', opacity: 0.9 }}>
                        <span className={styles.cardTitle}>{notebook.title}</span>
                        {notebook.description && <span className={styles.cardDescription}>{notebook.description}</span>}
                        <Button 
                          variant="primary" 
                          onClick={async () => {
                            await restoreNotebook(notebook.id);
                            showToast('Caderno restaurado com sucesso!', 'success');
                          }} 
                          style={{ marginTop: '16px' }}
                        >
                          ♻️ Restaurar Caderno
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Secção de Itens (Blocos) Apagados */}
              {deletedBlocksList.length > 0 && (
                <section>
                  <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '16px', color: 'var(--text-heading)' }}>Anotações e Tarefas Apagadas</h2>
                  <div className={styles.grid}>
                    {deletedBlocksList.map(({ notebookId, notebookTitle, block }) => (
                      <div key={block.id} className={styles.card} style={{ cursor: 'default', border: '2px dashed var(--text-body)', opacity: 0.9 }}>
                        <span className={styles.cardTitle} style={{ fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>
                          {getBlockTypeName(block.type)}
                        </span>
                        <span className={styles.cardDescription} style={{ fontStyle: 'italic', color: 'var(--primary-main)' }}>
                          Pertence ao caderno: {notebookTitle}
                        </span>
                        <span className={styles.cardDate} style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--text-heading)', marginTop: '8px' }}>
                          "{getBlockPreview(block)}"
                        </span>
                        <Button 
                          variant="primary" 
                          onClick={async () => {
                            await restoreBlock(notebookId, block.id);
                            showToast('Item restaurado para o caderno original!', 'success');
                          }} 
                          style={{ marginTop: '16px' }}
                        >
                          ♻️ Restaurar Item
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </div>
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
              <button className={styles.a11yButton} onClick={closeNotebook}>← Voltar</button>
              
              <div>
                <h1 className={styles.editorTitle}>{activeNotebook.title}</h1>
                {activeNotebook.description && (
                  <p className={styles.editorDescription}>{activeNotebook.description}</p>
                )}
              </div>

              {!isReadingMode && (
                <div className={styles.headerActions}>
                  <button className={styles.secondaryButton} onClick={openEditModal}>✏️ Editar Nome</button>
                  <button className={styles.dangerButton} onClick={() => setIsDeleteModalOpen(true)}>🗑️ Apagar Caderno</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px' }}>
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
          <nav className={styles.bottomBar} aria-label="Adicionar elementos" style={{ flexWrap: 'wrap' }}>
            {!hasHeading && <button className={styles.actionButton} onClick={() => { addBlock(activeNotebook.id, { type: 'heading', content: '' }); showToast('Título adicionado', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>📝</span> Título</button>}
            <button className={styles.actionButton} onClick={() => { addBlock(activeNotebook.id, { type: 'paragraph', content: '' }); showToast('Anotação adicionada', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>✍️</span> Anotação</button>
            <button className={styles.actionButton} onClick={() => { addBlock(activeNotebook.id, { type: 'task', content: '', isCompleted: false }); showToast('Tarefa adicionada', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>✅</span> Tarefa</button>
            <button className={styles.actionButton} onClick={async () => { await NotificationService.requestPermission(); addBlock(activeNotebook.id, { type: 'reminder', content: '', date: '' }); showToast('Lembrete adicionado', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>⏰</span> Lembrete</button>
            <button className={styles.actionButton} onClick={async () => { await NotificationService.requestPermission(); addBlock(activeNotebook.id, { type: 'meeting', title: '', meetingUrl: '', date: '' }); showToast('Reunião adicionada', 'success'); }}><span aria-hidden="true" style={{ fontSize: '24px' }}>🎥</span> Reunião</button>
          </nav>
        )}

        {/* Modal de Edição do Caderno */}
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

        {/* Modal de Exclusão do Caderno */}
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

        {/* Modal de Exclusão de BLOCO (Segurança adicional) */}
        <Modal isOpen={!!blockToDelete} onClose={() => setBlockToDelete(null)} title="Apagar Item">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-heading)' }}>
              Tem certeza que deseja apagar este item? Ele será enviado para a lixeira e desaparecerá deste caderno.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
              <Button variant="ghost" onClick={() => setBlockToDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmBlockDelete}>Sim, Apagar Item</Button>
            </div>
          </div>
        </Modal>

      </main>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO 3: MODO DASHBOARD (HOME)
  // ==========================================
  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        
        {/* Cabeçalho Atualizado com o Botão da Lixeira */}
        <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h1 className={styles.title}>Os meus Cadernos</h1>
          <button 
            onClick={() => setIsTrashOpen(true)}
            style={{ backgroundColor: 'transparent', border: '2px solid var(--text-body)', color: 'var(--text-heading)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🗑️ Acessar Lixeira
          </button>
        </header>

        <AccessibilityPanel />

        {isLoading ? (
          <p className={styles.emptyState}>A carregar os seus cadernos...</p>
        ) : (
          <div className={styles.grid}>
            <button className={styles.card} onClick={openCreateModal} style={{ borderStyle: 'dashed', backgroundColor: 'transparent' }}>
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

    </main>
  );
}