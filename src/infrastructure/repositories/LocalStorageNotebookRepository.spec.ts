// src/infrastructure/repositories/LocalStorageNotebookRepository.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';
import { LocalStorageNotebookRepository } from './LocalStorageNotebookRepository';
import { Notebook } from '../../domain/entities/Notebook';

describe('LocalStorageNotebookRepository', () => {
  const repository = new LocalStorageNotebookRepository();
  const STORAGE_KEY = '@SeniorEase:notebooks';

  // Objeto base fortemente tipado para os testes
  const mockNotebook: Notebook = {
    id: '1',
    title: 'Receitas',
    description: 'Comida boa',
    type: 'notebook',
    blocks: [],
    isDeleted: false,
    createdAt: new Date('2026-07-20T10:00:00.000Z'),
    updatedAt: new Date('2026-07-20T10:00:00.000Z'),
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getAll', () => {
    it('deve retornar um array vazio se não houver dados guardados', async () => {
      const result = await repository.getAll();
      expect(result).toEqual([]);
    });

    it('deve retornar os cadernos e reidratar as datas (string para Date)', async () => {
      // Guardamos como o navegador guardaria (tudo em texto)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockNotebook]));

      const result = await repository.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      // Valida que o campo é um objeto Date real e não apenas texto
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].createdAt.toISOString()).toBe('2026-07-20T10:00:00.000Z');
    });

    it('deve retornar um array vazio e não quebrar a aplicação se o JSON for inválido', async () => {
      // Espião para o console.error para não poluir o terminal durante o teste
      const consoleSpy: MockInstance = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      localStorage.setItem(STORAGE_KEY, 'json { quebrado');

      const result = await repository.getAll();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });

    it('deve proteger contra execução no lado do servidor (SSR) quando window for undefined', async () => {
      // Simulamos o ambiente do servidor do Next.js
      vi.stubGlobal('window', undefined);
      
      const result = await repository.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('deve retornar o caderno correto se ele existir', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockNotebook]));

      const result = await repository.getById('1');

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Receitas');
    });

    it('deve retornar null se o caderno não for encontrado', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockNotebook]));

      const result = await repository.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('deve adicionar um novo caderno se o ID ainda não existir', async () => {
      await repository.save(mockNotebook);

      const storedData = localStorage.getItem(STORAGE_KEY);
      expect(storedData).not.toBeNull();

      if (storedData) {
        const parsed = JSON.parse(storedData) as Notebook[];
        expect(parsed).toHaveLength(1);
        expect(parsed[0].title).toBe('Receitas');
      }
    });

    it('deve atualizar o caderno existente se o ID já lá estiver', async () => {
      // Guardamos o original
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockNotebook]));

      // Criamos uma versão atualizada (estritamente tipada)
      const updatedNotebook: Notebook = {
        ...mockNotebook,
        title: 'Receitas da Avó',
      };

      await repository.save(updatedNotebook);

      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData) as Notebook[];
        expect(parsed).toHaveLength(1);
        expect(parsed[0].title).toBe('Receitas da Avó'); // Foi atualizado!
      }
    });
  });

  describe('delete', () => {
    it('deve remover corretamente o caderno pelo ID', async () => {
      const cadernoExtra: Notebook = {
        ...mockNotebook,
        id: '2',
        title: 'Lista de Compras',
      };

      // Guardamos 2 cadernos
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockNotebook, cadernoExtra]));

      // Apagamos o primeiro
      await repository.delete('1');

      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData) as Notebook[];
        expect(parsed).toHaveLength(1);
        expect(parsed[0].id).toBe('2'); // Sobrou apenas o segundo
      }
    });
  });
});