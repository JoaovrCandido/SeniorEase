// src/infrastructure/services/WebSpeechService.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WebSpeechService } from "./WebSpeechService";

describe("WebSpeechService", () => {
  let mockSpeak: any;
  let mockCancel: any;

  beforeEach(() => {
    mockSpeak = vi.fn();
    mockCancel = vi.fn();

    // 1. Mock do objeto window.speechSynthesis
    vi.stubGlobal("speechSynthesis", {
      speak: mockSpeak,
      cancel: mockCancel,
      speaking: false, // Começa sem falar
    });

    // 2. Mock da classe que constrói a frase falada (Utterance)
    const MockUtterance = vi.fn(function (this: any, text: string) {
      this.text = text;
      this.lang = "";
      this.rate = 1;
      this.pitch = 1;
      this.onend = null;
    });
    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("deve cancelar qualquer voz ativa antes de começar a falar de novo", () => {
    // Forçamos o navegador a dizer que já está a falar
    vi.stubGlobal("speechSynthesis", {
      speak: mockSpeak,
      cancel: mockCancel,
      speaking: true,
    });

    const service = new WebSpeechService();
    service.speak("Bom dia");

    // Deve ter cancelado a voz velha antes de instanciar a nova
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it("deve configurar a frase corretamente para idosos e dar play", () => {
    const service = new WebSpeechService();
    const mockOnEnd = vi.fn();

    service.speak("Teste de leitura", mockOnEnd);

    expect(mockSpeak).toHaveBeenCalledTimes(1);

    // Apanha o argumento enviado para o window.speechSynthesis.speak()
    const utterancePassedToSpeak = mockSpeak.mock.calls[0][0];

    // Valida se os parâmetros foram aplicados corretamente
    expect(utterancePassedToSpeak.text).toBe("Teste de leitura");
    expect(utterancePassedToSpeak.lang).toBe("pt-BR");
    expect(utterancePassedToSpeak.rate).toBe(0.9); // Velocidade ideal
    expect(utterancePassedToSpeak.pitch).toBe(1.0);

    // Simula a conclusão da fala pela API do browser
    utterancePassedToSpeak.onend();
    expect(mockOnEnd).toHaveBeenCalledTimes(1);
  });

  it("deve parar a fala se cancel() for chamado enquanto estiver a ler", () => {
    vi.stubGlobal("speechSynthesis", {
      speak: mockSpeak,
      cancel: mockCancel,
      speaking: true, // A falar no momento do clique
    });

    const service = new WebSpeechService();
    service.cancel();

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
