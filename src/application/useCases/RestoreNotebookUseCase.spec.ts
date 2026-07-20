// src/application/useCases/RestoreNotebookUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RestoreNotebookUseCase } from './RestoreNotebookUseCase';
import { INotebookRepository } from '../../domain/repositories/INotebookRepository';
import { Notebook } from '../../domain/entities/Notebook';

describe('RestoreNotebookUseCase', () => {
  let mockRepository: INotebookRepository;
  let useCase: RestoreNotebookUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: 'notebook-1',
      title: 'Caderno Apagado',
      type: 'notebook',
      blocks: [],
      isDeleted: true, // Começa na lixeira
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository = {
      getAll: vi.fn(),
      getById: vi.fn().mockResolvedValue(mockNotebook),
      save: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new RestoreNotebookUseCase(mockRepository);
  });

  it('deve restaurar um caderno (isDeleted = false) e atualizar a data', async () => {
    await useCase.execute('notebook-1');

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    expect(savedNotebook.isDeleted).toBe(false);
    expect(savedNotebook.updatedAt.getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 1000);
  });

  it('deve lançar erro se tentar restaurar um caderno inexistente', async () => {
    mockRepository.getById = vi.fn().mockResolvedValue(null);

    await expect(useCase.execute('id-falso')).rejects.toThrow('Caderno não encontrado.');
  });
});