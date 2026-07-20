// src/infrastructure/services/SpeechRecognitionService.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SpeechRecognitionService } from './SpeechRecognitionService';

describe('SpeechRecognitionService', () => {
  let mockStart: any;
  let mockStop: any;
  let mockRecognitionInstance: any;

  beforeEach(() => {
    mockStart = vi.fn();
    mockStop = vi.fn();

    // Simulamos o comportamento interno da API de voz do Chrome
    mockRecognitionInstance = {
      lang: '',
      continuous: true,
      interimResults: true,
      start: mockStart,
      stop: mockStop,
      onresult: null,
      onerror: null,
      onend: null,
    };

    // CORREÇÃO MÁGICA AQUI: Usamos "function" tradicional para que o JavaScript 
    // permita o uso da palavra "new" no código de produção!
    const MockSpeechRecognition = vi.fn().mockImplementation(function () {
      return mockRecognitionInstance;
    });

    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);
    // Removemos o webkit para focar no standard no teste
    (window as any).webkitSpeechRecognition = undefined;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('deve inicializar com as configurações corretas (pt-BR, não contínuo)', () => {
    // Agora o "new" vai funcionar perfeitamente
    const service = new SpeechRecognitionService();
    
    expect(mockRecognitionInstance.lang).toBe('pt-BR');
    expect(mockRecognitionInstance.continuous).toBe(false);
    expect(mockRecognitionInstance.interimResults).toBe(false);
  });

  it('deve avisar com erro se o navegador não suportar a API', () => {
    // Removemos o suporte simulado
    vi.unstubAllGlobals();
    (window as any).SpeechRecognition = undefined;
    (window as any).webkitSpeechRecognition = undefined;

    const service = new SpeechRecognitionService();
    
    const mockOnError = vi.fn();
    service.start(vi.fn(), vi.fn(), mockOnError);

    expect(mockOnError).toHaveBeenCalledWith('O seu navegador não suporta a digitação por voz.');
  });

  it('deve mapear corretamente os callbacks nativos (onresult, onerror, onend)', () => {
    const service = new SpeechRecognitionService();
    
    const mockOnResult = vi.fn();
    const mockOnEnd = vi.fn();
    const mockOnError = vi.fn();

    service.start(mockOnResult, mockOnEnd, mockOnError);

    expect(mockStart).toHaveBeenCalledTimes(1);

    // 1. Simula o utilizador a falar
    const fakeEvent = {
      results: [[{ transcript: 'Olá neto' }]],
    };
    mockRecognitionInstance.onresult(fakeEvent);
    expect(mockOnResult).toHaveBeenCalledWith('Olá neto');

    // 2. Simula um erro de microfone cortado
    mockRecognitionInstance.onerror({ error: 'not-allowed' });
    expect(mockOnError).toHaveBeenCalledWith('not-allowed');

    // 3. Simula o fim da gravação
    mockRecognitionInstance.onend();
    expect(mockOnEnd).toHaveBeenCalledTimes(1);
  });

  it('deve chamar stop corretamente', () => {
    const service = new SpeechRecognitionService();
    service.stop();
    expect(mockStop).toHaveBeenCalledTimes(1);
  });
});