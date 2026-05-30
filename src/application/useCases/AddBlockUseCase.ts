// src/application/useCases/AddBlockUseCase.ts
import { ContentBlock } from "../../domain/entities/Block";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

// Usamos Omit para criar o bloco sem precisar passar um ID (o Use Case gera o ID)
export type CreateBlockDTO = Omit<ContentBlock, "id">;

export class AddBlockUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(notebookId: string, blockData: CreateBlockDTO): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);

    if (!notebook) {
      throw new Error(`Caderno com ID ${notebookId} não encontrado.`);
    }

    const newBlock: ContentBlock = {
      ...blockData,
      id: crypto.randomUUID(),
    } as ContentBlock; // O Type Assertion aqui é seguro pois o DTO garante a estrutura

    notebook.blocks.push(newBlock);
    notebook.updatedAt = new Date();

    await this.notebookRepository.save(notebook);
  }
}
