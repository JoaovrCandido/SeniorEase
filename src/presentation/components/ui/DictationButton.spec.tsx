// src/presentation/components/ui/DictationButton.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DictationButton } from './DictationButton';

const mockStart = vi.fn();
const mockStop = vi.fn();
let mockIsListening = false;

vi.mock('../../hooks/useDictation', () => ({
  useDictation: () => ({
    isListening: mockIsListening,
    startListening: mockStart,
    stopListening: mockStop,
  }),
}));

describe('DictationButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsListening = false;
  });

  it('deve chamar startListening quando clicado e não está a ouvir', () => {
    const onDictate = vi.fn();
    render(<DictationButton onDictate={onDictate} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockStart).toHaveBeenCalledWith(onDictate);
  });

  it('deve chamar stopListening se for clicado enquanto já está a ouvir', () => {
    mockIsListening = true; // Forçamos o estado para ouvir
    
    render(<DictationButton onDictate={vi.fn()} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockStop).toHaveBeenCalled();
  });
});