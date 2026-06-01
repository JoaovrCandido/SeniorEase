// src/presentation/components/ui/OnboardingTour.tsx
import React, { useState, useEffect } from "react";
import { useSpeech } from "../../hooks/useSpeech";
import { Button } from "./Button";
import { SoundIcon, StopIcon } from "./Icons";
import styles from "./OnboardingTour.module.css";

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  steps: TourStep[];
}

type DialogPosition =
  | "center"
  | "topCenter"
  | "bottomCenter"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export const OnboardingTour: React.FC<Props> = ({ isOpen, onClose, steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isSpeaking, readText, stop } = useSpeech();

  // Estado que controla o quadrante exato do modal
  const [dialogPosition, setDialogPosition] =
    useState<DialogPosition>("bottomCenter");

  useEffect(() => {
    if (!isOpen || !steps || steps.length === 0) return;

    const cleanupHighlights = () => {
      document.querySelectorAll(".tour-highlight").forEach((el) => {
        el.classList.remove("tour-highlight");
        const htmlEl = el as HTMLElement;
        if (htmlEl.dataset.tourPosFixed) {
          htmlEl.style.position = "";
          delete htmlEl.dataset.tourPosFixed;
        }
      });
    };

    cleanupHighlights();

    const step = steps[currentStep];
    if (step) {
      const targetElement = document.getElementById(step.targetId);
      if (targetElement) {
        targetElement.classList.add("tour-highlight");

        const computedStyle = window.getComputedStyle(targetElement);
        if (computedStyle.position === "static") {
          targetElement.style.position = "relative";
          targetElement.dataset.tourPosFixed = "true";
        }

        // LÓGICA DE POSICIONAMENTO EM QUADRANTES
        const rect = targetElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let vPos = "bottom";
        let hPos = "Center";
        let scrollBlock: ScrollLogicalPosition = "start";

        // 1. Eixo Vertical (Cima / Baixo)
        if (
          rect.top + rect.height / 2 > viewportHeight / 2 ||
          step.targetId.includes("add") ||
          step.targetId.includes("bottom")
        ) {
          vPos = "top";
          scrollBlock = "end";
        } else {
          vPos = "bottom";
          scrollBlock = "start";
        }

        // 2. Eixo Horizontal (Esquerda / Direita)
        // Se a tela for pequena (telemóvel) ou o elemento for muito largo (barras), mantemos centrado
        if (viewportWidth < 768 || rect.width > viewportWidth * 0.6) {
          hPos = "Center";
        } else if (rect.left + rect.width / 2 < viewportWidth / 2) {
          // O elemento está na Esquerda -> O Modal foge para a Direita
          hPos = "Right";
        } else {
          // O elemento está na Direita -> O Modal foge para a Esquerda
          hPos = "Left";
        }

        const calculatedPosition = `${vPos}${hPos}` as DialogPosition;
        setDialogPosition(calculatedPosition);

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: scrollBlock,
        });
      } else {
        setDialogPosition("center");
      }
    }

    return () => {
      cleanupHighlights();
      stop();
    };
  }, [currentStep, isOpen, steps, stop]);

  if (!isOpen || !steps || steps.length === 0) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    stop();
    if (isLastStep) {
      onClose();
      setCurrentStep(0);
      setDialogPosition("bottomCenter");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    stop();
    onClose();
    setCurrentStep(0);
    setDialogPosition("bottomCenter");
  };

  // Mapeamento dinâmico da classe CSS
  const positionClass =
    styles[
      `dialog${dialogPosition.charAt(0).toUpperCase() + dialogPosition.slice(1)}`
    ];

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />

      <div
        className={`${styles.dialog} ${positionClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        <h2 id="tour-title" className={styles.title}>
          {step.title}
        </h2>
        <p className={styles.description}>{step.description}</p>

        <div className={styles.audioControls}>
          <button
            onClick={() => readText(`${step.title}. ${step.description}`)}
            className={`${styles.audioButton} ${isSpeaking ? styles.audioButtonSpeaking : ""}`}
          >
            <div className={styles.iconWrapper}>
              {isSpeaking ? <StopIcon /> : <SoundIcon />}
            </div>
            {isSpeaking ? "Parar Áudio" : "Ouvir Instrução"}
          </button>
        </div>

        <div className={styles.footer}>
          <span className={styles.stepIndicator}>
            Passo {currentStep + 1} de {steps.length}
          </span>
          <div className={styles.actionButtons}>
            <Button variant="ghost" onClick={handleClose}>
              Pular Tudo
            </Button>
            <Button variant="primary" onClick={handleNext}>
              {isLastStep ? "Entendi, vamos lá!" : "Próximo Passo"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
