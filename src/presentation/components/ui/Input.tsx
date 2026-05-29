// src/presentation/components/ui/Input.tsx
import React, { InputHTMLAttributes, useId } from 'react';
import { DictationButton } from './DictationButton';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onDictate?: (text: string) => void;
}

export const Input: React.FC<InputProps> = ({ label, id, className, onDictate, ...props }) => {
  const defaultId = useId();
  const inputId = id || defaultId;

  return (
    <div className={`${styles.container} ${className || ''}`.trim()}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <input id={inputId} className={styles.input} style={{ flexGrow: 1 }} {...props} />
        {/* Se o botão for ativado pelo componente pai, a magia aparece! */}
        {onDictate && <DictationButton onDictate={onDictate} title={`Ditar ${label.toLowerCase()}`} />}
      </div>
    </div>
  );
};