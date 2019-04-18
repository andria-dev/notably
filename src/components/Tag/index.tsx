import classNames from '@chbphone55/classnames';
import React, { memo, ReactNode } from 'react';

import './style.css';

interface ITagProps {
  className?: any;
  children: ReactNode;
  [s: string]: any;
}

function Tag({ children, className, ...props }: ITagProps) {
  return (
    <p className={classNames(className, 'Tag')} {...props}>
      {children}
    </p>
  );
}

export default memo(Tag);
