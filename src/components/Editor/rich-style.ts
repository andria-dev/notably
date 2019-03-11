import { EditorState, RichUtils } from 'draft-js';
const { toggleInlineStyle } = RichUtils;

function inlineStyle(name: string): (editorState: EditorState) => void {
  return (editorState: EditorState) => {
    toggleInlineStyle(editorState, name);
  };
}

export const bold = inlineStyle('BOLD');
export const italicize = inlineStyle('ITALIC');
export const underline = inlineStyle('UNDERLINE');
export const code = inlineStyle('CODE');
export const strikethrough = inlineStyle('STRIKETHROUGH');

export const styleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through'
  }
};
