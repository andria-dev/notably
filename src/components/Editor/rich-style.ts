import Draft, { CompositeDecorator } from 'draft-js';
import { headerX } from './custom-blocks/header-x';
import { bold, code, headings, italics } from './strategies';

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

export const blockStyles: Array<{
  label: string;
  type: string;
}> = [
  { label: 'H1', type: 'header-one' },
  { label: 'H2', type: 'header-two' },
  { label: 'H3', type: 'header-three' },
  { label: 'H4', type: 'header-four' },
  { label: 'H5', type: 'header-five' },
  { label: 'H6', type: 'header-six' }
];

export const decorator = new CompositeDecorator([bold, italics, code, ...headings]);
