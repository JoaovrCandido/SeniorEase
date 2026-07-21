// src/application/useCases/DeleteNotebookUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteNotebookUseCase } from "./DeleteNotebookUseCase";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";
import { Notebook } from "../../domain/entities/Notebook";

describe("DeleteNotebookUseCase", () => {
  let mockRepository: INotebookRepository;
  let useCase: DeleteNotebookUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: "notebook-1",
      title: "Compras",
      type: "todo",
      blocks: [],
      isDeleted: false, // Começa ativo
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository = {
      getAll: vi.fn(),
      getById: vi.fn().mockResolvedValue(mockNotebook),
      save: vi.fn(),
      delete: vi.fn(), // Não usamos o hard delete do repository
    };

    useCase = new DeleteNotebookUseCase(mockRepository);
  });

  it("deve realizar um Soft Delete no caderno (isDeleted = true)", async () => {
    await useCase.execute("notebook-1");

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    expect(savedNotebook.isDeleted).toBe(true);
  });

  it("deve lançar erro se tentar apagar um caderno que não existe", async () => {
    mockRepository.getById = vi.fn().mockResolvedValue(null);

    await expect(useCase.execute("caderno-fantasma")).rejects.toThrow(
      "Caderno não encontrado.",
    );
  });
});
