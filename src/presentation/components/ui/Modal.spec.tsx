// src/presentation/components/ui/Modal.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("não deve renderizar nada se isOpen for false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    );
    expect(screen.queryByText("Título")).not.toBeInTheDocument();
  });

  it("deve renderizar o modal e o botão de ajuda se onHelp for passado", () => {
    const mockHelp = vi.fn();
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Título Teste"
        onHelp={mockHelp}
      >
        <p>Conteúdo do Modal</p>
      </Modal>,
    );

    expect(screen.getByText("Título Teste")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do Modal")).toBeInTheDocument();

    // Testa o botão de ajuda
    const helpButton = screen.getByLabelText("Ajuda sobre esta tela");
    fireEvent.click(helpButton);
    expect(mockHelp).toHaveBeenCalledTimes(1);
  });

  it("deve fechar ao clicar no botão de fechar (X)", () => {
    const mockClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={mockClose} title="Teste">
        <p>Teste</p>
      </Modal>,
    );

    fireEvent.click(screen.getByLabelText("Fechar janela"));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("deve fechar ao pressionar a tecla Esc", () => {
    const mockClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={mockClose} title="Teste">
        <p>Teste</p>
      </Modal>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
