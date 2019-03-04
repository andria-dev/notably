import classNames from '@chbphone55/classnames';
import React, { memo } from 'react';

import './style.css';

interface TagProps {
  className?: any;
  children: React.ReactNode;
  [s: string]: any;
}

function Tag({ children, className }: TagProps) {
  return <p className={classNames(className, 'Tag')}>{children}</p>;
}

export default memo(Tag);
