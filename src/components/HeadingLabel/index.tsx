import classNames from '@chbphone55/classnames';
import React from 'react';

import './style.css';

export interface IHeadingLabelProps {
  size: 1 | 2 | 3 | 4 | 5 | 6;
  [s: string]: any;
}
function HeadingLabel({ className, size, ...props }: IHeadingLabelProps) {
  return (
    <label contentEditable={false} className={classNames('HeadingLabel', className)} {...props}>
      H<small>{size}</small>
    </label>
  );
}

export default HeadingLabel;
