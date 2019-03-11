import Draft, { EditorState, RichUtils } from 'draft-js';

function createInlineStyle(name: string): (editorState: EditorState) => EditorState {
  return (editorState: EditorState) => RichUtils.toggleInlineStyle(editorState, name);
}

export const inlineStyles = [
  ['bold', createInlineStyle('BOLD')],
  ['italics', createInlineStyle('ITALIC')],
  ['underline', createInlineStyle('UNDERLINE')],
  ['code', createInlineStyle('CODE')],
  ['strikethrough', createInlineStyle('STRIKETHROUGH')]
];

export const styleMap = {
  ...Draft.DefaultDraftInlineStyle,
  STRIKETHROUGH: {
    textDecoration: 'line-through'
  }
};

// @ts-ignore
export const blockRenderMap = Draft.DefaultDraftBlockRenderMap.merge({
  'header-one': {},
  'header-two': {},
  'header-three': {},
  'header-four': {},
  'header-five': {},
  'header-six': {},
  'check-list': {}
});
