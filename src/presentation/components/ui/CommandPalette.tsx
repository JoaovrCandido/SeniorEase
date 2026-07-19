// src/presentation/components/ui/CommandPalette.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotebookContext } from "../../store/NotebookContext";
import { useAccessibility } from "../../store/AccessibilityContext";
import { BookIcon, TaskIcon } from "./Icons";
import styles from "./CommandPalette.module.css";

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { notebooks } = useNotebookContext();
  const { navigationMode } = useAccessibility();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // A Mágica de escutar o Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Só ativa o atalho se o Modo Avançado estiver ligado
      if (navigationMode !== "advanced") return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // Evita que o navegador abra a barra de pesquisa padrão
        setIsOpen((prev) => !prev);
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, navigationMode]);

  // Focar no campo de pesquisa sempre que o modal abre
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filtragem Instantânea
  const filteredNotebooks = notebooks.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reinicia o foco para o primeiro item quando a pesquisa muda
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelect = (id: string) => {
    setIsOpen(false);
    router.push(`/notebook/${id}`);
  };

  // Navegação com Setas do Teclado
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredNotebooks.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredNotebooks.length) % filteredNotebooks.length);
    } else if (e.key === "Enter" && filteredNotebooks.length > 0) {
      e.preventDefault();
      handleSelect(filteredNotebooks[selectedIndex].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.searchHeader}>
          {/* Ícone de Lupa Simples */}
          <svg className={styles.searchIcon} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
          </svg>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Buscar cadernos ou listas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <kbd className={styles.kbd}>ESC</kbd>
        </div>

        <div className={styles.resultsList}>
          {filteredNotebooks.length === 0 ? (
            <p className={styles.emptyState}>Nenhum resultado encontrado para "{searchQuery}"</p>
          ) : (
            filteredNotebooks.map((notebook, index) => (
              <button
                key={notebook.id}
                className={styles.resultItem}
                aria-selected={index === selectedIndex}
                onClick={() => handleSelect(notebook.id)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{ color: index === selectedIndex ? 'var(--primary-main)' : 'var(--text-body)' }}>
                  {notebook.type === "todo" ? <TaskIcon /> : <BookIcon />}
                </div>
                
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{notebook.title}</span>
                  {notebook.description && (
                    <span className={styles.itemDescription}>{notebook.description}</span>
                  )}
                </div>

                {index === selectedIndex && <kbd className={styles.kbd}>Enter</kbd>}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};