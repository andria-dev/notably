import Draft, {
  DraftHandleValue,
  EditorState,
  getDefaultKeyBinding,
  ContentBlock,
  ContentState
} from 'draft-js';
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
  switch (event.key) {
    case '*':
      return 'bold';
    default:
      return getDefaultKeyBinding(event);
  }
}

function* findAllMatches(regex: RegExp, text: string): IterableIterator<[number, number]> {
  let match = regex.exec(text);
  while (match) {
    const start = match.index;
    yield [start, start + match[0].length];

    match = regex.exec(text);
  }
}

function findAllMatchesInCurrentLine(
  regex: RegExp,
  input: string,
  editorState: EditorState
): Array<[number, number]> {
  const selection = editorState.getSelection();

  const blockKey = selection.getStartKey();
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();

  const contentBlock = editorState
    .getCurrentContent()
    .getBlockMap()
    .get(blockKey);

  const previousText = contentBlock.getText();
  const text = previousText.slice(0, start) + input + previousText.slice(end);

  // @ts-ignore
  return [...findAllMatches(regex, text)];
}

export function generateHandleKeyCommand(dispatch: React.Dispatch<IAction>) {
  return (command: string, editorState: EditorState): DraftHandleValue => {
    switch (command) {
      case 'bold':
        const matches = findAllMatchesInCurrentLine(/\*.+?\*/g, '*', editorState);
        if (matches) {
          debugger;
          return 'handled';
        }
        break;
      default:
        break;
    }
    return 'not-handled';
  };
}
