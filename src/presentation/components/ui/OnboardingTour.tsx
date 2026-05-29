// src/presentation/components/ui/OnboardingTour.tsx
import React, { useState, useEffect } from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import { Button } from './Button';
import styles from './OnboardingTour.module.css';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  steps: TourStep[]; // Agora o componente recebe os passos de forma dinâmica!
}

export const OnboardingTour: React.FC<Props> = ({ isOpen, onClose, steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isSpeaking, readText, stop } = useSpeech();

  useEffect(() => {
    if (!isOpen || !steps || steps.length === 0) return;

    // Remove o destaque anterior
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

    // Adiciona o destaque atual
    const step = steps[currentStep];
    if (step) {
      const targetElement = document.getElementById(step.targetId);
      if (targetElement) {
        targetElement.classList.add('tour-highlight');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return () => {
      document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
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
      setCurrentStep(prev => prev + 1);
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
      
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="tour-title">
        <h2 id="tour-title" className={styles.title}>{step.title}</h2>
        <p className={styles.description}>{step.description}</p>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button 
            onClick={() => readText(`${step.title}. ${step.description}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isSpeaking ? '#FEE2E2' : 'var(--primary-surface)', color: isSpeaking ? 'var(--danger-main)' : 'var(--primary-main)', border: 'none', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <span aria-hidden="true" style={{ fontSize: '24px' }}>{isSpeaking ? '⏹️' : '🔊'}</span>
            {isSpeaking ? 'Parar Áudio' : 'Ouvir Instrução'}
          </button>
        </div>

        <div className={styles.footer}>
          <span className={styles.stepIndicator}>
            Passo {currentStep + 1} de {steps.length}
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Button variant="ghost" onClick={handleClose}>
              Pular Tudo
            </Button>
            <Button variant="primary" onClick={handleNext}>
              {isLastStep ? 'Entendi, vamos lá!' : 'Próximo Passo'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};