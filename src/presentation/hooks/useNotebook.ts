// src/presentation/hooks/useNotebook.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Notebook } from '../../domain/entities/Notebook';
import { ContentBlock } from '../../domain/entities/Block';
import { LocalStorageNotebookRepository } from '../../infrastructure/repositories/LocalStorageNotebookRepository';

import { CreateNotebookUseCase } from '../../application/useCases/CreateNotebookUseCase';
import { AddBlockUseCase, CreateBlockDTO } from '../../application/useCases/AddBlockUseCase';
import { ToggleTaskUseCase } from '../../application/useCases/ToggleTaskUseCase';
import { UpdateBlockUseCase } from '../../application/useCases/UpdateBlockUseCase';
import { DeleteBlockUseCase } from '../../application/useCases/DeleteBlockUseCase';

export const useNotebook = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Instanciando as dependências
  const repository = useMemo(() => new LocalStorageNotebookRepository(), []);
  const createNotebookUseCase = useMemo(() => new CreateNotebookUseCase(repository), [repository]);
  const addBlockUseCase = useMemo(() => new AddBlockUseCase(repository), [repository]);
  const toggleTaskUseCase = useMemo(() => new ToggleTaskUseCase(repository), [repository]);
  const updateBlockUseCase = useMemo(() => new UpdateBlockUseCase(repository), [repository]);
  const deleteBlockUseCase = useMemo(() => new DeleteBlockUseCase(repository), [repository]);

  const fetchNotebooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await repository.getAll();
      setNotebooks(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os cadernos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  const createNotebook = async (title: string) => {
    try {
      await createNotebookUseCase.execute(title);
      await fetchNotebooks();
    } catch (err) { if (err instanceof Error) setError(err.message); }
  };

  const addBlock = async (notebookId: string, blockData: CreateBlockDTO) => {
    try {
      await addBlockUseCase.execute(notebookId, blockData);
      await fetchNotebooks();
    } catch (err) { if (err instanceof Error) setError(err.message); }
  };

  const toggleTask = async (notebookId: string, blockId: string) => {
    try {
      await toggleTaskUseCase.execute(notebookId, blockId);
      await fetchNotebooks();
    } catch (err) { if (err instanceof Error) setError(err.message); }
  };

  // AS DUAS NOVAS FUNÇÕES:
  const updateBlock = async (notebookId: string, blockId: string, updatedData: Partial<ContentBlock>) => {
    try {
      await updateBlockUseCase.execute(notebookId, blockId, updatedData);
      await fetchNotebooks();
    } catch (err) { if (err instanceof Error) setError(err.message); }
  };

  const deleteBlock = async (notebookId: string, blockId: string) => {
    try {
      await deleteBlockUseCase.execute(notebookId, blockId);
      await fetchNotebooks();
    } catch (err) { if (err instanceof Error) setError(err.message); }
  };

  return {
    notebooks,
    isLoading,
    error,
    createNotebook,
    addBlock,
    toggleTask,
    updateBlock,
    deleteBlock,
    refresh: fetchNotebooks
  };
};