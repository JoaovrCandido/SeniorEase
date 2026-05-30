// src/presentation/hooks/useNotebook.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { Notebook } from "../../domain/entities/Notebook";
import { ContentBlock } from "../../domain/entities/Block";
import { LocalStorageNotebookRepository } from "../../infrastructure/repositories/LocalStorageNotebookRepository";

// Casos de Uso de Blocos
import {
  AddBlockUseCase,
  CreateBlockDTO,
} from "../../application/useCases/AddBlockUseCase";
import { ToggleTaskUseCase } from "../../application/useCases/ToggleTaskUseCase";
import { UpdateBlockUseCase } from "../../application/useCases/UpdateBlockUseCase";
import { DeleteBlockUseCase } from "../../application/useCases/DeleteBlockUseCase";
import { RestoreBlockUseCase } from "../../application/useCases/RestoreBlockUseCase";

// Casos de Uso de Cadernos
import { CreateNotebookUseCase } from "../../application/useCases/CreateNotebookUseCase";
import { UpdateNotebookUseCase } from "../../application/useCases/UpdateNotebookUseCase";
import { DeleteNotebookUseCase } from "../../application/useCases/DeleteNotebookUseCase";
import { RestoreNotebookUseCase } from "../../application/useCases/RestoreNotebookUseCase";

export const useNotebook = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Instanciando as dependências de Infra e Casos de Uso
  const repository = useMemo(() => new LocalStorageNotebookRepository(), []);

  const createNotebookUseCase = useMemo(
    () => new CreateNotebookUseCase(repository),
    [repository],
  );
  const updateNotebookUseCase = useMemo(
    () => new UpdateNotebookUseCase(repository),
    [repository],
  );
  const deleteNotebookUseCase = useMemo(
    () => new DeleteNotebookUseCase(repository),
    [repository],
  );
  const restoreNotebookUseCase = useMemo(
    () => new RestoreNotebookUseCase(repository),
    [repository],
  );

  const addBlockUseCase = useMemo(
    () => new AddBlockUseCase(repository),
    [repository],
  );
  const toggleTaskUseCase = useMemo(
    () => new ToggleTaskUseCase(repository),
    [repository],
  );
  const updateBlockUseCase = useMemo(
    () => new UpdateBlockUseCase(repository),
    [repository],
  );
  const deleteBlockUseCase = useMemo(
    () => new DeleteBlockUseCase(repository),
    [repository],
  );
  const restoreBlockUseCase = useMemo(
    () => new RestoreBlockUseCase(repository),
    [repository],
  );

  const fetchNotebooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await repository.getAll();
      setNotebooks(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar os cadernos.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  // =====================================
  // AÇÕES DE CADERNO
  // =====================================
  const createNotebook = async (title: string, description: string = "") => {
    try {
      await createNotebookUseCase.execute(title, description);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const updateNotebookInfo = async (
    id: string,
    title: string,
    description: string,
  ) => {
    try {
      await updateNotebookUseCase.execute(id, title, description);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const deleteNotebook = async (id: string) => {
    try {
      await deleteNotebookUseCase.execute(id);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const restoreNotebook = async (id: string) => {
    try {
      await restoreNotebookUseCase.execute(id);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  // =====================================
  // AÇÕES DE BLOCOS
  // =====================================
  const addBlock = async (notebookId: string, blockData: CreateBlockDTO) => {
    try {
      await addBlockUseCase.execute(notebookId, blockData);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const toggleTask = async (notebookId: string, blockId: string) => {
    try {
      await toggleTaskUseCase.execute(notebookId, blockId);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const updateBlock = async (
    notebookId: string,
    blockId: string,
    updatedData: Partial<ContentBlock>,
  ) => {
    try {
      await updateBlockUseCase.execute(notebookId, blockId, updatedData);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const deleteBlock = async (notebookId: string, blockId: string) => {
    try {
      await deleteBlockUseCase.execute(notebookId, blockId);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const restoreBlock = async (notebookId: string, blockId: string) => {
    try {
      await restoreBlockUseCase.execute(notebookId, blockId);
      await fetchNotebooks();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  // =====================================
  // FILTROS PARA A INTERFACE
  // =====================================
  // Filtramos os cadernos que não estão apagados para mostrar na Home
  const activeNotebooks = notebooks.filter((n) => !n.isDeleted);

  // Filtramos os cadernos apagados para a Lixeira
  const deletedNotebooks = notebooks.filter((n) => n.isDeleted);

  return {
    notebooks: activeNotebooks, // A aplicação principal usa este
    deletedNotebooks, // O painel da lixeira usará este
    isLoading,
    error,
    createNotebook,
    updateNotebookInfo,
    deleteNotebook,
    restoreNotebook,
    addBlock,
    toggleTask,
    updateBlock,
    deleteBlock,
    restoreBlock,
    refresh: fetchNotebooks,
  };
};
