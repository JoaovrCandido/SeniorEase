// src/presentation/components/blocks/HeadingBlockUI.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeadingBlockUI } from './HeadingBlockUI';
import { HeadingBlock } from '../../../domain/entities/Block';

// Mocks dos botões complexos
vi.mock('../ui/DictationButton', () => ({ DictationButton: () => <div data-testid="mic" /> }));
vi.mock('../ui/EmojiPicker', () => ({ EmojiPicker: () => <div data-testid="emoji" /> }));

describe('HeadingBlockUI', () => {
  const mockBlock: HeadingBlock = {
    id: 'h-1',
    type: 'heading',
    content: 'Meu Título',
  };

  it('deve renderizar o conteúdo do bloco no input', () => {
    render(<HeadingBlockUI block={mockBlock} onDelete={vi.fn()} onChangeContent={vi.fn()} />);
    const input = screen.getByDisplayValue('Meu Título');
    expect(input).toBeInTheDocument();
  });

  it('deve chamar onChangeContent apenas quando o campo perde o foco (onBlur) se houver alteração', () => {
    const mockOnChange = vi.fn();
    render(<HeadingBlockUI block={mockBlock} onDelete={vi.fn()} onChangeContent={mockOnChange} />);
    
    const input = screen.getByDisplayValue('Meu Título');
    
    // Digita
    fireEvent.change(input, { target: { value: 'Título Novo' } });
    expect(mockOnChange).not.toHaveBeenCalled(); // Não deve chamar logo

    // Tira o rato/foco do input
    fireEvent.blur(input);
    expect(mockOnChange).toHaveBeenCalledWith('h-1', 'Título Novo');
  });

  it('deve chamar onMoveUp, onMoveDown e onDelete corretamente', () => {
    const mockUp = vi.fn();
    const mockDown = vi.fn();
    const mockDelete = vi.fn();

    render(
      <HeadingBlockUI 
        block={mockBlock} 
        onMoveUp={mockUp} 
        onMoveDown={mockDown} 
        onDelete={mockDelete} 
        onChangeContent={vi.fn()} 
      />
    );

    fireEvent.click(screen.getByLabelText('Mover para cima'));
    expect(mockUp).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Mover para baixo'));
    expect(mockDown).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Apagar Título'));
    expect(mockDelete).toHaveBeenCalledWith('h-1');
  });
});