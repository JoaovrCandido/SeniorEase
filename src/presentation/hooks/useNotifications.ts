// src/presentation/hooks/useNotifications.ts
import { useEffect, useRef } from 'react';
import { Notebook } from '../../domain/entities/Notebook';
import { NotificationService } from '../../infrastructure/services/NotificationService';

export const useNotifications = (notebooks: Notebook[]) => {
  const notifiedBlocks = useRef<Set<string>>(new Set());

  // O useEffect de requestPermission() que ficava aqui foi removido!

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      notebooks.forEach(notebook => {
        notebook.blocks.forEach(block => {
          if ((block.type === 'reminder' || block.type === 'meeting') && block.date) {
            const blockTime = new Date(block.date).getTime();
            const timeDiff = blockTime - now;
            
            const minutesLeft = timeDiff / 1000 / 60;

            if (minutesLeft > 9 && minutesLeft <= 10.5 && !notifiedBlocks.current.has(block.id)) {
              const isMeeting = block.type === 'meeting';
              const title = isMeeting ? 'Reunião em 10 minutos!' : 'Lembrete: Daqui a 10 minutos!';
              const body = isMeeting ? block.title : (block.content || 'Aviso programado');

              NotificationService.notify(title, body);
              notifiedBlocks.current.add(block.id);
            }
          }
        });
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [notebooks]);
};