// src/application/useCases/UpdateBlockUseCase.ts
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";
import { ContentBlock } from "../../domain/entities/Block";

export class UpdateBlockUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(
    notebookId: string,
    blockId: string,
    updatedData: Partial<ContentBlock>,
  ): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);

    if (!notebook) {
      throw new Error("Caderno não encontrado.");
    }

    const blockIndex = notebook.blocks.findIndex((b) => b.id === blockId);

    if (blockIndex === -1) {
      throw new Error("Bloco não encontrado no caderno.");
    }

    // Faz a fusão (merge) dos dados antigos do bloco com os novos dados digitados
    notebook.blocks[blockIndex] = {
      ...notebook.blocks[blockIndex],
      ...updatedData,
    } as ContentBlock;

    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}
