// src/infrastructure/services/NotificationService.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NotificationService } from "./NotificationService";

describe("NotificationService", () => {
  // Guardamos o estado original para não poluir outros testes
  const originalNotification = global.Notification;
  let mockRequestPermission: any;
  let MockNotificationObj: any;

  beforeEach(() => {
    mockRequestPermission = vi.fn().mockResolvedValue("granted");

    // Criamos uma classe falsa de Notificação
    MockNotificationObj = vi.fn();
    MockNotificationObj.requestPermission = mockRequestPermission;
    MockNotificationObj.permission = "default";

    // Injetamos a Notificação falsa no ambiente global
    vi.stubGlobal("Notification", MockNotificationObj);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalNotification !== undefined) {
      global.Notification = originalNotification;
    }
  });

  describe("requestPermission", () => {
    it("deve retornar true se a permissão já estiver concedida", async () => {
      MockNotificationObj.permission = "granted";
      const result = await NotificationService.requestPermission();
      expect(result).toBe(true);
      expect(mockRequestPermission).not.toHaveBeenCalled();
    });

    it("deve pedir permissão e retornar true se o utilizador aceitar", async () => {
      MockNotificationObj.permission = "default";
      const result = await NotificationService.requestPermission();
      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it("deve retornar false se o utilizador negar a permissão", async () => {
      MockNotificationObj.permission = "default";
      mockRequestPermission.mockResolvedValueOnce("denied"); // Finge que o avô clicou em "Bloquear"

      const result = await NotificationService.requestPermission();
      expect(result).toBe(false);
    });
  });

  describe("notify", () => {
    it("deve instanciar a Notification se a permissão for granted", () => {
      MockNotificationObj.permission = "granted";

      NotificationService.notify("Lembrete", "Tomar o remédio");

      expect(MockNotificationObj).toHaveBeenCalledTimes(1);
      expect(MockNotificationObj).toHaveBeenCalledWith("Lembrete", {
        body: "Tomar o remédio",
        icon: "/favicon.ico",
        requireInteraction: true,
      });
    });

    it("NÃO deve instanciar a Notification se a permissão for denied", () => {
      MockNotificationObj.permission = "denied";

      NotificationService.notify("Lembrete", "Tomar o remédio");

      expect(MockNotificationObj).not.toHaveBeenCalled();
    });
  });
});
