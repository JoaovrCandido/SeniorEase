// src/app/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccessibilityPanel } from "@/presentation/components/ui/AccessibilityPanel";
import { BackIcon, HelpIcon } from "@/presentation/components/ui/Icons";
import {
  OnboardingTour,
  TourStep,
} from "@/presentation/components/ui/OnboardingTour";
import styles from "@/app/page.module.css";

const SETTINGS_STEPS: TourStep[] = [
  {
    targetId: "tour-help-btn",
    title: "1. Precisa de Ajuda?",
    description: "Se esquecer para que serve cada opção, clique aqui.",
  },
  {
    targetId: "tour-back-btn",
    title: "2. Voltar",
    description: "Clique aqui quando terminar para voltar aos seus cadernos.",
  },
  {
    targetId: "tour-accessibility-panel",
    title: "3. Personalização",
    description:
      "Aqui pode mudar o tamanho da letra, o contraste, os botões e a segurança da aplicação para o deixar perfeitamente confortável para si.",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("@SeniorEase:tour:settings")) {
      setIsTourOpen(true);
      localStorage.setItem("@SeniorEase:tour:settings", "true");
    }
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        <header className={styles.pageHeaderBetween}>
          <div className={styles.flexAlignCenter}>
            <button
              id="tour-back-btn"
              className={styles.backButton}
              onClick={() => router.push("/")}
            >
              <BackIcon /> Voltar
            </button>
            <h1 className={styles.title}>Personalizar Tela</h1>
          </div>
          <button
            id="tour-help-btn"
            onClick={() => setIsTourOpen(true)}
            className={styles.btnPrimarySurface}
          >
            <HelpIcon /> Ajuda
          </button>
        </header>

        <div id="tour-accessibility-panel" className={styles.contentWrapper}>
          <AccessibilityPanel />
        </div>
      </div>

      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={SETTINGS_STEPS}
      />
    </main>
  );
}
