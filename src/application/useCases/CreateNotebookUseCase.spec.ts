// src/application/useCases/CreateNotebookUseCase.spec.ts
import { describe, it, expect, vi } from "vitest";
import { CreateNotebookUseCase } from "./CreateNotebookUseCase";
import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

describe("CreateNotebookUseCase", () => {
  it('deve criar um caderno com o tipo "notebook" por padrão', async () => {
    // 1. Prepara (Mock do Repositório fingindo que guarda dados)
    const mockRepository: INotebookRepository = {
      getAll: vi.fn(), // <-- Corrigido de findAll para getAll
      getById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
    const useCase = new CreateNotebookUseCase(mockRepository);

    // 2. Executa
    await useCase.execute("Meu Caderno", "Descrição teste");

    // 3. Valida
    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    // Verifica se guardou com o tipo correto
    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    expect(savedNotebook.title).toBe("Meu Caderno");
    expect(savedNotebook.type).toBe("notebook");
  });

  it('deve criar uma lista de tarefas quando o tipo "todo" for enviado', async () => {
    const mockRepository: INotebookRepository = { save: vi.fn() } as any;
    const useCase = new CreateNotebookUseCase(mockRepository);

    await useCase.execute("Minha Lista", "", "todo");

    const savedNotebook = vi.mocked(mockRepository.save).mock.calls[0][0];
    expect(savedNotebook.type).toBe("todo");
  });
});
