import Draft, { EditorState, RichUtils } from 'draft-js';

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
