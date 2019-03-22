import Draft, { DefaultDraftInlineStyle, ContentBlock } from 'draft-js';
import React from 'react';

// @ts-ignore
import MultiDecorator from 'draft-js-multidecorators';
// @ts-ignore
import PrismDecorator from 'draft-js-prism';
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
  defaultSyntax: 'javascript'
});

const CodeBlock = (props: any) => {
  console.log(props, 'CodeBlock rendered');
  return <pre className="language-javascript">{props.children}</pre>;
};

export const blockRenderMap = Draft.DefaultDraftBlockRenderMap.merge({
  // 'code-block': {
  //   element: 'pre',
  //   wrapper: <CodeBlock />
  // }
});
