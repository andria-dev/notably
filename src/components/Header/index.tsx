import classNames from '@chbphone55/classnames';
import React, { memo } from 'react';
import './style.css';

interface IHeaderProps {
  className?: any;
  [s: string]: any;
}

function Header({ className, ...props }: IHeaderProps) {
  return <header {...props} className={classNames(className, 'Header shadow-md')} />;
}

export default memo(Header);
