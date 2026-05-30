import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class RestoreNotebookUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(id: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(id);
    if (!notebook) throw new Error("Caderno não encontrado.");

    notebook.isDeleted = false;
    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}
