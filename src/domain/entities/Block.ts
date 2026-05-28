// src/domain/entities/Block.ts

export type BlockType = 'heading' | 'paragraph' | 'task' | 'meeting';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  content: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}

export interface TaskBlock extends BaseBlock {
  type: 'task';
  content: string;
  isCompleted: boolean;
}

export interface MeetingBlock extends BaseBlock {
  type: 'meeting';
  title: string;
  meetingUrl: string; 
}

// A União Discriminada: um bloco genérico pode ser qualquer um destes
export type ContentBlock = HeadingBlock | ParagraphBlock | TaskBlock | MeetingBlock;