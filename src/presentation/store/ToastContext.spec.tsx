// src/presentation/store/ToastContext.spec.tsx
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { ToastProvider, useToast } from "./ToastContext";

// 1. Mocks dos Contextos Exteriores
vi.mock("./AccessibilityContext", () => ({
  useAccessibility: () => ({ personalizedMessages: "on" }), // Forçamos mensagens personalizadas a ON
}));

vi.mock("./UserProfileContext", () => ({
  useUserProfile: () => ({ name: "Carlos Alberto" }), // Forçamos um nome no perfil
}));

const TestComponent = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast("Tarefa concluída!", "success")}>
        Disparar Toast Sucesso
      </button>
      <button onClick={() => showToast("Erro crítico", "error")}>
        Disparar Toast Erro
      </button>
    </div>
  );
};

describe("ToastContext", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Interceta o relógio do sistema para não termos de esperar 5s
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve renderizar a mensagem de Toast e adicionar o nome do utilizador (Mensagem Personalizada)", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    act(() => {
      screen.getByText("Disparar Toast Sucesso").click();
    });

    // Como o mock diz que o nome é "Carlos Alberto", o regex garante que
    // vai aparecer "Carlos" e "Tarefa concluída!", independentemente do elogio aleatório ("Parabéns", etc.)
    const toastMessage = screen.getByRole("alert");
    expect(toastMessage.textContent).toMatch(/Carlos.*Tarefa concluída!/);
  });

  it("deve remover a mensagem após 5 segundos", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    act(() => {
      screen.getByText("Disparar Toast Erro").click();
    });

    expect(screen.getByText("Erro crítico")).toBeInTheDocument();

    // Avançamos o tempo em 5001 milissegundos
    act(() => {
      vi.advanceTimersByTime(5001);
    });

    // O Toast já não deve estar no ecrã
    expect(screen.queryByText("Erro crítico")).not.toBeInTheDocument();
  });

  it("deve remover a mensagem imediatamente ao clicar no botão de fechar (X)", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    act(() => {
      screen.getByText("Disparar Toast Erro").click();
    });

    expect(screen.getByText("Erro crítico")).toBeInTheDocument();

    const closeButton = screen.getByLabelText("Fechar aviso");

    act(() => {
      closeButton.click();
    });

    expect(screen.queryByText("Erro crítico")).not.toBeInTheDocument();
  });
});
