import Draft, {
  DraftHandleValue,
  EditorState,
  getDefaultKeyBinding,
  ContentBlock,
  ContentState,
  RichUtils
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

const isMac = navigator.platform.includes('Mac');
export function generateKeyBindingFn(editorState: EditorState, dispatch: React.Dispatch<IAction>) {
  return function keyBindingFn(event: KeyboardEvent<{}>): string | null {
    switch (event.key) {
      case '*':
        const matches = findAllMatchesInCurrentLine(/\*.+?\*/g, '*', editorState);
        if (matches.indices.length) {
          for (const [start, end] of matches.indices) {
            dispatch({
              type: 'inline',
              payload: {
                key: matches.key,
                start,
                end,
                style: 'BOLD'
              }
            });
          }
          return 'handled';
        }
      case 'b':
        if ((isMac && event.metaKey) || (!isMac && event.ctrlKey)) {
          dispatch({
            type: 'inline',
            payload: {
              style: 'bold'
            }
          });
          return null;
        }
      default:
        break;
    }

    const defaultBinding = getDefaultKeyBinding(event);
    if (
      defaultBinding &&
      defaultBinding in
        ['delete', 'delete-word', 'backspace', 'backspace-word', 'backspace-to-start-of-line']
    ) {
      // run checks
    }
    return defaultBinding;
  };
}

function findAllMatches(regex: RegExp, text: string): Array<[number, number]> {
  const matches: Array<[number, number]> = [];
  let match = regex.exec(text);
  while (match) {
    const start = match.index;
    matches.push([start, start + match[0].length]);

    match = regex.exec(text);
  }
  return matches;
}

function findAllMatchesInCurrentLine(
  regex: RegExp,
  input: string,
  editorState: EditorState
): {
  indices: Array<[number, number]>;
  key: string;
} {
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

  return {
    indices: findAllMatches(regex, text).map(
      ([s, e]): [number, number] => [s, e > end ? e - input.length : e]
    ),
    key: blockKey
  };
}
