import { INotebookRepository } from '../../domain/repositories/INotebookRepository';

export class DeleteNotebookUseCase {
  constructor(private readonly notebookRepository: INotebookRepository) {}

  async execute(id: string): Promise<void> {
    await this.notebookRepository.delete(id);
  }
}