// src/infrastructure/services/SpeechRecognitionService.ts

export class SpeechRecognitionService {
  private recognition: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      // A API tem prefixos webkit em alguns navegadores (como o Chrome)
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = "pt-BR"; // Português
        this.recognition.continuous = false; // Grava apenas uma frase por vez e para
        this.recognition.interimResults = false; // Não retorna resultados cortados pela metade
      }
    }
  }

  start(
    onResult: (text: string) => void,
    onEnd: () => void,
    onError: (err: string) => void,
  ) {
    if (!this.recognition) {
      onError("O seu navegador não suporta a digitação por voz.");
      return;
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    this.recognition.onend = () => {
      onEnd();
    };

    this.recognition.start();
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
