// src/domain/repositories/INotebookRepository.ts
import { Notebook } from '../entities/Notebook';

export interface INotebookRepository {
  getAll(): Promise<Notebook[]>;
  getById(id: string): Promise<Notebook | null>;
  save(notebook: Notebook): Promise<void>;
  delete(id: string): Promise<void>;
}