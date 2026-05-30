// src/infrastructure/repositories/LocalStorageNotebookRepository.ts
import { Notebook } from "../../domain/entities/Notebook";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

const STORAGE_KEY = "@SeniorEase:notebooks";

export class LocalStorageNotebookRepository implements INotebookRepository {
  async getAll(): Promise<Notebook[]> {
    // Proteção obrigatória no Next.js: garante que o localStorage só seja acessado no cliente (navegador)
    if (typeof window === "undefined") {
      return [];
    }

    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }

    try {
      const parsedData = JSON.parse(rawData) as Notebook[];

      // O JSON.stringify transforma datas em strings. Precisamos reidratá-las para objetos Date.
      return parsedData.map((notebook) => ({
        ...notebook,
        createdAt: new Date(notebook.createdAt),
        updatedAt: new Date(notebook.updatedAt),
      }));
    } catch (error) {
      console.error("Falha ao processar os dados do LocalStorage:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Notebook | null> {
    const notebooks = await this.getAll();
    const notebook = notebooks.find((n) => n.id === id);

    return notebook || null;
  }

  async save(notebook: Notebook): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const notebooks = await this.getAll();
    const existingIndex = notebooks.findIndex((n) => n.id === notebook.id);

    if (existingIndex >= 0) {
      // Atualiza o caderno existente
      notebooks[existingIndex] = notebook;
    } else {
      // Adiciona um novo caderno
      notebooks.push(notebook);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
  }

  async delete(id: string): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    // Chama o STORAGE_KEY diretamente, sem o "this."
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      // Tipagem segura sem uso de 'any'
      const notebooks = JSON.parse(data) as { id: string }[];
      // Filtra o array mantendo apenas os cadernos com ID diferente
      const filtered = notebooks.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  }
}
