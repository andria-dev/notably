import { ContentBlock, ContentState } from 'draft-js';
import React from 'react';
import { headerX } from './custom-blocks/header-x';

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

export const bold = {
  strategy: regexStrategy(/\*.+?\*/g),
  component: (props: any) => <strong {...props} />
};

export const italics = {
  strategy: regexStrategy(/_.+?_/g),
  component: (props: any) => <i {...props} />
};

export const emphasis = {
  strategy: regexStrategy(/__.+?__/g),
  component: (props: any) => <em {...props} />
};

export const headings: any[] = [];
for (let i = 0; i < 6; ++i) {
  headings.push({
    strategy: regexStrategy(new RegExp(`^${'#'.repeat(i + 1)}\\s.+$`, 'g')),
    component: headerX((i + 1) as (1 | 2 | 3 | 4 | 5 | 6))
  });
}
