// src/presentation/components/ui/OnboardingTour.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OnboardingTour } from "./OnboardingTour";

// Mock do Speech
const mockReadText = vi.fn();
const mockStop = vi.fn();

vi.mock("../../hooks/useSpeech", () => ({
  useSpeech: () => ({
    isSpeaking: false,
    readText: mockReadText,
    stop: mockStop,
  }),
}));

// Mock do Contexto para podermos controlar o modo (simple ou advanced)
let currentNavMode = "simple";
vi.mock("../../store/AccessibilityContext", () => ({
  useAccessibility: () => ({
    navigationMode: currentNavMode,
  }),
}));

describe("OnboardingTour", () => {
  const steps = [
    { targetId: "1", title: "Passo 1", description: "Instrução 1" },
    { targetId: "2", title: "Passo 2", description: "Instrução 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    currentNavMode = "simple";
  });

  it('NÃO deve renderizar se estiver no modo "advanced"', () => {
    currentNavMode = "advanced"; // Força o modo avançado
    render(<OnboardingTour isOpen={true} onClose={vi.fn()} steps={steps} />);

    expect(screen.queryByText("Passo 1")).not.toBeInTheDocument();
  });

  it('deve renderizar e navegar para o próximo passo no modo "simple"', () => {
    render(<OnboardingTour isOpen={true} onClose={vi.fn()} steps={steps} />);

    expect(screen.getByText("Passo 1")).toBeInTheDocument();

    // Clica em "Próximo Passo"
    fireEvent.click(screen.getByText("Próximo Passo"));

    // Deve mostrar o Passo 2 e mudar o botão para "Entendi, vamos lá!"
    expect(screen.getByText("Passo 2")).toBeInTheDocument();
    expect(screen.getByText("Entendi, vamos lá!")).toBeInTheDocument();
  });

  it('deve fechar ao clicar em "Pular Tudo"', () => {
    const mockClose = vi.fn();
    render(<OnboardingTour isOpen={true} onClose={mockClose} steps={steps} />);

    fireEvent.click(screen.getByText("Pular Tudo"));

    expect(mockClose).toHaveBeenCalledTimes(1);
    expect(mockStop).toHaveBeenCalledTimes(1); // Garante que a voz para de falar ao fechar
  });

  it("deve chamar a voz ao clicar no botão de ouvir", () => {
    render(<OnboardingTour isOpen={true} onClose={vi.fn()} steps={steps} />);

    fireEvent.click(screen.getByText("Ouvir Instrução"));

    // A voz deve receber o título + a descrição para ler
    expect(mockReadText).toHaveBeenCalledWith("Passo 1. Instrução 1");
  });
});
