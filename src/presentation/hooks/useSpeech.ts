// src/presentation/hooks/useSpeech.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { WebSpeechService } from '../../infrastructure/services/WebSpeechService';

export const useSpeech = () => {
  // Usamos useRef para manter a mesma instância do serviço de forma estável
  const speechService = useRef<WebSpeechService | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    speechService.current = new WebSpeechService();
    return () => {
      speechService.current?.cancel();
    };
  }, []);

  const readText = useCallback((text: string) => {
    if (!speechService.current) return;

    if (isSpeaking) {
      speechService.current.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.current.speak(text, () => setIsSpeaking(false));
    }
  }, [isSpeaking]);

  // useCallback com array vazio garante que o 'stop' nunca muda de identidade entre re-renders
  const stop = useCallback(() => {
    speechService.current?.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, readText, stop };
};