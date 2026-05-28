// src/presentation/hooks/useSpeech.ts
import { useState, useMemo, useEffect } from 'react';
import { WebSpeechService } from '../../infrastructure/services/WebSpeechService';

export const useSpeech = () => {
  // Instancia o serviço apenas uma vez
  const speechService = useMemo(() => new WebSpeechService(), []);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const readText = (text: string) => {
    // Funciona como um botão "Play/Pause"
    if (isSpeaking) {
      speechService.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speak(text, () => setIsSpeaking(false)); // Desliga quando terminar
    }
  };

  const stop = () => {
    speechService.cancel();
    setIsSpeaking(false);
  };

  // Medida de segurança: Pára de falar se o utilizador fechar o caderno ou a página
  useEffect(() => {
    return () => stop();
  }, []);

  return { isSpeaking, readText, stop };
};