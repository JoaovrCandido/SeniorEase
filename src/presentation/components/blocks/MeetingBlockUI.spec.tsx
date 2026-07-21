// src/presentation/components/blocks/MeetingBlockUI.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MeetingBlockUI } from "./MeetingBlockUI";
import { MeetingBlock } from "../../../domain/entities/Block";

vi.mock("../ui/DictationButton", () => ({ DictationButton: () => <div /> }));
vi.mock("../ui/EmojiPicker", () => ({ EmojiPicker: () => <div /> }));

const mockShowToast = vi.fn();
vi.mock("../../store/ToastContext", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

describe("MeetingBlockUI", () => {
  const mockBlock: MeetingBlock = {
    id: "m-1",
    type: "meeting",
    title: "Café",
    meetingUrl: "",
    date: "2026-07-20T10:00",
  };

  beforeEach(() => {
    mockShowToast.mockClear();
  });

  it('deve adicionar automaticamente "https://" ao link se o utilizador esquecer', () => {
    const mockOnChange = vi.fn();
    render(
      <MeetingBlockUI
        block={mockBlock}
        onDelete={vi.fn()}
        onChangeContent={mockOnChange}
      />,
    );

    // Procura o input do link pelo placeholder
    const urlInput = screen.getByPlaceholderText(
      "Cole o link (Zoom, Meet, Teams...)",
    );

    // Utilizador digita 'zoom.us/j/123' (esqueceu do https)
    fireEvent.change(urlInput, { target: { value: "zoom.us/j/123" } });
    fireEvent.blur(urlInput); // Tira o foco

    // Valida se o hook avisou o utilizador pelo Toast
    expect(mockShowToast).toHaveBeenCalledWith(
      "Adicionamos 'https://' ao link para garantir que funcione.",
      "info",
    );

    // Valida se o onChangeContent recebeu o URL arranjado
    expect(mockOnChange).toHaveBeenCalledWith(
      "m-1",
      "Café",
      "https://zoom.us/j/123",
      "2026-07-20T10:00",
    );
  });

  it('NÃO deve adicionar "https://" se o utilizador já o tiver colocado', () => {
    const mockOnChange = vi.fn();
    render(
      <MeetingBlockUI
        block={mockBlock}
        onDelete={vi.fn()}
        onChangeContent={mockOnChange}
      />,
    );

    const urlInput = screen.getByPlaceholderText(
      "Cole o link (Zoom, Meet, Teams...)",
    );

    fireEvent.change(urlInput, {
      target: { value: "https://meet.google.com/abc" },
    });
    fireEvent.blur(urlInput);

    expect(mockShowToast).not.toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(
      "m-1",
      "Café",
      "https://meet.google.com/abc",
      "2026-07-20T10:00",
    );
  });
});
