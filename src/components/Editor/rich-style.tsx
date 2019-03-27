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
  })
];

/**
 * Renders different nodes as React elements for Slate based on their node-type.
 */
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

/**
 * Returns the block-type for any block-shortcut.
 */
function getType(chars: string) {
  switch (chars) {
    case '*':
    case '-':
      return 'unordered-list';
    case '1.':
      return 'ordered-list';
    case '>':
      return 'block-quote';
    case '#':
      return 'heading-one';
    case '##':
      return 'heading-two';
    case '###':
      return 'heading-three';
    case '####':
      return 'heading-four';
    case '#####':
      return 'heading-five';
    case '######':
      return 'heading-six';
    default:
      return null;
  }
}

/**
 * On space, if it was after a block-shortcut (i.e. `> ` is a blockquote),
 * convert the current node into the shortcut's corresponding type.
 */
function onSpace(event: Event, editor: Editor, next: () => any) {
  const selection = editor.value.selection;
  if (selection.isExpanded) {
    return next();
  }

  const startBlock = editor.value.startBlock;
  const type = getType(startBlock.text.slice(0, selection.start.offset).replace(/\s*/g, ''));
  if (!type || (type === 'unordered-list' && startBlock.type === 'unordered-list')) {
    return next();
  }

  event.preventDefault();

  if (type.includes('list')) {
    editor.wrapBlock(type);
    editor.setBlocks('list-item');
  } else {
    editor.setBlocks(type);
  }

  editor.moveFocusToStartOfNode(startBlock).delete();
}

/**
 * Renders different marks as React elements based on their mark-types.
 */
export function renderMark(props: any, editor: Editor, next: () => any) {
  const { mark, attributes, children } = props;

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>;
    case 'code':
      return (
        <code {...attributes} className="Editor__code">
          {children}
        </code>
      );
    case 'italic':
      return <em {...attributes}>{children}</em>;
    case 'underlined':
      return <u {...attributes}>{children}</u>;
    case 'deleted':
      return (
        <del {...attributes} className="Editor__del">
          {children}
        </del>
      );
    case 'inserted':
      return (
        <ins {...attributes} className="Editor__ins">
          {children}
        </ins>
      );
    default:
      return next();
  }
}

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+j');
const isDeletedHotkey = isKeyHotkey('mod+shift+backspace');
const isInsertedHotkey = isKeyHotkey('mod+shift+enter');

/**
 * Handles key-down events and applies different mark and node-types
 * based on the keys pressed. Offloads enter and backspace to
 * `onEnter` and `onBackspace`.
 */
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
    return next();
  }

  event.preventDefault();
  editor.toggleMark(mark);

  // disallows having both deleted and inserted
  if (mark === 'deleted') {
    editor.removeMark('inserted');
  } else if (mark === 'inserted') {
    editor.removeMark('deleted');
  }
}
