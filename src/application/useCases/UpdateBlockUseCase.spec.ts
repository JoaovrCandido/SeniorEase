// src/application/useCases/UpdateBlockUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateBlockUseCase } from './UpdateBlockUseCase';
import { INotebookRepository } from '../../domain/repositories/INotebookRepository';
import { Notebook } from '../../domain/entities/Notebook';

describe('UpdateBlockUseCase', () => {
  let mockRepository: INotebookRepository;
  let useCase: UpdateBlockUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: 'nb-1',
      title: 'Diário',
      type: 'notebook',
      blocks: [
        { id: 'block-1', type: 'paragraph', content: 'Texto antigo', isDeleted: false }
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

    useCase = new UpdateBlockUseCase(mockRepository);
  });

  it('deve fundir (merge) os dados antigos com os novos dados recebidos', async () => {
    await useCase.execute('nb-1', 'block-1', { content: 'Texto novo atualizado' });

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    
    const updatedBlock = savedNotebook.blocks[0];
    expect(updatedBlock.content).toBe('Texto novo atualizado');
    expect(updatedBlock.type).toBe('paragraph');
  });

  it('deve lançar erro se o caderno ou bloco não existirem', async () => {
    // 1. Simular erro de CADERNO INEXISTENTE: Forçamos o mock a devolver nulo
    mockRepository.getById = vi.fn().mockResolvedValue(null);
    
    await expect(
      useCase.execute('nb-falso', 'block-1', { content: 'novo' })
    ).rejects.toThrow('Caderno não encontrado.');


    // 2. Simular erro de BLOCO INEXISTENTE: Repomos o mock para devolver um caderno válido
    mockRepository.getById = vi.fn().mockResolvedValue(mockNotebook);
    
    await expect(
      useCase.execute('nb-1', 'block-falso', { content: 'novo' })
    ).rejects.toThrow('Bloco não encontrado no caderno.');
  });
});