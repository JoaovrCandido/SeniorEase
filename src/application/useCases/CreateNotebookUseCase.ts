// src/application/useCases/CreateNotebookUseCase.ts
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";
import { Notebook, NotebookType } from "../../domain/entities/Notebook";

export class CreateNotebookUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(
    title: string, 
    description: string = "", 
    type: NotebookType = "notebook" // <-- NOVO: Padrão é caderno
  ): Promise<void> {
    const newNotebook: Notebook = {
      id: crypto.randomUUID(),
      title,
      description,
      type, // <-- NOVO
      blocks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.notebookRepository.save(newNotebook);
  }
}