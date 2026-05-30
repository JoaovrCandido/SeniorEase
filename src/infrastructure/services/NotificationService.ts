// src/infrastructure/services/NotificationService.ts

export class NotificationService {
  // Pede permissão ao utilizador idoso de forma segura
  static async requestPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window))
      return false;
    if (Notification.permission === "granted") return true;

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  // Dispara a notificação no sistema operativo (Windows/Mac)
  static notify(title: string, body: string): void {
    if (
      typeof window !== "undefined" &&
      Notification.permission === "granted"
    ) {
      new Notification(title, {
        body,
        icon: "/favicon.ico", // Usa o ícone do nosso app
        requireInteraction: true, // A notificação fica na tela até o idoso fechar
      });
    }
  }
}
