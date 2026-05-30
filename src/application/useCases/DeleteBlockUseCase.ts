import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class DeleteBlockUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(notebookId: string, blockId: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);
    if (!notebook) throw new Error("Caderno não encontrado.");

    const block = notebook.blocks.find((b) => b.id === blockId);
    if (!block) throw new Error("Bloco não encontrado.");

    // Soft Delete do bloco
    block.isDeleted = true;
    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}
