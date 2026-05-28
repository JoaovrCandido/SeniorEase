import { ContentBlock } from './Block';

export interface Notebook {
  id: string;
  title: string;
  description?: string; // <-- NOVO CAMPO (Opcional)
  blocks: ContentBlock[];
  createdAt: Date;
  updatedAt: Date;
}