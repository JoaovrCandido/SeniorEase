// src/presentation/store/AccessibilityContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSize = 'normal' | 'large';
export type Contrast = 'normal' | 'high';
export type Spacing = 'normal' | 'large'; // <-- NOVA PROPRIEDADE
export type NavigationMode = 'simple' | 'advanced';

interface AccessibilityState {
  fontSize: FontSize;
  contrast: Contrast;
  spacing: Spacing;
  navigationMode: NavigationMode;
  setFontSize: (size: FontSize) => void;
  setContrast: (contrast: Contrast) => void;
  setSpacing: (spacing: Spacing) => void;
  setNavigationMode: (mode: NavigationMode) => void;
}

const defaultState: AccessibilityState = {
  fontSize: 'normal',
  contrast: 'normal',
  spacing: 'normal',
  navigationMode: 'simple',
  setFontSize: () => {},
  setContrast: () => {},
  setSpacing: () => {},
  setNavigationMode: () => {},
};

const AccessibilityContext = createContext<AccessibilityState>(defaultState);
const STORAGE_KEY = '@SeniorEase:accessibility';

export const AccessibilityProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [contrast, setContrastState] = useState<Contrast>('normal');
  const [spacing, setSpacingState] = useState<Spacing>('normal');
  const [navigationMode, setNavigationModeState] = useState<NavigationMode>('simple');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.fontSize) setFontSizeState(parsed.fontSize);
        if (parsed.contrast) setContrastState(parsed.contrast);
        if (parsed.spacing) setSpacingState(parsed.spacing);
        if (parsed.navigationMode) setNavigationModeState(parsed.navigationMode);
      } catch (error) {
        console.error('Erro ao ler configurações de acessibilidade:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const preferences = { fontSize, contrast, spacing, navigationMode };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    const htmlElement = document.documentElement;

    // Aplica as classes no HTML para o CSS reagir
    htmlElement.classList.toggle('font-large', fontSize === 'large');
    htmlElement.classList.toggle('contrast-high', contrast === 'high');
    htmlElement.classList.toggle('spacing-large', spacing === 'large');

  }, [fontSize, contrast, spacing, navigationMode, isMounted]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize, contrast, spacing, navigationMode,
        setFontSize: setFontSizeState,
        setContrast: setContrastState,
        setSpacing: setSpacingState,
        setNavigationMode: setNavigationModeState,
      }}
    >
      {isMounted ? children : null}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility deve ser usado dentro do Provider');
  return context;
};