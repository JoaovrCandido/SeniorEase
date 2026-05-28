// src/application/useCases/CreateNotebookUseCase.ts
import { Notebook } from '../../domain/entities/Notebook';
import { INotebookRepository } from '../../domain/repositories/INotebookRepository';

export class CreateNotebookUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(title: string): Promise<Notebook> {
    if (!title.trim()) {
      throw new Error('O título do caderno não pode estar vazio.');
    }

    const newNotebook: Notebook = {
      id: crypto.randomUUID(), // API nativa do navegador para IDs únicos
      title: title.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      blocks: [], // Começa vazio
    };

    await this.notebookRepository.save(newNotebook);

    return newNotebook;
  }
}