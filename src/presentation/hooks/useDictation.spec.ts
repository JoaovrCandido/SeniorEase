// src/presentation/hooks/useDictation.spec.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDictation } from './useDictation';

// 1. Criamos os espiões globais
const mockStart = vi.fn();
const mockStop = vi.fn();
const mockShowToast = vi.fn();

// 2. CORREÇÃO: Mockamos a Classe para aceitar o 'new'
vi.mock('../../infrastructure/services/SpeechRecognitionService', () => {
  return {
    SpeechRecognitionService: vi.fn().mockImplementation(function () {
      return {
        start: mockStart,
        stop: mockStop,
      };
    }),
  };
});

vi.mock('../store/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

describe('useDictation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve disparar erro via Toast se o microfone falhar (exceto no-speech)', () => {
    const { result } = renderHook(() => useDictation());

    act(() => {
      result.current.startListening(vi.fn());
    });

    expect(result.current.isListening).toBe(true);

    // O serviço foi instanciado e o start chamado?
    expect(mockStart).toHaveBeenCalled();

    // Apanhamos a função de erro que passámos para o serviço (3º argumento)
    const onErrorCallback = mockStart.mock.calls[0][2];

    // Simulamos que o microfone deu erro "not-allowed"
    act(() => {
      onErrorCallback('not-allowed');
    });

    expect(result.current.isListening).toBe(false);
    expect(mockShowToast).toHaveBeenCalledWith(
      'Microfone indisponível ou permissão negada.',
      'error'
    );
  });
});