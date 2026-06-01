// src/presentation/components/ui/OnboardingTour.tsx
import React, { useState, useEffect } from "react";
import { useSpeech } from "../../hooks/useSpeech";
import { Button } from "./Button";
import { SoundIcon, StopIcon } from "./Icons";
import styles from "./OnboardingTour.module.css";

export interface TourStep {
  targetId: string;
  title: string;
  description: React.ReactNode; // Agora aceita HTML/Ícones!
  audioText?: string; // Texto específico para o leitor de voz
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

        const rect = targetElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let vPos = "bottom";
        let hPos = "Center";
        let scrollBlock: ScrollLogicalPosition = "start";

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

        if (viewportWidth < 768 || rect.width > viewportWidth * 0.6) {
          hPos = "Center";
        } else if (rect.left + rect.width / 2 < viewportWidth / 2) {
          hPos = "Right";
        } else {
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

  const positionClass =
    styles[
      `dialog${dialogPosition.charAt(0).toUpperCase() + dialogPosition.slice(1)}`
    ];

  // Define o que será lido em voz alta (usa o audioText se existir, senão usa a string normal)
  const textToRead = step.audioText
    ? `${step.title}. ${step.audioText}`
    : `${step.title}. ${typeof step.description === "string" ? step.description : ""}`;

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

        {/* Agora renderizamos a descrição dentro de uma div em vez de <p> para suportar formatações complexas */}
        <div className={styles.description}>{step.description}</div>

        <div className={styles.audioControls}>
          <button
            onClick={() => readText(textToRead)}
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
