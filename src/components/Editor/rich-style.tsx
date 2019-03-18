import Draft, {
  DraftHandleValue,
  EditorState,
  getDefaultKeyBinding,
  ContentBlock,
  ContentState,
  RichUtils,
  CompositeDecorator
} from 'draft-js';
import React, { KeyboardEvent } from 'react';
import { IAction } from '../../store';
import { UnicodeBidiProperty } from 'csstype';

// export const inlineStyles: Array<{
//   label: string;
//   style: string;
// }> = [
//   { label: 'Bold', style: 'BOLD' },
//   { label: 'Italics', style: 'ITALIC' },
//   { label: 'Underline', style: 'UNDERLINE' },
//   { label: 'Code', style: 'CODE' },
//   { label: 'Strikethrough', style: 'STRIKETHROUGH' }
// ];

// export const styleMap = {
//   ...Draft.DefaultDraftInlineStyle,
//   STRIKETHROUGH: {
//     textDecoration: 'line-through'
//   },
//   CODE: {
//     backgroundColor: 'hsl(0, 0%, 95%)',
//     fontSize: '1rem',
//     fontFamily: 'Menlo,Monaco,"Courier New",Courier,monospace',
//     borderRadius: '0.12rem'
//   }
// };

function findWithRegex(regex: RegExp, contentBlock: ContentBlock, callback: CallableFunction) {
  const text = contentBlock.getText();
  let match = regex.exec(text);

  while (match !== null) {
    const start = match.index;
    callback(start, start + match[0].length);

    match = regex.exec(text);
  }
}

function createStrategy(
  regex: RegExp
): (contentBlock: ContentBlock, callback: CallableFunction, contentState: ContentState) => void {
  return (contentBlock, callback, contentState) => findWithRegex(regex, contentBlock, callback);
}

interface IDecoratorProps {
  [s: string]: any;
}
export const decorators = new CompositeDecorator([
  {
    strategy: createStrategy(/\*.+?\*/g),
    component: ({ children: [child] }: IDecoratorProps) => {
      const { text, start } = child.props;
      const first = React.cloneElement(child, { text: '*' });
      const middle = React.cloneElement(child, {
        text: text.slice(1, -1),
        start: start + 1
      });
      const last = React.cloneElement(child, {
        text: '*',
        start: text.slice(1, -1).length
      });
      console.log(child);
      // @ts-ignore
      window.child = child;

      return (
        <strong>
          <span className="faded">{first}</span>
          {middle}
          <span className="faded">{last}</span>
        </strong>
      );
    }
  }
]);
