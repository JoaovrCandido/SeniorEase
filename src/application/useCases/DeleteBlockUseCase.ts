// src/application/useCases/DeleteBlockUseCase.ts
import { INotebookRepository } from '../../domain/repositories/INotebookRepository';

export class DeleteBlockUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(notebookId: string, blockId: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);

    if (!notebook) {
      throw new Error('Caderno não encontrado.');
    }

    // Remove o bloco filtrando o array para manter apenas os que têm um ID diferente
    notebook.blocks = notebook.blocks.filter(b => b.id !== blockId);
    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}