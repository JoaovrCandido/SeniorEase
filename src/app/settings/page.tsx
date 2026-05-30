// src/app/settings/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AccessibilityPanel } from "@/presentation/components/ui/AccessibilityPanel";
import { BackIcon } from "@/presentation/components/ui/Icons";
import styles from "@/app/page.module.css";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        <header className={styles.pageHeader}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            <BackIcon /> Voltar
          </button>
          <h1 className={styles.title}>Personalizar Tela</h1>
        </header>

        <div className={styles.contentWrapper}>
          <AccessibilityPanel />
        </div>
      </div>
    </main>
  );
}
