import classNames from '@chbphone55/classnames';
import React from 'react';
import './style.css';

interface HeaderProps {
  className?: any;
  [s: string]: any;
}

function Header({ className, ...props }: HeaderProps) {
  return (
    <header {...props} className={classNames(className, 'Header shadow-md')} />
  );
}

export default Header;
