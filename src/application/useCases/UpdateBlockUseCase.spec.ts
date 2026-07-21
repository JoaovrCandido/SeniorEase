// src/application/useCases/UpdateBlockUseCase.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateBlockUseCase } from "./UpdateBlockUseCase";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";
import { Notebook } from "../../domain/entities/Notebook";
import { ParagraphBlock } from "../../domain/entities/Block";

describe("UpdateBlockUseCase", () => {
  let mockRepository: INotebookRepository;
  let useCase: UpdateBlockUseCase;
  let mockNotebook: Notebook;

  beforeEach(() => {
    mockNotebook = {
      id: "nb-1",
      title: "Diário",
      type: "notebook",
      blocks: [
        // Forçamos a tipagem aqui para facilitar o teste
        {
          id: "block-1",
          type: "paragraph",
          content: "Texto antigo",
          isDeleted: false,
        } as ParagraphBlock,
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

    useCase = new UpdateBlockUseCase(mockRepository);
  });

  it("deve fundir (merge) os dados antigos com os novos dados recebidos", async () => {
    // A LINHA QUE TINHA SUMIDO ESTÁ AQUI!
    // Usamos o Partial<ParagraphBlock> para o TypeScript não reclamar da falta de outras propriedades
    const updateData = {
      content: "Texto novo atualizado",
    } as Partial<ParagraphBlock>;

    await useCase.execute("nb-1", "block-1", updateData);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    const updatedBlock = savedNotebook.blocks[0] as ParagraphBlock;

    expect(updatedBlock.content).toBe("Texto novo atualizado");
    expect(updatedBlock.type).toBe("paragraph");
  });

  it("deve lançar erro se o caderno ou bloco não existirem", async () => {
    const updateData = { content: "novo" } as Partial<ParagraphBlock>;

    // 1. Simular erro de CADERNO INEXISTENTE
    mockRepository.getById = vi.fn().mockResolvedValue(null);

    await expect(
      useCase.execute("nb-falso", "block-1", updateData),
    ).rejects.toThrow("Caderno não encontrado.");

    // 2. Simular erro de BLOCO INEXISTENTE
    mockRepository.getById = vi.fn().mockResolvedValue(mockNotebook);

    await expect(
      useCase.execute("nb-1", "block-falso", updateData),
    ).rejects.toThrow("Bloco não encontrado no caderno.");
  });
});
