// src/presentation/hooks/useSpeech.spec.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSpeech } from "./useSpeech";

const mockSpeak = vi.fn();
const mockCancel = vi.fn();

// CORREÇÃO: O Mock agora retorna um mock construtor (function)
vi.mock("../../infrastructure/services/WebSpeechService", () => {
  return {
    WebSpeechService: vi.fn().mockImplementation(function () {
      return {
        speak: mockSpeak,
        cancel: mockCancel,
      };
    }),
  };
});

describe("useSpeech", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve alternar entre ler e parar de ler ao chamar readText", () => {
    const { result } = renderHook(() => useSpeech());

    expect(result.current.isSpeaking).toBe(false);

    act(() => {
      result.current.readText("Olá mundo");
    });

    expect(result.current.isSpeaking).toBe(true);
    expect(mockSpeak).toHaveBeenCalledWith("Olá mundo", expect.any(Function));

    act(() => {
      result.current.readText("Olá mundo");
    });

    expect(result.current.isSpeaking).toBe(false);
    expect(mockCancel).toHaveBeenCalled();
  });
});
