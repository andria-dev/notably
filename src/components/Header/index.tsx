import React from 'react';
import classNames from '@chbphone55/classnames';
import './style.css';

interface HeaderProps {
  className?: any;
  [s: string]: any;
}

function Header({ className, ...props }: HeaderProps) {
  return <header {...props} className={classNames(className, 'Header')} />;
}

export default Header;
