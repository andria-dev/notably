import Draft, { EditorState, RichUtils, CompositeDecorator } from 'draft-js';
import { headerX } from './custom-blocks/header-x';
import { bold, headings } from './strategies';

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
  'header-one': {
    element: headerX(1)
  },
  'header-two': {
    element: headerX(2)
  },
  'header-three': {
    element: headerX(3)
  },
  'header-four': {
    element: headerX(4)
  },
  'header-five': {
    element: headerX(5)
  },
  'header-six': {
    element: headerX(6)
  },
  'check-list': {}
});

export const decorator = new CompositeDecorator([bold, ...headings]);
