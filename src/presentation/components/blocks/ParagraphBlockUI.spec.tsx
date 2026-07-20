// src/presentation/components/blocks/ParagraphBlockUI.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ParagraphBlockUI } from './ParagraphBlockUI';
import { ParagraphBlock } from '../../../domain/entities/Block';

vi.mock('../ui/DictationButton', () => ({ DictationButton: () => <div /> }));
vi.mock('../ui/EmojiPicker', () => ({ EmojiPicker: () => <div /> }));

describe('ParagraphBlockUI', () => {
  const mockBlock: ParagraphBlock = {
    id: 'p-1',
    type: 'paragraph',
    content: 'Uma anotação importante.',
  };

  it('deve atualizar o conteúdo e chamar onChangeContent ao perder o foco', () => {
    const mockOnChange = vi.fn();
    render(<ParagraphBlockUI block={mockBlock} onDelete={vi.fn()} onChangeContent={mockOnChange} />);
    
    const textarea = screen.getByDisplayValue('Uma anotação importante.');
    
    fireEvent.change(textarea, { target: { value: 'Anotação editada.' } });
    fireEvent.blur(textarea);
    
    expect(mockOnChange).toHaveBeenCalledWith('p-1', 'Anotação editada.');
  });
});