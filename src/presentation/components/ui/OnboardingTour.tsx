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

export const OnboardingTour: React.FC<Props> = ({ isOpen, onClose, steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isSpeaking, readText, stop } = useSpeech();

  useEffect(() => {
    if (!isOpen || !steps || steps.length === 0) return;

    document
      .querySelectorAll(".tour-highlight")
      .forEach((el) => el.classList.remove("tour-highlight"));

    const step = steps[currentStep];
    if (step) {
      const targetElement = document.getElementById(step.targetId);
      if (targetElement) {
        targetElement.classList.add("tour-highlight");
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return () => {
      document
        .querySelectorAll(".tour-highlight")
        .forEach((el) => el.classList.remove("tour-highlight"));
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
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    stop();
    onClose();
    setCurrentStep(0);
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />

      <div
        className={styles.dialog}
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
