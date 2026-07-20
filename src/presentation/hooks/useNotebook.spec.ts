// src/presentation/hooks/useNotebook.spec.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotebook } from './useNotebook';

// Como o repositório é exportado por "default" no sistema de módulos às vezes,
// ou por export nomeado, usamos esta estrutura segura.
const mockGetAll = vi.fn().mockResolvedValue([
  { id: '1', title: 'Ativo', isDeleted: false, blocks: [] },
  { id: '2', title: 'Lixeira', isDeleted: true, blocks: [] },
]);

// CORREÇÃO: Mock seguro da classe para aceitar 'new LocalStorageNotebookRepository()'
vi.mock('../../infrastructure/repositories/LocalStorageNotebookRepository', () => {
  return {
    LocalStorageNotebookRepository: vi.fn().mockImplementation(function () {
      return {
        getAll: mockGetAll,
        getById: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
      };
    }),
  };
});

describe('useNotebook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar e separar os cadernos ativos dos apagados', async () => {
    const { result } = renderHook(() => useNotebook());

    expect(result.current.isLoading).toBe(true);

    // Espera que a Promise do useEffect resolva
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    
    expect(result.current.notebooks.length).toBe(1);
    expect(result.current.notebooks[0].title).toBe('Ativo');

    expect(result.current.deletedNotebooks.length).toBe(1);
    expect(result.current.deletedNotebooks[0].title).toBe('Lixeira');
  });
});