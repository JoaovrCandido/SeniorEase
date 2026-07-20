// src/application/useCases/DeleteNotebookUseCase.ts
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class DeleteNotebookUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(id: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(id);
    if (!notebook) throw new Error("Caderno não encontrado.");

    // Soft Delete: Apenas marca como apagado em vez de deletar de verdade
    notebook.isDeleted = true;
    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}
