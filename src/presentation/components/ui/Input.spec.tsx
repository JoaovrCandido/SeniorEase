// src/presentation/components/ui/Input.spec.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";

// Mock dos subcomponentes para isolarmos o teste do Input principal
vi.mock("./DictationButton", () => ({
  DictationButton: () => <button>Mock Mic</button>,
}));
vi.mock("./EmojiPicker", () => ({
  EmojiPicker: () => <button>Mock Emoji</button>,
}));

describe("Input", () => {
  it("deve renderizar o label e o input corretamente", () => {
    render(<Input label="Nome da Tarefa" placeholder="Escreva aqui..." />);

    expect(screen.getByText("Nome da Tarefa")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Escreva aqui...")).toBeInTheDocument();
  });

  it("NÃO deve renderizar os botões extra se as props onDictate e onEmoji não forem passadas", () => {
    render(<Input label="Nome da Tarefa" />);

    expect(screen.queryByText("Mock Mic")).not.toBeInTheDocument();
    expect(screen.queryByText("Mock Emoji")).not.toBeInTheDocument();
  });

  it("DEVE renderizar os botões extra quando as respetivas propriedades são passadas", () => {
    render(
      <Input label="Nome da Tarefa" onDictate={vi.fn()} onEmoji={vi.fn()} />,
    );

    expect(screen.getByText("Mock Mic")).toBeInTheDocument();
    expect(screen.getByText("Mock Emoji")).toBeInTheDocument();
  });
});
