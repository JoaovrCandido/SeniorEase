import { INotebookRepository } from '../../domain/repositories/INotebookRepository';
import { Notebook } from '../../domain/entities/Notebook';

export class CreateNotebookUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  // Agora aceita a descrição
  async execute(title: string, description: string = ''): Promise<void> {
    const newNotebook: Notebook = {
      id: crypto.randomUUID(),
      title,
      description,
      blocks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.notebookRepository.save(newNotebook);
  }
}