import classNames from '@chbphone55/classnames';
import React from 'react';

import { ObjectOf } from '../../generic-types';
import './style.css';

export interface IHeadingLabelProps extends ObjectOf<any> {
  size: 1 | 2 | 3 | 4 | 5 | 6;
}
function HeadingLabel({ className, size, ...props }: IHeadingLabelProps) {
  return (
    <label
      aria-hidden
      contentEditable={false}
      className={classNames('HeadingLabel', className)}
      {...props}
    >
      H<small>{size}</small>
    </label>
  );
}

export default HeadingLabel;
