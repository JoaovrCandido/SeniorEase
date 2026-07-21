// src/application/useCases/RestoreBlockUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RestoreBlockUseCase } from "./RestoreBlockUseCase";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";
import { Notebook } from "../../domain/entities/Notebook";

describe("RestoreBlockUseCase", () => {
  let mockRepository: INotebookRepository;
  let useCase: RestoreBlockUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: "nb-1",
      title: "Teste",
      type: "notebook",
      blocks: [
        { id: "block-1", type: "heading", content: "Apagado", isDeleted: true },
      ],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository = {
      getAll: vi.fn(),
      getById: vi.fn().mockResolvedValue(mockNotebook),
      save: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new RestoreBlockUseCase(mockRepository);
  });

  it("deve restaurar um bloco apagado (isDeleted = false)", async () => {
    await useCase.execute("nb-1", "block-1");

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    expect(savedNotebook.blocks[0].isDeleted).toBe(false); // Foi restaurado com sucesso
  });
});
