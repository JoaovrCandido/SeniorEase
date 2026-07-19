// src/presentation/components/ui/AccessibilityPanel.tsx
import React from "react";
import { useAccessibility } from "../../store/AccessibilityContext";
import { Button } from "./Button";
import styles from "./AccessibilityPanel.module.css";

export const AccessibilityPanel: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    contrast,
    setContrast,
    spacing,
    setSpacing,
    visualFeedback,
    setVisualFeedback,
    actionConfirmation,
    setActionConfirmation,
    personalizedMessages,
    setPersonalizedMessages,
    navigationMode, // <-- NOVO
    setNavigationMode, // <-- NOVO
  } = useAccessibility();

  return (
    <section
      id="tour-accessibility-panel"
      aria-label="Painel de Personalização de Acessibilidade"
      className={styles.container}
    >
      {/* NOVO: INTERRUPTOR MESTRE */}
      <div
        style={{
          backgroundColor: "var(--primary-surface)",
          padding: "24px",
          borderRadius: "var(--radius-lg)",
          border: "2px solid var(--primary-main)",
        }}
      >
        <h3
          className={styles.sectionTitle}
          style={{ color: "var(--primary-main)", fontWeight: "bold" }}
        >
          Modo de Uso Principal
        </h3>
        <p
          className={styles.description}
          style={{ color: "var(--primary-main)", marginBottom: "16px" }}
        >
          Escolha a experiência que melhor se adapta a si. O modo Avançado foca
          em produtividade e remove as ajudas automáticas.
        </p>
        <div className={styles.buttonGroup}>
          <Button
            variant={navigationMode === "simple" ? "primary" : "ghost"}
            onClick={() => setNavigationMode("simple")}
            style={
              navigationMode === "simple"
                ? {}
                : {
                    borderColor: "var(--primary-main)",
                    color: "var(--primary-main)",
                  }
            }
          >
            Modo Sênior (Acessível)
          </Button>
          <Button
            variant={navigationMode === "advanced" ? "primary" : "ghost"}
            onClick={() => setNavigationMode("advanced")}
            style={
              navigationMode === "advanced"
                ? {}
                : {
                    borderColor: "var(--primary-main)",
                    color: "var(--primary-main)",
                  }
            }
          >
            Modo Avançado (Produtividade)
          </Button>
        </div>
      </div>

      <div>
        <h3 className={styles.sectionTitle}>1. Tamanho da Letra</h3>
        <div className={styles.buttonGroup}>
          <Button
            variant={fontSize === "normal" ? "primary" : "ghost"}
            onClick={() => setFontSize("normal")}
          >
            Letra Normal
          </Button>
          <Button
            variant={fontSize === "large" ? "primary" : "ghost"}
            onClick={() => setFontSize("large")}
          >
            Letra Gigante
          </Button>
        </div>
      </div>

      <div>
        <h3 className={styles.sectionTitle}>2. Cores da Tela (Contraste)</h3>
        <div className={styles.buttonGroup}>
          <Button
            variant={contrast === "normal" ? "primary" : "ghost"}
            onClick={() => setContrast("normal")}
          >
            Cores Claras
          </Button>
          <Button
            variant={contrast === "high" ? "primary" : "ghost"}
            onClick={() => setContrast("high")}
          >
            Fundo Escuro (Alto Contraste)
          </Button>
        </div>
      </div>

      <div>
        <h3 className={styles.sectionTitle}>3. Espaço entre os elementos</h3>
        <div className={styles.buttonGroup}>
          <Button
            variant={spacing === "normal" ? "primary" : "ghost"}
            onClick={() => setSpacing("normal")}
          >
            Espaço Padrão
          </Button>
          <Button
            variant={spacing === "large" ? "primary" : "ghost"}
            onClick={() => setSpacing("large")}
          >
            Mais Espaçado
          </Button>
        </div>
      </div>

      <div>
        <h3 className={styles.sectionTitle}>4. Movimento e Destaque</h3>
        <p className={styles.description}>
          Ative para os botões saltarem mais à vista quando passar o rato.
        </p>
        <div className={styles.buttonGroup}>
          <Button
            variant={visualFeedback === "normal" ? "primary" : "ghost"}
            onClick={() => setVisualFeedback("normal")}
          >
            Padrão
          </Button>
          <Button
            variant={visualFeedback === "enhanced" ? "primary" : "ghost"}
            onClick={() => setVisualFeedback("enhanced")}
          >
            Destaque Reforçado
          </Button>
        </div>
      </div>

      <div>
        <h3 className={styles.sectionTitle}>5. Segurança contra Cliques</h3>
        <p className={styles.description}>
          Se desativar, não perguntaremos "Tem a certeza?" antes de apagar
          itens.
        </p>
        <div className={styles.buttonGroup}>
          <Button
            variant={actionConfirmation === "on" ? "primary" : "ghost"}
            onClick={() => setActionConfirmation("on")}
          >
            Sempre Perguntar (Seguro)
          </Button>
          <Button
            variant={actionConfirmation === "off" ? "danger" : "ghost"}
            onClick={() => setActionConfirmation("off")}
          >
            Apagar Imediatamente
          </Button>
        </div>
      </div>

      <div>
        <h3 className={styles.sectionTitle}>6. Elogios Pessoais</h3>
        <p className={styles.description}>
          O sistema usará o seu nome para dar os parabéns nas mensagens de
          sucesso.
        </p>
        <div className={styles.buttonGroup}>
          <Button
            variant={personalizedMessages === "on" ? "primary" : "ghost"}
            onClick={() => setPersonalizedMessages("on")}
          >
            Ligado
          </Button>
          <Button
            variant={personalizedMessages === "off" ? "danger" : "ghost"}
            onClick={() => setPersonalizedMessages("off")}
          >
            Desligado
          </Button>
        </div>
      </div>
    </section>
  );
};
