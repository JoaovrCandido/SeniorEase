// src/presentation/components/ui/CommandPalette.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommandPalette } from './CommandPalette';

const mockPush = vi.fn();

// Mock do Router do Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock dos Cadernos
vi.mock('../../store/NotebookContext', () => ({
  useNotebookContext: () => ({
    notebooks: [
      { id: '1', title: 'Diário Pessoal', type: 'notebook' },
      { id: '2', title: 'Compras de Casa', type: 'todo' },
    ],
  }),
}));

// Mock inicial para Modo Avançado (para o atalho funcionar)
vi.mock('../../store/AccessibilityContext', () => ({
  useAccessibility: () => ({ navigationMode: 'advanced' }),
}));

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve abrir o modal ao pressionar Ctrl+K e focar na pesquisa', async () => {
    render(<CommandPalette />);

    // Modal começa fechado
    expect(screen.queryByPlaceholderText('Buscar cadernos ou listas...')).not.toBeInTheDocument();

    // Dispara o Ctrl + K na janela
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    // O modal deve estar aberto
    const input = screen.getByPlaceholderText('Buscar cadernos ou listas...');
    expect(input).toBeInTheDocument();
  });

  it('deve filtrar resultados e navegar ao clicar Enter', () => {
    render(<CommandPalette />);
    
    // Abre o modal
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    
    const input = screen.getByPlaceholderText('Buscar cadernos ou listas...');
    
    // Pesquisa por "Compras"
    fireEvent.change(input, { target: { value: 'Compras' } });

    // "Compras de Casa" deve aparecer, "Diário Pessoal" deve sumir
    expect(screen.getByText('Compras de Casa')).toBeInTheDocument();
    expect(screen.queryByText('Diário Pessoal')).not.toBeInTheDocument();

    // Pressiona Enter para abrir
    fireEvent.keyDown(input, { key: 'Enter' });

    // Verifica se navegou para a página certa
    expect(mockPush).toHaveBeenCalledWith('/notebook/2');
  });
});