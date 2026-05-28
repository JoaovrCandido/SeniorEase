// src/presentation/components/ui/AccessibilityPanel.tsx
import React from 'react';
import { useAccessibility } from '../../store/AccessibilityContext';
import { Button } from './Button'; // Importando o botão que criamos antes

export const AccessibilityPanel: React.FC = () => {
  const { 
    fontSize, setFontSize, 
    contrast, setContrast, 
    spacing, setSpacing 
  } = useAccessibility();

  return (
    <section 
      aria-label="Painel de Personalização de Acessibilidade"
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-soft)',
        marginBottom: 'var(--space-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)'
      }}
    >
      <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--primary-main)', marginBottom: 'var(--space-sm)' }}>
        Ajuste a plataforma para você
      </h2>

      {/* Controle de Fonte */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>Tamanho da Letra</h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button 
            variant={fontSize === 'normal' ? 'primary' : 'ghost'} 
            onClick={() => setFontSize('normal')}
          >
            Letra Normal
          </Button>
          <Button 
            variant={fontSize === 'large' ? 'primary' : 'ghost'} 
            onClick={() => setFontSize('large')}
          >
            Letra Gigante
          </Button>
        </div>
      </div>

      {/* Controle de Contraste */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>Cores da Tela (Contraste)</h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button 
            variant={contrast === 'normal' ? 'primary' : 'ghost'} 
            onClick={() => setContrast('normal')}
          >
            Cores Claras
          </Button>
          <Button 
            variant={contrast === 'high' ? 'primary' : 'ghost'} 
            onClick={() => setContrast('high')}
          >
            Fundo Escuro (Alto Contraste)
          </Button>
        </div>
      </div>

      {/* Controle de Espaçamento */}
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)' }}>Espaço entre os elementos</h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button 
            variant={spacing === 'normal' ? 'primary' : 'ghost'} 
            onClick={() => setSpacing('normal')}
          >
            Espaço Padrão
          </Button>
          <Button 
            variant={spacing === 'large' ? 'primary' : 'ghost'} 
            onClick={() => setSpacing('large')}
          >
            Mais Espaçado
          </Button>
        </div>
      </div>

    </section>
  );
};