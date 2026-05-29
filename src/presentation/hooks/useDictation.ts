// src/presentation/hooks/useDictation.ts
import { useState, useRef, useCallback } from 'react';
import { SpeechRecognitionService } from '../../infrastructure/services/SpeechRecognitionService';
import { useToast } from '../store/ToastContext';

export const useDictation = () => {
  const [isListening, setIsListening] = useState(false);
  const service = useRef<SpeechRecognitionService | null>(null);
  const { showToast } = useToast();

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!service.current) {
      service.current = new SpeechRecognitionService();
    }
    
    setIsListening(true);
    service.current.start(
      (text) => {
        onResult(text);
      },
      () => {
        setIsListening(false);
      },
      (err) => {
        setIsListening(false);
        if (err !== 'no-speech') {
          showToast('Microfone indisponível ou permissão negada.', 'error');
        }
      }
    );
  }, [showToast]);

  const stopListening = useCallback(() => {
    if (service.current) {
      service.current.stop();
    }
    setIsListening(false);
  }, []);

  return { isListening, startListening, stopListening };
};