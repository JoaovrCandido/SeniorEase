// src/presentation/hooks/useNotifications.spec.ts
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNotifications } from './useNotifications';
import { NotificationService } from '../../infrastructure/services/NotificationService';

// Mock do Serviço de Notificações do Navegador
vi.mock('../../infrastructure/services/NotificationService', () => ({
  NotificationService: {
    notify: vi.fn(),
  },
}));

describe('useNotifications', () => {
  beforeEach(() => {
    // Assumimos controlo do tempo (Fingimos que são exatamente 12:00:00)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('deve disparar notificação se faltarem entre 9 e 10.5 minutos para o evento', () => {
    // Criamos um caderno falso com uma reunião para as 12:10:00
    const mockNotebooks: any[] = [
      {
        id: 'nb-1',
        blocks: [
          {
            id: 'block-1',
            type: 'meeting',
            title: 'Consulta Médica',
            date: '2026-07-20T12:10:00Z', // Exatamente 10 minutos no futuro
          },
        ],
      },
    ];

    renderHook(() => useNotifications(mockNotebooks));

    // O hook verifica o tempo a cada 30 segundos, então avançamos 31s
    vi.advanceTimersByTime(31000);

    // Valida se o serviço chamou o balão flutuante do SO com o título correto
    expect(NotificationService.notify).toHaveBeenCalledTimes(1);
    expect(NotificationService.notify).toHaveBeenCalledWith(
      'Reunião em 10 minutos!',
      'Consulta Médica'
    );

    // Se avançarmos mais 30s, ele NÃO deve notificar de novo (evita spam)
    vi.advanceTimersByTime(31000);
    expect(NotificationService.notify).toHaveBeenCalledTimes(1);
  });
});