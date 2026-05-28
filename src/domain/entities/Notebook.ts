// src/domain/entities/Notebook.ts
import { ContentBlock } from './Block';

export interface Notebook {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  blocks: ContentBlock[];
}