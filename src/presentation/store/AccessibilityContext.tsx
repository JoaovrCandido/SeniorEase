// src/presentation/store/AccessibilityContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type FontSize = "normal" | "large";
export type Contrast = "normal" | "high";
export type Spacing = "normal" | "large";
export type NavigationMode = "simple" | "advanced";
export type VisualFeedback = "normal" | "enhanced";
export type ActionConfirmation = "on" | "off";
export type PersonalizedMessages = "on" | "off"; // <-- NOVO

interface AccessibilityState {
  fontSize: FontSize;
  contrast: Contrast;
  spacing: Spacing;
  navigationMode: NavigationMode;
  visualFeedback: VisualFeedback;
  actionConfirmation: ActionConfirmation;
  personalizedMessages: PersonalizedMessages; // <-- NOVO
  setFontSize: (size: FontSize) => void;
  setContrast: (contrast: Contrast) => void;
  setSpacing: (spacing: Spacing) => void;
  setNavigationMode: (mode: NavigationMode) => void;
  setVisualFeedback: (vf: VisualFeedback) => void;
  setActionConfirmation: (ac: ActionConfirmation) => void;
  setPersonalizedMessages: (pm: PersonalizedMessages) => void; // <-- NOVO
}

const defaultState: AccessibilityState = {
  fontSize: "normal",
  contrast: "normal",
  spacing: "normal",
  navigationMode: "simple",
  visualFeedback: "normal",
  actionConfirmation: "on",
  personalizedMessages: "on", // <-- NOVO
  setFontSize: () => {},
  setContrast: () => {},
  setSpacing: () => {},
  setNavigationMode: () => {},
  setVisualFeedback: () => {},
  setActionConfirmation: () => {},
  setPersonalizedMessages: () => {}, // <-- NOVO
};

const AccessibilityContext = createContext<AccessibilityState>(defaultState);
const STORAGE_KEY = "@SeniorEase:accessibility";

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");
  const [contrast, setContrastState] = useState<Contrast>("normal");
  const [spacing, setSpacingState] = useState<Spacing>("normal");
  const [navigationMode, setNavigationModeState] = useState<NavigationMode>("simple");
  const [visualFeedback, setVisualFeedbackState] = useState<VisualFeedback>("normal");
  const [actionConfirmation, setActionConfirmationState] = useState<ActionConfirmation>("on");
  const [personalizedMessages, setPersonalizedMessagesState] = useState<PersonalizedMessages>("on"); // <-- NOVO
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
        if (parsed.visualFeedback) setVisualFeedbackState(parsed.visualFeedback);
        if (parsed.actionConfirmation) setActionConfirmationState(parsed.actionConfirmation);
        if (parsed.personalizedMessages) setPersonalizedMessagesState(parsed.personalizedMessages); // <-- NOVO
      } catch (error) {
        console.error("Erro ao ler configurações de acessibilidade:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const preferences = {
      fontSize,
      contrast,
      spacing,
      navigationMode,
      visualFeedback,
      actionConfirmation,
      personalizedMessages, // <-- NOVO
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    const htmlElement = document.documentElement;

    htmlElement.classList.toggle("font-large", fontSize === "large");
    htmlElement.classList.toggle("contrast-high", contrast === "high");
    htmlElement.classList.toggle("spacing-large", spacing === "large");
    htmlElement.classList.toggle("visual-feedback-enhanced", visualFeedback === "enhanced");
  }, [
    fontSize,
    contrast,
    spacing,
    navigationMode,
    visualFeedback,
    actionConfirmation,
    personalizedMessages, // <-- NOVO
    isMounted,
  ]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        contrast,
        spacing,
        navigationMode,
        visualFeedback,
        actionConfirmation,
        personalizedMessages, // <-- NOVO
        setFontSize: setFontSizeState,
        setContrast: setContrastState,
        setSpacing: setSpacingState,
        setNavigationMode: setNavigationModeState,
        setVisualFeedback: setVisualFeedbackState,
        setActionConfirmation: setActionConfirmationState,
        setPersonalizedMessages: setPersonalizedMessagesState, // <-- NOVO
      }}
    >
      {isMounted ? children : null}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context)
    throw new Error("useAccessibility deve ser usado dentro do Provider");
  return context;
};