// src/application/useCases/ToggleTaskUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleTaskUseCase } from './ToggleTaskUseCase';
import { INotebookRepository } from '../../domain/repositories/INotebookRepository';
import { Notebook } from '../../domain/entities/Notebook';

describe('ToggleTaskUseCase', () => {
  let mockRepository: INotebookRepository;
  let useCase: ToggleTaskUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: 'nb-1',
      title: 'Lista de Remédios',
      type: 'todo',
      blocks: [
        { id: 'task-1', type: 'task', content: 'Tomar Aspirina', isCompleted: false, isDeleted: false },
        { id: 'heading-1', type: 'heading', content: 'Avisos', isDeleted: false }
      ],
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

    useCase = new ToggleTaskUseCase(mockRepository);
  });

  it('deve alternar a tarefa de incompleta (false) para completa (true)', async () => {
    await useCase.execute('nb-1', 'task-1');

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    // Como o 'task-1' é o primeiro bloco (índice 0)
    expect(savedNotebook.blocks[0].type).toBe('task');
    if (savedNotebook.blocks[0].type === 'task') {
      expect(savedNotebook.blocks[0].isCompleted).toBe(true);
    }
  });

  it('deve lançar erro se tentar alternar um bloco que NÃO é uma task (ex: heading)', async () => {
    await expect(
      useCase.execute('nb-1', 'heading-1')
    ).rejects.toThrow('Apenas blocos do tipo "task" podem ser alternados.');
    
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('deve lançar erro se o bloco não for encontrado', async () => {
    await expect(
      useCase.execute('nb-1', 'task-fantasma')
    ).rejects.toThrow('Bloco não encontrado no caderno.');
  });
});