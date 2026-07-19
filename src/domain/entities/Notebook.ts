// src/domain/entities/Notebook.ts
import { ContentBlock } from "./Block";

export type NotebookType = "notebook" | "todo"; // <-- NOVO

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  blocks: ContentBlock[];
  isDeleted?: boolean;
  type?: NotebookType; // <-- NOVO: Guarda o tipo do arquivo
  createdAt: Date;
  updatedAt: Date;
}
