// src/application/useCases/AddBlockUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AddBlockUseCase, CreateBlockDTO } from "./AddBlockUseCase";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";
import { Notebook } from "../../domain/entities/Notebook";
import { ParagraphBlock } from "../../domain/entities/Block";

describe("AddBlockUseCase", () => {
  let mockRepository: INotebookRepository;
  let useCase: AddBlockUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: "notebook-1",
      title: "Teste",
      type: "notebook",
      blocks: [],
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

    useCase = new AddBlockUseCase(mockRepository);
  });

  it("deve adicionar um novo bloco ao caderno corretamente e gerar um ID", async () => {
    // 1. Prepara o bloco novo sem ID
    const newBlockData = {
      type: "paragraph",
      content: "Este é um parágrafo",
    } as unknown as CreateBlockDTO;

    // 2. Executa a ação
    await useCase.execute("notebook-1", newBlockData);

    // 3. Valida se gravou o caderno atualizado
    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];

    expect(savedNotebook.blocks.length).toBe(1);

    const block = savedNotebook.blocks[0] as ParagraphBlock; // <-- Força a tipagem
    expect(block.content).toBe("Este é um parágrafo");
    expect(block.id).toBeDefined();
  });

  it("deve lançar um erro se o caderno não for encontrado", async () => {
    mockRepository.getById = vi.fn().mockResolvedValue(null);

    const newBlockData = {
      type: "heading",
      content: "Erro",
    } as unknown as CreateBlockDTO;

    await expect(useCase.execute("id-invalido", newBlockData)).rejects.toThrow(
      "Caderno com ID id-invalido não encontrado.",
    );

    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
