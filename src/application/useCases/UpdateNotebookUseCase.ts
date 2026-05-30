import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class UpdateNotebookUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(id: string, title: string, description: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(id);
    if (!notebook) throw new Error("Caderno não encontrado.");

    notebook.title = title;
    notebook.description = description;
    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}
