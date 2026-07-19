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
  const createNotebook = async (
    title: string,
    description: string = "",
    type: "notebook" | "todo" = "notebook", // <-- NOVO
  ) => {
    try {
      await createNotebookUseCase.execute(title, description, type);
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
  // LÓGICA DE REORDENAÇÃO SEGURA
  // =====================================
  const moveBlock = async (
    notebookId: string,
    blockId: string,
    direction: "up" | "down",
  ) => {
    try {
      // 1. Puxa os dados atualizados diretamente do repositório
      const notebook = await repository.getById(notebookId);
      if (!notebook) return;

      // 2. Filtra os blocos visualmente ativos para garantir uma troca fluída
      const activeBlocks = notebook.blocks.filter((b) => !b.isDeleted);
      const visualIndex = activeBlocks.findIndex((b) => b.id === blockId);

      if (visualIndex < 0) return;

      // 3. Descobre com qual bloco ativo vamos trocar de posição
      let targetBlockId: string | null = null;
      if (direction === "up" && visualIndex > 0) {
        targetBlockId = activeBlocks[visualIndex - 1].id;
      } else if (
        direction === "down" &&
        visualIndex < activeBlocks.length - 1
      ) {
        targetBlockId = activeBlocks[visualIndex + 1].id;
      }

      if (targetBlockId) {
        // 4. Troca as posições usando a referência principal no array real
        const realIndexA = notebook.blocks.findIndex((b) => b.id === blockId);
        const realIndexB = notebook.blocks.findIndex(
          (b) => b.id === targetBlockId,
        );

        if (realIndexA >= 0 && realIndexB >= 0) {
          const temp = notebook.blocks[realIndexA];
          notebook.blocks[realIndexA] = notebook.blocks[realIndexB];
          notebook.blocks[realIndexB] = temp;

          // 5. Atualiza a data do caderno e guarda tudo de forma segura
          notebook.updatedAt = new Date();

          await repository.save(notebook);
          await fetchNotebooks();
        }
      }
    } catch (err) {
      console.error("Erro ao mover bloco", err);
    }
  };

  // =====================================
  // FILTROS PARA A INTERFACE
  // =====================================
  const activeNotebooks = notebooks.filter((n) => !n.isDeleted);
  const deletedNotebooks = notebooks.filter((n) => n.isDeleted);

  return {
    notebooks: activeNotebooks,
    deletedNotebooks,
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
    moveBlock, // Exposto aqui com sucesso!
    refresh: fetchNotebooks,
  };
};
