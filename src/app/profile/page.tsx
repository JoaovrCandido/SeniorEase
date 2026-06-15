// src/app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccessibilityPanel } from "@/presentation/components/ui/AccessibilityPanel";
import { Input } from "@/presentation/components/ui/Input";
import {
  BackIcon,
  HelpIcon,
  UserIcon,
} from "@/presentation/components/ui/Icons";
import {
  OnboardingTour,
  TourStep,
} from "@/presentation/components/ui/OnboardingTour";
import { useUserProfile } from "@/presentation/store/UserProfileContext";
import { useToast } from "@/presentation/store/ToastContext";
import styles from "@/app/page.module.css";

const PROFILE_STEPS: TourStep[] = [
  {
    targetId: "tour-help-btn",
    title: "1. Precisa de Ajuda?",
    description: "Clique aqui sempre que tiver dúvidas nesta tela.",
  },
  {
    targetId: "tour-profile-info",
    title: "2. Os Seus Dados",
    description:
      "Aqui você preenche o seu nome, idade e um contato de emergência. Fica tudo guardado automaticamente!",
  },
  {
    targetId: "tour-accessibility-panel",
    title: "3. Personalização",
    description:
      "Altere o tamanho da letra, as cores e a segurança para deixar tudo perfeitamente confortável para si.",
  },
  {
    targetId: "tour-back-btn",
    title: "4. Voltar",
    description:
      "Quando terminar as alterações, clique aqui para voltar aos cadernos.",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { name, age, emergencyContact, setName, setAge, setEmergencyContact } =
    useUserProfile();
  const { showToast } = useToast();
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("@SeniorEase:tour:profile")) {
      setIsTourOpen(true);
      localStorage.setItem("@SeniorEase:tour:profile", "true");
    }
  }, []);

  const handleSaveProfile = () => {
    if (name || emergencyContact || age) {
      showToast("Dados guardados automaticamente!", "success");
    }
  };

  // MÁSCARA DE TELEFONE (Apenas números, padrão BR)
  const handlePhoneChange = (text: string) => {
    let value = text.replace(/\D/g, ""); // Remove tudo o que não é número
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    // Aplica a formatação
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2})/, "($1");
    }
    setEmergencyContact(value);
  };

  // VALIDAÇÃO DE IDADE (Apenas números, máximo 3 dígitos)
  const handleAgeChange = (text: string) => {
    const value = text.replace(/\D/g, "");
    if (value.length <= 3) setAge(value);
  };

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
            <h1 className={styles.title}>Meu Perfil & Tela</h1>
          </div>
          <button
            id="tour-help-btn"
            onClick={() => setIsTourOpen(true)}
            className={styles.btnPrimarySurface}
          >
            <HelpIcon /> Ajuda
          </button>
        </header>

        <div
          className={styles.contentWrapper}
          style={{ display: "flex", flexDirection: "column", gap: "48px" }}
        >
          {/* SEÇÃO 1: DADOS PESSOAIS */}
          <section id="tour-profile-info">
            <h2
              className={styles.sectionTitle}
              style={{
                borderBottom: "2px solid var(--primary-surface)",
                paddingBottom: "8px",
                marginBottom: "24px",
              }}
            >
              <div className={styles.flexAlignCenter}>
                <UserIcon /> Meus Dados Pessoais
              </div>
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxWidth: "500px",
              }}
            >
              <Input
                label="Como gosta de ser chamado?"
                placeholder="Ex: João..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onDictate={(text) => setName(name ? `${name} ${text}` : text)}
                onEmoji={(emoji) => setName(name ? `${name} ${emoji}` : emoji)}
                onBlur={handleSaveProfile}
              />

              <Input
                label="Idade"
                placeholder="Ex: 68"
                type="text"
                inputMode="numeric"
                value={age}
                onChange={(e) => handleAgeChange(e.target.value)}
                onBlur={handleSaveProfile}
              />

              <Input
                label="Telefone de Emergência"
                placeholder="Ex: (11) 98765-4321"
                type="tel"
                value={emergencyContact}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={handleSaveProfile}
              />
              {/* <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '100px' }}>
                  <Input
                    label="Idade"
                    placeholder="Ex: 68"
                    type="text"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => handleAgeChange(e.target.value)}
                    onBlur={handleSaveProfile}
                  />
                </div>
                <div style={{ flex: '2', minWidth: '200px' }}>
                  <Input
                    label="Telefone de Emergência"
                    placeholder="Ex: (11) 98765-4321"
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={handleSaveProfile}
                  />
                </div>
              </div> */}
            </div>
          </section>

          {/* SEÇÃO 2: ACESSIBILIDADE E PERSONALIZAÇÃO */}
          <section id="tour-accessibility-panel">
            <h2
              className={styles.sectionTitle}
              style={{
                borderBottom: "2px solid var(--primary-surface)",
                paddingBottom: "8px",
                marginBottom: "24px",
              }}
            >
              Personalização da Tela
            </h2>
            <AccessibilityPanel />
          </section>
        </div>
      </div>

      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={PROFILE_STEPS}
      />
    </main>
  );
}
