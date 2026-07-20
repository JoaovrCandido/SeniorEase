// src/presentation/store/AccessibilityContext.spec.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { AccessibilityProvider, useAccessibility } from './AccessibilityContext';

// 1. Criamos um "Componente Espião" que consome o contexto.
// Ele expõe os valores e funções do contexto para o teste poder interagir.
const TestComponent = () => {
  const { navigationMode, setNavigationMode, fontSize, setFontSize } = useAccessibility();

  return (
    <div>
      <span data-testid="nav-mode">{navigationMode}</span>
      <span data-testid="font-size">{fontSize}</span>
      
      <button onClick={() => setNavigationMode('advanced')}>Ativar Avançado</button>
      <button onClick={() => setFontSize('large')}>Letra Gigante</button>
    </div>
  );
};

describe('AccessibilityContext', () => {
  // Antes de cada teste, limpamos a localStorage e os estilos do HTML
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('deve carregar os valores padrão (simple, normal)', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    // O componente espia os valores e mostra-os
    expect(screen.getByTestId('nav-mode').textContent).toBe('simple');
    expect(screen.getByTestId('font-size').textContent).toBe('normal');
  });

  it('deve injetar a classe "theme-advanced" no HTML quando o Modo Avançado é ativado', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const htmlElement = document.documentElement;
    
    // Verifica que NÃO tem a classe no início
    expect(htmlElement.classList.contains('theme-advanced')).toBe(false);

    // Clica no botão do componente falso que chama setNavigationMode('advanced')
    const button = screen.getByText('Ativar Avançado');
    act(() => {
      fireEvent.click(button);
    });

    // Verifica se o estado mudou
    expect(screen.getByTestId('nav-mode').textContent).toBe('advanced');
    
    // O grande teste: verifica se o Contexto injetou a classe no <html>!
    expect(htmlElement.classList.contains('theme-advanced')).toBe(true);
  });

  it('deve salvar as preferências na localStorage quando alteradas', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    // Altera o tamanho da letra
    const button = screen.getByText('Letra Gigante');
    act(() => {
      fireEvent.click(button);
    });

    // Verifica se a localStorage foi atualizada com os dados corretos
    const storedData = localStorage.getItem('@SeniorEase:accessibility');
    expect(storedData).not.toBeNull();
    
    if (storedData) {
      const parsed = JSON.parse(storedData);
      expect(parsed.fontSize).toBe('large');
    }
  });
});