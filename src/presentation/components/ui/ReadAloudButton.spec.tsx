// src/presentation/components/ui/ReadAloudButton.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReadAloudButton } from "./ReadAloudButton";

// Controlamos o estado do mock manualmente
let isSpeakingState = false;
const mockReadText = vi.fn();

vi.mock("../../hooks/useSpeech", () => ({
  useSpeech: () => ({
    isSpeaking: isSpeakingState,
    readText: mockReadText,
  }),
}));

describe("ReadAloudButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isSpeakingState = false;
  });

  it('deve exibir "Ouvir Caderno" quando não estiver a falar', () => {
    render(<ReadAloudButton textToRead="Texto teste" />);

    const button = screen.getByRole("button", {
      name: "Ouvir conteúdo em voz alta",
    });
    expect(button).toHaveTextContent("Ouvir Caderno");

    fireEvent.click(button);
    expect(mockReadText).toHaveBeenCalledWith("Texto teste");
  });

  it('deve mudar o texto para "Parar Leitura" quando estiver a falar', () => {
    isSpeakingState = true; // Forçamos o estado do hook
    render(<ReadAloudButton textToRead="Texto teste" />);

    const button = screen.getByRole("button", {
      name: "Parar leitura em voz alta",
    });
    expect(button).toHaveTextContent("Parar Leitura");
  });
});
