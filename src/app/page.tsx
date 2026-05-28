// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { useNotebook } from '@/presentation/hooks/useNotebook';

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

import styles from './page.module.css';

export default function Home() {
  // 1. Instanciar o Hook do Domínio
  const { notebooks, isLoading, createNotebook, addBlock, toggleTask, updateBlock, deleteBlock } = useNotebook();

  // 2. Estados da Página
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  
  // Estados do Modal de Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');

  // 3. Funções Auxiliares de Navegação e Criação
  const handleOpenModal = () => {
    setNewNotebookTitle(''); // Limpa o campo sempre que abrir
    setIsModalOpen(true);
  };

  const handleConfirmCreate = async () => {
    if (newNotebookTitle.trim()) {
      await createNotebook(newNotebookTitle);
      setIsModalOpen(false); // Fecha o modal após criar
    }
  };

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId);

  // ==========================================
  // RENDERIZAÇÃO: MODO EDITOR (MICRO-NOTION)
  // ==========================================
  if (activeNotebookId && activeNotebook) {
    // REGRA DE NEGÓCIO: O caderno já possui um título principal?
    const hasHeading = activeNotebook.blocks.some((block) => block.type === 'heading');

    return (
      <main className={styles.main}>
        <div className={styles.editor}>
          <header className={styles.editorHeader}>
            <button 
              className={styles.a11yButton} 
              onClick={() => setActiveNotebookId(null)}
              aria-label="Voltar para a página inicial"
            >
              ← Voltar
            </button>
            <h1 className={styles.editorTitle}>{activeNotebook.title}</h1>
          </header>

          <section>
            {activeNotebook.blocks.length === 0 ? (
              <p className={styles.emptyState}>O seu caderno está vazio. Comece a adicionar conteúdo na barra abaixo!</p>
            ) : (
              activeNotebook.blocks.map((block) => {
                switch (block.type) {
                  case 'heading':
                    return (
                      <HeadingBlockUI 
                        key={block.id} 
                        block={block} 
                        onDelete={(id) => deleteBlock(activeNotebook.id, id)} 
                        onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} 
                      />
                    );
                  case 'task':
                    return (
                      <TaskBlockUI 
                        key={block.id} 
                        block={block} 
                        onToggle={(id) => toggleTask(activeNotebook.id, id)}
                        onDelete={(id) => deleteBlock(activeNotebook.id, id)} 
                        onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} 
                      />
                    );
                  case 'paragraph':
                    return (
                      <ParagraphBlockUI 
                        key={block.id} 
                        block={block} 
                        onDelete={(id) => deleteBlock(activeNotebook.id, id)} 
                        onChangeContent={(id, content) => updateBlock(activeNotebook.id, id, { content })} 
                      />
                    );
                  case 'meeting':
                    return (
                      <MeetingBlockUI 
                        key={block.id} 
                        block={block} 
                        onDelete={(id) => deleteBlock(activeNotebook.id, id)} 
                        onChangeContent={(id, title, url) => updateBlock(activeNotebook.id, id, { title, meetingUrl: url })} 
                      />
                    );
                  case 'reminder':
                    return (
                      <ReminderBlockUI 
                        key={block.id} 
                        block={block} 
                        onDelete={(id) => deleteBlock(activeNotebook.id, id)} 
                        onChangeContent={(id, date) => updateBlock(activeNotebook.id, id, { date })} 
                      />
                    );
                  default:
                    return null;
                }
              })
            )}
          </section>
        </div>

        {/* A Barra Mágica Fixa - Agora com os novos botões */}
        <nav className={styles.bottomBar} aria-label="Adicionar elementos" style={{ flexWrap: 'wrap' }}>
          
          {/* Oculta o botão de Título se já existir um Título */}
          {!hasHeading && (
            <button 
              className={styles.actionButton} 
              onClick={() => addBlock(activeNotebook.id, { type: 'heading', content: '' })}
            >
              <span aria-hidden="true" style={{ fontSize: '24px' }}>📝</span> Título
            </button>
          )}

          <button 
            className={styles.actionButton} 
            onClick={() => addBlock(activeNotebook.id, { type: 'paragraph', content: '' })}
          >
            <span aria-hidden="true" style={{ fontSize: '24px' }}>✍️</span> Anotação
          </button>
          
          <button 
            className={styles.actionButton} 
            onClick={() => addBlock(activeNotebook.id, { type: 'task', content: '', isCompleted: false })}
          >
            <span aria-hidden="true" style={{ fontSize: '24px' }}>✅</span> Tarefa
          </button>

          <button 
            className={styles.actionButton} 
            onClick={() => addBlock(activeNotebook.id, { type: 'reminder', date: '' })}
          >
            <span aria-hidden="true" style={{ fontSize: '24px' }}>⏰</span> Lembrete
          </button>

          <button 
            className={styles.actionButton} 
            onClick={() => addBlock(activeNotebook.id, { type: 'meeting', title: '', meetingUrl: '' })}
          >
            <span aria-hidden="true" style={{ fontSize: '24px' }}>🎥</span> Reunião
          </button>
        </nav>
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

        {/* Painel de Acessibilidade isolado e no topo */}
        <AccessibilityPanel />

        {isLoading ? (
          <p className={styles.emptyState}>A carregar os seus cadernos...</p>
        ) : (
          <div className={styles.grid}>
            {/* O Cartão agora abre o nosso Modal Customizado */}
            <button 
              className={styles.card} 
              onClick={handleOpenModal} 
              style={{ borderStyle: 'dashed', backgroundColor: 'transparent' }}
            >
              <span className={styles.cardTitle}>+ Criar Novo Caderno</span>
              <span className={styles.cardDate}>Clique aqui para começar um novo projeto ou aula.</span>
            </button>

            {/* Listagem dos Cadernos Salvos */}
            {notebooks.map((notebook) => (
              <button 
                key={notebook.id} 
                className={styles.card}
                onClick={() => setActiveNotebookId(notebook.id)}
              >
                <span className={styles.cardTitle}>{notebook.title}</span>
                <span className={styles.cardDate}>
                  Última alteração: {notebook.updatedAt.toLocaleDateString('pt-BR')}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RENDERIZAÇÃO DO MODAL DE CRIAÇÃO */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Criar Novo Caderno"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <Input 
            label="Nome do Caderno" 
            placeholder="Ex: Aula de Matemática, Reuniões..."
            value={newNotebookTitle}
            onChange={(e) => setNewNotebookTitle(e.target.value)}
            // Permite criar ao apertar "Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmCreate();
            }}
            autoFocus 
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirmCreate} disabled={!newNotebookTitle.trim()}>
              Criar Caderno
            </Button>
          </div>
        </div>
      </Modal>

    </main>
  );
}