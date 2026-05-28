// src/infrastructure/services/WebSpeechService.ts

export class WebSpeechService {
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  // Adicionámos o onEnd para o React saber quando a voz parou
  public speak(text: string, onEnd?: () => void): void {
    if (!this.synth) {
      console.warn('Speech Synthesis API não é suportada neste navegador.');
      return;
    }

    this.cancel(); // Cancela falas anteriores

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; 
    utterance.pitch = 1.0; 

    // Avisa a interface gráfica quando terminar de ler
    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public cancel(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }
}