// src/infrastructure/services/WebSpeechService.ts

export class WebSpeechService {
  private synth: SpeechSynthesis | null = null;

  constructor() {
    // Garante que só vai acessar o window no lado do cliente (Next.js SSR safe)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string): void {
    if (!this.synth) {
      console.warn('Speech Synthesis API não é suportada neste navegador.');
      return;
    }

    // Cancela qualquer fala anterior para não sobrepor áudios
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurações focadas no público idoso:
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // Fala 10% mais devagar para clareza
    utterance.pitch = 1.0; // Tom de voz natural

    this.synth.speak(utterance);
  }

  public cancel(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }
}