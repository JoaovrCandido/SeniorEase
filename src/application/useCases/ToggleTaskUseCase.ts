// src/application/useCases/ToggleTaskUseCase.ts
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class ToggleTaskUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(notebookId: string, blockId: string): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);

    if (!notebook) {
      throw new Error("Caderno não encontrado.");
    }

    const blockIndex = notebook.blocks.findIndex((b) => b.id === blockId);

    if (blockIndex === -1) {
      throw new Error("Bloco não encontrado no caderno.");
    }

    const block = notebook.blocks[blockIndex];

    if (block.type !== "task") {
      throw new Error('Apenas blocos do tipo "task" podem ser alternados.');
    }

    // Inverte o estado atual da tarefa
    block.isCompleted = !block.isCompleted;
    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}
