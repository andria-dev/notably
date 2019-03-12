import Draft, { EditorState, RichUtils } from 'draft-js';

function createInlineStyle(name: string): (editorState: EditorState) => EditorState {
  return (editorState: EditorState) => RichUtils.toggleInlineStyle(editorState, name);
}

export const inlineStyles: Array<[string, (editorState: EditorState) => EditorState]> = [
  ['bold', createInlineStyle('BOLD')],
  ['italics', createInlineStyle('ITALIC')],
  ['underline', createInlineStyle('UNDERLINE')],
  ['code', createInlineStyle('CODE')],
  ['strikethrough', createInlineStyle('STRIKETHROUGH')]
];

export const styleMap = {
  ...Draft.DefaultDraftInlineStyle,
  STRIKETHROUGH: {
    textDecoration: 'line-through',
    textDecorationColor: 'black',
    color: 'hsl(0, 0%, 70%)'
  },
  CODE: {
    padding: '0 0.2rem',
    backgroundColor: 'hsl(0, 0%, 95%)',
    fontSize: '1rem',
    fontFamily: 'Menlo,Monaco,"Courier New",Courier,monospace',
    borderRadius: '0.12rem'
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
