// src/presentation/components/ui/AccessibilityPanel.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AccessibilityPanel } from "./AccessibilityPanel";

const mockSetNavigationMode = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetContrast = vi.fn();

vi.mock("../../store/AccessibilityContext", () => ({
  useAccessibility: () => ({
    navigationMode: "simple",
    setNavigationMode: mockSetNavigationMode,
    fontSize: "normal",
    setFontSize: mockSetFontSize,
    contrast: "normal",
    setContrast: mockSetContrast,
    spacing: "normal",
    setSpacing: vi.fn(),
    visualFeedback: "normal",
    setVisualFeedback: vi.fn(),
    actionConfirmation: "on",
    setActionConfirmation: vi.fn(),
    personalizedMessages: "on",
    setPersonalizedMessages: vi.fn(),
  }),
}));

describe("AccessibilityPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar as funções de contexto ao clicar nos botões", () => {
    render(<AccessibilityPanel />);

    // Testa mudança de Modo
    fireEvent.click(screen.getByText("Modo Avançado (Produtividade)"));
    expect(mockSetNavigationMode).toHaveBeenCalledWith("advanced");

    // Testa mudança de Letra
    fireEvent.click(screen.getByText("Letra Gigante"));
    expect(mockSetFontSize).toHaveBeenCalledWith("large");

    // Testa mudança de Contraste
    fireEvent.click(screen.getByText("Fundo Escuro (Alto Contraste)"));
    expect(mockSetContrast).toHaveBeenCalledWith("high");
  });
});
