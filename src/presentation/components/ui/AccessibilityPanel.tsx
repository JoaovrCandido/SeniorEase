// src/presentation/components/ui/AccessibilityPanel.tsx
import React from 'react';
import { useAccessibility } from '../../store/AccessibilityContext';
import { Button } from './Button'; 

export const AccessibilityPanel: React.FC = () => {
  const { 
    fontSize, setFontSize, 
    contrast, setContrast, 
    spacing, setSpacing,
    visualFeedback, setVisualFeedback,
    actionConfirmation, setActionConfirmation
  } = useAccessibility();

  return (
    <section 
      aria-label="Painel de Personalização de Acessibilidade"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}
    >
      {/* Controle de Fonte */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>1. Tamanho da Letra</h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button variant={fontSize === 'normal' ? 'primary' : 'ghost'} onClick={() => setFontSize('normal')}>Letra Normal</Button>
          <Button variant={fontSize === 'large' ? 'primary' : 'ghost'} onClick={() => setFontSize('large')}>Letra Gigante</Button>
        </div>
      </div>

      {/* Controle de Contraste */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>2. Cores da Tela (Contraste)</h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button variant={contrast === 'normal' ? 'primary' : 'ghost'} onClick={() => setContrast('normal')}>Cores Claras</Button>
          <Button variant={contrast === 'high' ? 'primary' : 'ghost'} onClick={() => setContrast('high')}>Fundo Escuro (Alto Contraste)</Button>
        </div>
      </div>

      {/* Controle de Espaçamento */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>3. Espaço entre os elementos</h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button variant={spacing === 'normal' ? 'primary' : 'ghost'} onClick={() => setSpacing('normal')}>Espaço Padrão</Button>
          <Button variant={spacing === 'large' ? 'primary' : 'ghost'} onClick={() => setSpacing('large')}>Mais Espaçado</Button>
        </div>
      </div>

      {/* Controle de Feedback Visual */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>4. Movimento e Destaque</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', marginBottom: '8px' }}>Ative para os botões saltarem mais à vista quando passar o rato.</p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button variant={visualFeedback === 'normal' ? 'primary' : 'ghost'} onClick={() => setVisualFeedback('normal')}>Padrão</Button>
          <Button variant={visualFeedback === 'enhanced' ? 'primary' : 'ghost'} onClick={() => setVisualFeedback('enhanced')}>Destaque Reforçado</Button>
        </div>
      </div>

      {/* Controle de Segurança */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>5. Segurança contra Cliques</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', marginBottom: '8px' }}>Se desativar, não perguntaremos "Tem a certeza?" antes de apagar itens.</p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button variant={actionConfirmation === 'on' ? 'primary' : 'ghost'} onClick={() => setActionConfirmation('on')}>Sempre Perguntar (Seguro)</Button>
          <Button variant={actionConfirmation === 'off' ? 'danger' : 'ghost'} onClick={() => setActionConfirmation('off')}>Apagar Imediatamente</Button>
        </div>
      </div>

    </section>
  );
};