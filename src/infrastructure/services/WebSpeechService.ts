// src/infrastructure/services/WebSpeechService.ts

export class WebSpeechService {
  private synth: SpeechSynthesis | null = null;
  // Guardar a referência evita o bug de Garbage Collection que corta a voz no Chrome
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, onEnd?: () => void): void {
    if (!this.synth) {
      console.warn("Speech Synthesis API não é suportada neste navegador.");
      return;
    }

    this.cancel();

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.lang = "pt-BR";
    this.currentUtterance.rate = 0.9; // Velocidade confortável para a terceira idade
    this.currentUtterance.pitch = 1.0;

    this.currentUtterance.onend = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(this.currentUtterance);
  }

  public cancel(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }
}
