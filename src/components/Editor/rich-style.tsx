import Draft, { DraftHandleValue, EditorState, getDefaultKeyBinding } from 'draft-js';
import React, { KeyboardEvent } from 'react';
import { IAction } from '../../store';

export const inlineStyles: Array<{
  label: string;
  style: string;
}> = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italics', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Code', style: 'CODE' },
  { label: 'Strikethrough', style: 'STRIKETHROUGH' }
];

export const styleMap = {
  ...Draft.DefaultDraftInlineStyle,
  STRIKETHROUGH: {
    textDecoration: 'line-through'
  },
  CODE: {
    backgroundColor: 'hsl(0, 0%, 95%)',
    fontSize: '1rem',
    fontFamily: 'Menlo,Monaco,"Courier New",Courier,monospace',
    borderRadius: '0.12rem'
  }
};

export function keyBindingFn(event: KeyboardEvent<{}>): string | null {
  return getDefaultKeyBinding(event);
}

export function generateHandleKeyCommand(dispatch: React.Dispatch<IAction>) {
  return (command: string, editorState: EditorState): DraftHandleValue => {
    switch (command) {
      case 'bold':
        break;

      default:
        break;
    }

    return 'not-handled';
  };
}
