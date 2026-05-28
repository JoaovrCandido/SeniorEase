// src/presentation/hooks/useNotifications.ts
import { useEffect, useRef } from 'react';
import { Notebook } from '../../domain/entities/Notebook';
import { NotificationService } from '../../infrastructure/services/NotificationService';

export const useNotifications = (notebooks: Notebook[]) => {
  // Guarda os IDs dos blocos já notificados para não repetir o aviso
  const notifiedBlocks = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Pede permissão assim que a app abre
    NotificationService.requestPermission();
  }, []);

  useEffect(() => {
    // Roda a verificação a cada 30 segundos
    const interval = setInterval(() => {
      const now = new Date().getTime();

      notebooks.forEach(notebook => {
        notebook.blocks.forEach(block => {
          if ((block.type === 'reminder' || block.type === 'meeting') && block.date) {
            const blockTime = new Date(block.date).getTime();
            const timeDiff = blockTime - now;
            
            // Converte milissegundos para minutos
            const minutesLeft = timeDiff / 1000 / 60;

            // Se faltarem entre 9.5 e 10.5 minutos e ainda não foi notificado
            if (minutesLeft > 9 && minutesLeft <= 10.5 && !notifiedBlocks.current.has(block.id)) {
              const isMeeting = block.type === 'meeting';
              const title = isMeeting ? 'Reunião em 10 minutos!' : 'Lembrete: Daqui a 10 minutos!';
              const body = isMeeting ? block.title : (block.content || 'Aviso programado');

              NotificationService.notify(title, body);
              
              // Regista que já enviou a notificação
              notifiedBlocks.current.add(block.id);
            }
          }
        });
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [notebooks]);
};