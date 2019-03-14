import { ContentBlock, ContentState } from 'draft-js';
import React from 'react';
import { dispatch } from '.';
import { headerX } from './custom-blocks/header-x';
import { styleMap } from './rich-style';

function findWithRegex(regex: RegExp, contentBlock: ContentBlock, callback: CallableFunction) {
  const text = contentBlock.getText();
  let match = regex.exec(text);

  while (match !== null) {
    const start = match.index;
    callback(start, start + match[0].length);

    match = regex.exec(text);
  }
}

const regexStrategy = (regex: RegExp) => (
  contentBlock: ContentBlock,
  callback: CallableFunction,
  contentState: ContentState
) => findWithRegex(regex, contentBlock, callback);

interface IStrategyProps {
  contentState: ContentState;
  decoratedText: string;
  offsetKey: string;
  [s: string]: any;
}

export const bold = {
  strategy: regexStrategy(/\*.+?\*/g),
  component: (props: IStrategyProps) => <strong children={props.children} />
};

export const italics = {
  strategy: regexStrategy(/_.+?_/g),
  component: (props: IStrategyProps) => <em children={props.children} />
};

export const code = {
  strategy: regexStrategy(/`.+?`/g),
  component: (props: IStrategyProps) => <code style={styleMap.CODE} children={props.children} />
};

export const headings: any[] = [];
for (let i = 0; i < 6; ++i) {
  headings.push({
    strategy: regexStrategy(new RegExp(`^${'#'.repeat(i + 1)}\\s.+$`, 'g')),
    component: (props: IStrategyProps) => {
      // dispatch({
      //   type: 'set-type',
      //   payload: { ...props, type: 'header-one' }
      // });

      const [key, line, startIndex] = props.offsetKey.split('-');
      const children = props.decoratedText.split('').map((l, index) => {
        const theKey = `${key}-${Number(line)}-${index + Number(startIndex)}`;
        return React.cloneElement(props.children[0], {
          text: l,
          key: theKey,
          offsetKey: theKey,
          customStyleMap: { width: '0', visibility: 'hidden' },
          styleSet: [index <= i ? 'hidden' : '']
        });
      });

      // debugger;

      return headerX((i + 1) as (1 | 2 | 3 | 4 | 5 | 6))({
        children,
        isContent: false
      });
    }
  });
}
