import Draft, { ContentBlock, DefaultDraftInlineStyle } from 'draft-js';
import { Map } from 'immutable';
import React from 'react';

// @ts-ignore
import PrismDecorator from 'draft-js-prism';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import Prism from 'prismjs';

import 'prismjs/themes/prism-okaidia.css';

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
  ...DefaultDraftInlineStyle,
  BOLD: {
    fontWeight: '800'
  },
  STRIKETHROUGH: {
    textDecoration: 'line-through'
  },
  CODE: {
    backgroundColor: 'hsl(0, 0%, 95%)',
    fontSize: '1rem',
    fontFamily: '"Roboto Mono",Menlo,Monaco,"Courier New",Courier,monospace',
    borderRadius: '0.12rem'
  }
};

const isOSX = navigator.platform.includes('Mac');
export function hasCommandModifier(event: React.KeyboardEvent<{}>): boolean {
  return isOSX ? event.metaKey && !event.altKey : event.ctrlKey && !event.altKey;
}

export const decorator = new PrismDecorator({
  prism: Prism,
  defaultSyntax: 'tsx'
});

const CodeBlock = (props: any) => {
  return <pre className="language-tsx Editor__code-block">{props.children}</pre>;
};

export const blockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(
  Map({
    'code-block': {
      element: 'pre',
      wrapper: <CodeBlock />
    }
  })
);
