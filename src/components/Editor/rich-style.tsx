// tslint:disable: ordered-imports
import React from 'react';
import { Block, Editor } from 'slate';
import { isKeyHotkey } from 'is-hotkey';

// @ts-ignore
import PluginEditCode from 'slate-edit-code';
// @ts-ignore
import PluginPrism from 'slate-prism';

import 'prismjs/themes/prism-okaidia.css';

export const plugins = [
  PluginPrism({
    onlyIn: (block: Block) => block.type === 'code-block',
    getSyntax: (block: Block) => block.data.get('syntax')
  }),
  PluginEditCode({
    onlyIn: (block: Block) => block.type === 'code-block'
  })
];

export function renderNode(props: any, editor: Editor, next: CallableFunction) {
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
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'ordered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return next();
  }
}

const codeStyle = {
  backgroundColor: 'hsl(0, 0%, 95%)',
  fontSize: '1rem',
  fontFamily: '"Roboto Mono",Menlo,Monaco,"Courier New",Courier,monospace',
  borderRadius: '0.12rem'
};

export function renderMark(props: any, editor: Editor, next: () => any) {
  const { mark, attributes, children } = props;

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>;
    case 'code':
      return (
        <code {...attributes} style={codeStyle}>
          {children}
        </code>
      );
    case 'italic':
      return <em {...attributes}>{children}</em>;
    case 'underlined':
      return <u {...attributes}>{children}</u>;
    case 'deleted':
      return <del {...attributes}>{children}</del>;
    case 'inserted':
      return <ins {...attributes}>{children}</ins>;
    default:
      return next();
  }
}

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');
const isDeletedHotkey = isKeyHotkey('mod+shift+backspace');
const isInsertedHotkey = isKeyHotkey('mod+shift+enter');

export function onKeyDown(event: any, editor: Editor, next: () => any) {
  let mark;

  if (isBoldHotkey(event)) {
    mark = 'bold';
  } else if (isItalicHotkey(event)) {
    mark = 'italic';
  } else if (isUnderlinedHotkey(event)) {
    mark = 'underlined';
  } else if (isCodeHotkey(event)) {
    mark = 'code';
  } else if (isDeletedHotkey(event)) {
    mark = 'deleted';
  } else if (isInsertedHotkey(event)) {
    mark = 'inserted';
  } else {
    console.log(event, 'NEXT');
    return next();
  }

  event.preventDefault();
  editor.toggleMark(mark);
}
