// src/presentation/components/blocks/ReminderBlockUI.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReminderBlockUI } from "./ReminderBlockUI";
import { ReminderBlock } from "../../../domain/entities/Block";

vi.mock("../ui/DictationButton", () => ({ DictationButton: () => <div /> }));
vi.mock("../ui/EmojiPicker", () => ({ EmojiPicker: () => <div /> }));

const mockShowToast = vi.fn();
vi.mock("../../store/ToastContext", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

describe("ReminderBlockUI", () => {
  const mockBlock: ReminderBlock = {
    id: "r-1",
    type: "reminder",
    content: "Tomar remédio",
    date: "2026-07-21T10:00", // Data válida no futuro
  };

  beforeEach(() => {
    mockShowToast.mockClear();
    // Congelamos o tempo para o dia de hoje ser exato: 2026-07-20T12:00:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-20T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve mostrar erro e NÃO gravar se o utilizador escolher uma data no passado", () => {
    const mockOnChange = vi.fn();
    render(
      <ReminderBlockUI
        block={mockBlock}
        onDelete={vi.fn()}
        onChangeContent={mockOnChange}
      />,
    );

    // Procura o input de data (o type datetime-local)
    const dateInput = screen.getByDisplayValue("2026-07-21T10:00");

    // Tentamos colocar para o dia de ontem
    fireEvent.change(dateInput, { target: { value: "2026-07-19T10:00" } });
    fireEvent.blur(dateInput);

    // Valida o bloqueio!
    expect(mockShowToast).toHaveBeenCalledWith(
      "O lembrete não pode ser marcado no passado.",
      "error",
    );
    expect(mockOnChange).not.toHaveBeenCalled(); // Garante que a data errada nunca chegou à BD
  });

  it("deve gravar corretamente se a data for no futuro", () => {
    const mockOnChange = vi.fn();
    render(
      <ReminderBlockUI
        block={mockBlock}
        onDelete={vi.fn()}
        onChangeContent={mockOnChange}
      />,
    );

    const dateInput = screen.getByDisplayValue("2026-07-21T10:00");

    // Colocar para daqui a uma semana
    fireEvent.change(dateInput, { target: { value: "2026-07-27T10:00" } });
    fireEvent.blur(dateInput);

    expect(mockShowToast).not.toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(
      "r-1",
      "Tomar remédio",
      "2026-07-27T10:00",
    );
  });
});
