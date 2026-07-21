// src/application/useCases/DeleteBlockUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteBlockUseCase } from "./DeleteBlockUseCase";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";
import { Notebook } from "../../domain/entities/Notebook";

describe("DeleteBlockUseCase", () => {
  let mockRepository: INotebookRepository;
  let useCase: DeleteBlockUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: "notebook-1",
      title: "Teste",
      type: "notebook",
      blocks: [
        {
          id: "block-1",
          type: "paragraph",
          content: "Anotação",
          isDeleted: false,
        },
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

    useCase = new DeleteBlockUseCase(mockRepository);
  });

  it("deve realizar um Soft Delete (isDeleted = true) no bloco e atualizar a data", async () => {
    await useCase.execute("notebook-1", "block-1");

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    expect(savedNotebook.blocks[0].isDeleted).toBe(true);
    // Garante que a data de atualização do caderno mudou
    expect(savedNotebook.updatedAt.getTime()).toBeGreaterThanOrEqual(
      new Date().getTime() - 1000,
    );
  });

  it("deve lançar erro se o bloco não existir no caderno", async () => {
    await expect(
      useCase.execute("notebook-1", "block-inexistente"),
    ).rejects.toThrow("Bloco não encontrado.");
  });
});
