// src/presentation/components/ui/Input.tsx
import React, { InputHTMLAttributes, useId } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  // Gera um ID único acessível caso não seja passado um
  const defaultId = useId();
  const inputId = id || defaultId;

  return (
    <div className={`${styles.container} ${className || ''}`.trim()}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input 
        id={inputId} 
        className={styles.input} 
        {...props} 
      />
    </div>
  );
};