// src/presentation/store/AccessibilityContext.tsx
'use client'; // Obrigatório no Next.js App Router para usar Context API

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Tipagem Estrita das Preferências (Abolindo o 'any')
export type FontSize = 'normal' | 'large';
export type Contrast = 'normal' | 'high';
export type NavigationMode = 'simple' | 'advanced';

interface AccessibilityState {
  fontSize: FontSize;
  contrast: Contrast;
  navigationMode: NavigationMode;
  setFontSize: (size: FontSize) => void;
  setContrast: (contrast: Contrast) => void;
  setNavigationMode: (mode: NavigationMode) => void;
}

// 2. Estado Inicial de Segurança
const defaultState: AccessibilityState = {
  fontSize: 'normal',
  contrast: 'normal',
  navigationMode: 'simple',
  setFontSize: () => {},
  setContrast: () => {},
  setNavigationMode: () => {},
};

const AccessibilityContext = createContext<AccessibilityState>(defaultState);
const STORAGE_KEY = '@SeniorEase:accessibility';

interface ProviderProps {
  children: ReactNode;
}

// 3. O Provider que vai envelopar a aplicação
export const AccessibilityProvider: React.FC<ProviderProps> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [contrast, setContrastState] = useState<Contrast>('normal');
  const [navigationMode, setNavigationModeState] = useState<NavigationMode>('simple');
  const [isMounted, setIsMounted] = useState(false);

  // A. Carrega as preferências salvas assim que o app monta no navegador
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.fontSize) setFontSizeState(parsed.fontSize);
        if (parsed.contrast) setContrastState(parsed.contrast);
        if (parsed.navigationMode) setNavigationModeState(parsed.navigationMode);
      } catch (error) {
        console.error('Erro ao ler as configurações de acessibilidade:', error);
      }
    }
  }, []);

  // B. Salva no banco e injeta as classes no HTML sempre que o estado mudar
  useEffect(() => {
    if (!isMounted) return;

    const preferences = { fontSize, contrast, navigationMode };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    // Manipulação direta e limpa do DOM raiz
    const htmlElement = document.documentElement;

    if (fontSize === 'large') {
      htmlElement.classList.add('font-large');
    } else {
      htmlElement.classList.remove('font-large');
    }

    if (contrast === 'high') {
      htmlElement.classList.add('contrast-high');
    } else {
      htmlElement.classList.remove('contrast-high');
    }
  }, [fontSize, contrast, navigationMode, isMounted]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        contrast,
        navigationMode,
        setFontSize: setFontSizeState,
        setContrast: setContrastState,
        setNavigationMode: setNavigationModeState,
      }}
    >
      {/* Evita o erro de hidratação do Next.js renderizando apenas após montar */}
      {isMounted ? children : null}
    </AccessibilityContext.Provider>
  );
};

// 4. Hook Customizado para os componentes consumirem o estado facilmente
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
};