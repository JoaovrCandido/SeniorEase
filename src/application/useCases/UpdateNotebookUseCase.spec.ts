// src/application/useCases/UpdateNotebookUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateNotebookUseCase } from './UpdateNotebookUseCase';
import { INotebookRepository } from '../../domain/repositories/INotebookRepository';
import { Notebook } from '../../domain/entities/Notebook';

describe('UpdateNotebookUseCase', () => {
  let mockRepository: INotebookRepository;
  let useCase: UpdateNotebookUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: 'nb-1',
      title: 'Título Antigo',
      description: 'Descrição Antiga',
      type: 'notebook',
      blocks: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository = {
      getAll: vi.fn(),
      getById: vi.fn().mockResolvedValue(mockNotebook),
      save: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new UpdateNotebookUseCase(mockRepository);
  });

  it('deve atualizar o título e a descrição do caderno', async () => {
    await useCase.execute('nb-1', 'Novo Título', 'Nova Descrição');

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    expect(savedNotebook.title).toBe('Novo Título');
    expect(savedNotebook.description).toBe('Nova Descrição');
    expect(savedNotebook.updatedAt.getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 1000);
  });
});