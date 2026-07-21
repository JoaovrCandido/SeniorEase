// src/presentation/components/blocks/TaskBlockUI.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskBlockUI } from "./TaskBlockUI";
import { TaskBlock } from "../../../domain/entities/Block";

// 1. Mock do ToastContext (Fingimos que o Toast existe para não dar erro)
const mockShowToast = vi.fn();
vi.mock("../../store/ToastContext", () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

describe("TaskBlockUI", () => {
  // Limpa o histórico do mock antes de cada teste
  beforeEach(() => {
    mockShowToast.mockClear();
  });

  const baseBlock: TaskBlock = {
    id: "123",
    type: "task",
    content: "Comprar pão",
    isCompleted: false,
  };

  it("deve renderizar o conteúdo da tarefa corretamente", () => {
    render(
      <TaskBlockUI
        block={baseBlock}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onChangeContent={vi.fn()}
      />,
    );

    const input = screen.getByDisplayValue("Comprar pão");
    expect(input).toBeInTheDocument();
  });

  it("deve chamar onToggle quando o botão de checkbox é clicado", () => {
    const mockOnToggle = vi.fn();

    render(
      <TaskBlockUI
        block={baseBlock}
        onToggle={mockOnToggle}
        onDelete={vi.fn()}
        onChangeContent={vi.fn()}
      />,
    );

    // Encontra o botão pelo aria-label que definimos no componente
    const checkboxButton = screen.getByLabelText("Concluir tarefa");
    fireEvent.click(checkboxButton);

    expect(mockOnToggle).toHaveBeenCalledWith("123");
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("NÃO deve chamar onToggle e DEVE mostrar Toast de erro se a tarefa estiver vazia", () => {
    const mockOnToggle = vi.fn();
    const emptyBlock = { ...baseBlock, content: "   " }; // Tarefa vazia só com espaços

    render(
      <TaskBlockUI
        block={emptyBlock}
        onToggle={mockOnToggle}
        onDelete={vi.fn()}
        onChangeContent={vi.fn()}
      />,
    );

    const checkboxButton = screen.getByLabelText("Concluir tarefa");
    fireEvent.click(checkboxButton);

    // Valida que a função onToggle foi bloqueada
    expect(mockOnToggle).not.toHaveBeenCalled();

    // Valida que o Toast de erro foi disparado com a mensagem certa
    expect(mockShowToast).toHaveBeenCalledWith(
      "Escreva qual é a tarefa antes de marcá-la como concluída.",
      "error",
    );
  });
});
