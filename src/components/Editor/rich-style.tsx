// tslint:disable: ordered-imports
import React from 'react';
import { Node, Block } from 'slate';

import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
// import Prism from 'prismjs';

// @ts-ignore
import PluginEditCode from 'slate-edit-code';
// @ts-ignore
import PluginPrism from 'slate-prism';

import 'prismjs/themes/prism-okaidia.css';

// export const styleMap = {
//   ...DefaultDraftInlineStyle,
//   BOLD: {
//     fontWeight: '800'
//   },
//   STRIKETHROUGH: {
//     textDecoration: 'line-through'
//   },
//   CODE: {
//     backgroundColor: 'hsl(0, 0%, 95%)',
//     fontSize: '1rem',
//     fontFamily: '"Roboto Mono",Menlo,Monaco,"Courier New",Courier,monospace',
//     borderRadius: '0.12rem'
//   }
// };

const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
export function hasCommandModifier(event: React.KeyboardEvent<{}>): boolean {
  return isMac && !event.altKey && (event.metaKey || event.ctrlKey);
}

export const plugins = [
  PluginPrism({
    onlyIn: (block: Block) => block.type === 'code-block',
    getSyntax: (block: Block) => block.data.get('syntax')
  }),
  PluginEditCode({
    onlyIn: (block: Block) => block.type === 'code-block'
  })
];

export function renderNode(props: any, editor: any, next: CallableFunction) {
  const { node, attributes, children } = props;

  switch (node.type) {
    case 'code-block':
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      );
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    case 'heading':
      return <h1 {...attributes}>{children}</h1>;
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'unordered-list-item':
      return <li {...attributes}>{children}</li>;
    case 'ordered-list-item':
      return <ol {...attributes}>{children}</ol>;
    default:
      return next();
  }
}
