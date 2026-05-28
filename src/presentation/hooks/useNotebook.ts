// src/presentation/hooks/useNotebook.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Notebook } from '../../domain/entities/Notebook';
import { LocalStorageNotebookRepository } from '../../infrastructure/repositories/LocalStorageNotebookRepository';
import { CreateNotebookUseCase } from '../../application/useCases/CreateNotebookUseCase';
import { AddBlockUseCase, CreateBlockDTO } from '../../application/useCases/AddBlockUseCase';
import { ToggleTaskUseCase } from '../../application/useCases/ToggleTaskUseCase';

export const useNotebook = () => {
  // 1. Gerenciamento de Estado do React
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Injeção de Dependência (Instanciando a Infra e os Casos de Uso apenas uma vez)
  const repository = useMemo(() => new LocalStorageNotebookRepository(), []);
  const createNotebookUseCase = useMemo(() => new CreateNotebookUseCase(repository), [repository]);
  const addBlockUseCase = useMemo(() => new AddBlockUseCase(repository), [repository]);
  const toggleTaskUseCase = useMemo(() => new ToggleTaskUseCase(repository), [repository]);

  // 3. Função auxiliar para buscar os dados e atualizar a tela
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

  // Carrega os dados assim que o Hook é montado na tela
  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  // 4. Métodos que serão expostos para os Componentes React usarem
  const createNotebook = async (title: string): Promise<void> => {
    try {
      await createNotebookUseCase.execute(title);
      await fetchNotebooks(); // Recarrega a lista para a UI atualizar
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const addBlock = async (notebookId: string, blockData: CreateBlockDTO): Promise<void> => {
    try {
      await addBlockUseCase.execute(notebookId, blockData);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const toggleTask = async (notebookId: string, blockId: string): Promise<void> => {
    try {
      await toggleTaskUseCase.execute(notebookId, blockId);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  // 5. Retorna o estado e as ações para a UI
  return {
    notebooks,
    isLoading,
    error,
    createNotebook,
    addBlock,
    toggleTask,
    refresh: fetchNotebooks // Caso a UI precise forçar uma atualização
  };
};