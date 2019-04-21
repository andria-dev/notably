// tslint:disable: ordered-imports
import React from 'react';
import { Block, Editor } from 'slate';
import { List } from 'immutable';
import { isKeyHotkey } from 'is-hotkey';

// @ts-ignore
import PluginPrism from 'slate-prism';

import 'prismjs/themes/prism-tomorrow.css';
import { LabelledHx } from '../LabelledHx';

export const plugins = [
  PluginPrism({
    onlyIn: (block: Block) => block.type === 'code-block',
    getSyntax: (block: Block) => block.data.get('syntax') || 'javascript'
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
        <pre className="Editor__code-block language-javascript">
          <code {...attributes}>{children}</code>
        </pre>
      );
    case 'paragraph':
      return (
        <p {...attributes} className="Editor__paragraph">
          {children}
        </p>
      );
    case 'heading-one':
      return (
        <LabelledHx {...attributes} size={1}>
          {children}
        </LabelledHx>
      );
    case 'heading-two':
      return (
        <LabelledHx {...attributes} size={2}>
          {children}
        </LabelledHx>
      );
    case 'heading-three':
      return (
        <LabelledHx {...attributes} size={3}>
          {children}
        </LabelledHx>
      );
    case 'heading-four':
      return (
        <LabelledHx {...attributes} size={4}>
          {children}
        </LabelledHx>
      );
    case 'heading-five':
      return (
        <LabelledHx {...attributes} size={5}>
          {children}
        </LabelledHx>
      );
    case 'heading-six':
      return (
        <LabelledHx {...attributes} size={6}>
          {children}
        </LabelledHx>
      );
    case 'blockquote':
      return (
        <blockquote {...attributes} className="Editor__blockquote">
          {children}
        </blockquote>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'unordered-list':
      return <ul {...attributes}>{children}</ul>;
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
      return 'blockquote';
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
    case '```':
      return 'code-block';
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
  const type = getType(
    startBlock.text.slice(0, selection.start.offset).replace(/\s*/g, '')
  );
  if (!type || (type.includes('list') && startBlock.type === 'list-item')) {
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

function getLine(text: string, position: number): string {
  const start = text.lastIndexOf('\n', position - 1) + 1;
  let end = text.indexOf('\n', position);

  if (end === -1) {
    end = text.length;
  }

  return text.slice(start, end);
}

function getIndentation(text: string, position: number): number {
  const line = getLine(text, position);
  const indentation = line.match(/^(?:\s{2})*/)![0].length / 2;
  const endsInOpeningBracket = '{[('.includes(line[line.length - 1]);
  const endsInOpenJSX = /<\w+[^>\/]*>\s*$/.test(line);

  if (endsInOpeningBracket || endsInOpenJSX) {
    return indentation + 1;
  }

  return indentation;
}

const isModEnterKey = isKeyHotkey('mod+enter');
/**
 * On enter, if within a code-block, insert a newline character.
 * If the text before the cursor is *three backticks* then create a code-block.
 * Otherwise, split out of the block and create a paragraph.
 *
 * Also handles auto-indentation in code blocks
 */
function onEnter(event: any, editor: Editor, next: () => any, shift: boolean) {
  const { startBlock, selection } = editor.value;
  if (selection.isExpanded) {
    return next();
  }

  const insertNewLine =
    startBlock.type === 'code-block'
      ? () =>
          editor.insertText(
            `\n${'  '.repeat(
              getIndentation(startBlock.text, selection.anchor.offset)
            )}`
          )
      : () => editor.splitBlock(1).setBlocks('paragraph');

  if (startBlock.type === 'code-block' && isModEnterKey(event)) {
    const { offset } = selection.anchor;
    const newlinePosition = startBlock.text.indexOf('\n', offset);

    return editor.moveForward(newlinePosition - offset).insertText('\n');
  } else if (startBlock.text.slice(0, selection.start.offset) === '```') {
    return editor
      .deleteBackward(selection.start.offset)
      .setBlocks('code-block');
  } else {
    return insertNewLine();
  }
}

/**
 * On tab, indent 2 spaces. If shift was held down, un-indent the line 2 spaces.
 * Multi-line (un-)indentation is supported.
 */
function onTab(event: any, editor: Editor, next: () => any, shift: boolean) {
  const { startBlock, selection } = editor.value;

  if (startBlock.type !== 'code-block') {
    return;
  }

  const { anchor, focus } = selection;
  const isPrimitive = (x: any): boolean =>
    ['string', 'number'].includes(typeof x) || x === null;
  if (
    (isPrimitive(anchor.path) || isPrimitive(focus.path)) &&
    anchor.path !== focus.path
  ) {
    return;
  }

  if (
    anchor.path instanceof List &&
    focus.path instanceof List &&
    // @ts-ignore
    (anchor.path.size !== focus.path.size ||
      // @ts-ignore
      !anchor.path.every(
        // @ts-ignore
        (it: number, index: number) => focus.path.get(index) === it
      ))
  ) {
    return;
  }

  event.preventDefault();

  if (!shift && anchor.offset === focus.offset) {
    return editor.insertText('  ');
  }

  const { text } = startBlock;
  const { key } = startBlock.getFirstText()!;
  const selectionStart = selection.start.offset;
  const selectionEnd = selection.end.offset;

  let beginningOfLine = text.lastIndexOf('\n', selectionStart - 1) + 1;

  editor.withoutNormalizing(() => {
    for (const line of text.slice(beginningOfLine, selectionEnd).split('\n')) {
      if (shift) {
        if (line.slice(0, 2) !== '  ') {
          beginningOfLine += line.length + 1;
          continue;
        }

        editor.removeTextByKey(key, beginningOfLine, 2);
      } else {
        editor.insertTextByKey(key, beginningOfLine, '  ');
      }

      beginningOfLine += line.length + 1 + (shift ? -2 : 2);
    }
  });
}

/**
 * On backspace, if at the start of a non-paragraph block,
 * convert it into a paragraph block.
 */
function onBackspace(event: Event, editor: Editor, next: () => any) {
  const selection = editor.value.selection;
  if (selection.isExpanded || selection.start.offset !== 0) {
    return next();
  }

  const startBlock = editor.value.startBlock;
  if (startBlock.type === 'paragraph') {
    return next();
  }

  event.preventDefault();
  editor.setBlocks('paragraph');

  if (startBlock.type === 'list-item') {
    editor.unwrapBlock('unordered-list');
    editor.unwrapBlock('ordered-list');
  }
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
const isSpaceHotkey = isKeyHotkey('shift?+space');
const isBackspaceHotkey = isKeyHotkey('shift?+backspace');
const isEnterKey = isKeyHotkey('mod?+shift?+enter');
const isTabKey = isKeyHotkey('tab');
const isShiftTabKey = isKeyHotkey('shift+tab');

/**
 * Handles key-down events and applies different mark and node-types
 * based on the keys pressed. Offloads enter and backspace to
 * `onSpace` and `onBackspace`.
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
  } else if (isSpaceHotkey(event)) {
    return onSpace(event, editor, next);
  } else if (isBackspaceHotkey(event)) {
    return onBackspace(event, editor, next);
  } else if (isEnterKey(event)) {
    return onEnter(event, editor, next, false);
  } else if (isTabKey(event)) {
    return onTab(event, editor, next, false);
  } else if (isShiftTabKey(event)) {
    return onTab(event, editor, next, true);
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
