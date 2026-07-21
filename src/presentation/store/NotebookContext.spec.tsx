// src/presentation/store/NotebookContext.spec.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { NotebookProvider, useNotebookContext } from "./NotebookContext";

// 1. Mock do hook useNotebook para não batermos na base de dados (localStorage)
const mockNotebooks = [
  {
    id: "1",
    title: "Diário",
    type: "notebook",
    blocks: [],
    createdAt: new Date(),
  },
];

vi.mock("../hooks/useNotebook", () => ({
  useNotebook: () => ({
    notebooks: mockNotebooks,
    addNotebook: vi.fn(),
    deleteNotebook: vi.fn(),
  }),
}));

// 2. Mock das Notificações Globais para não dar erro
vi.mock("../hooks/useNotifications", () => ({
  useNotifications: vi.fn(),
}));

const TestComponent = () => {
  const { notebooks } = useNotebookContext();

  return (
    <div>
      <span data-testid="notebook-count">{notebooks.length}</span>
      {notebooks.map((n) => (
        <div key={n.id} data-testid="notebook-title">
          {n.title}
        </div>
      ))}
    </div>
  );
};

describe("NotebookContext", () => {
  it("deve lançar erro se o hook useNotebookContext for usado fora do Provider", () => {
    // Como isto vai lançar um erro, impedimos o console de ficar vermelho no terminal de testes
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useNotebookContext deve ser usado dentro de NotebookProvider",
    );

    consoleError.mockRestore();
  });

  it("deve fornecer os dados do estado da aplicação aos componentes filhos", () => {
    render(
      <NotebookProvider>
        <TestComponent />
      </NotebookProvider>,
    );

    // Valida se o componente Teste conseguiu puxar os cadernos do Provider
    expect(screen.getByTestId("notebook-count").textContent).toBe("1");
    expect(screen.getByTestId("notebook-title").textContent).toBe("Diário");
  });
});
