import { ContentBlock } from './Block';

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  blocks: ContentBlock[];
  isDeleted?: boolean; // <-- NOVO: Indica se está na Lixeira
  createdAt: Date;
  updatedAt: Date;
}