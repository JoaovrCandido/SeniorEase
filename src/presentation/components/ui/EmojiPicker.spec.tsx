// src/presentation/components/ui/EmojiPicker.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EmojiPicker } from "./EmojiPicker";

describe("EmojiPicker", () => {
  it("deve abrir o painel de emojis e selecionar um emoji", () => {
    const mockOnSelect = vi.fn();
    render(
      <EmojiPicker onSelect={mockOnSelect} title="Adicionar Emoji Teste" />,
    );

    // Verifica que o painel está fechado
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Clica para abrir
    fireEvent.click(screen.getByLabelText("Adicionar Emoji Teste"));

    // Verifica se abriu
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Seleciona um emoji (por exemplo o '👍')
    fireEvent.click(screen.getByText("👍"));

    // Verifica se a função foi chamada com o emoji correto e se o modal fechou
    expect(mockOnSelect).toHaveBeenCalledWith("👍");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
