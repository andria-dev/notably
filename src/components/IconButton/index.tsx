import React from 'react';
import classNames from '@chbphone55/classnames';

import './style.css';

interface IconButtonProps {
  className?: any;
  [s: string]: any;
}

function IconButton({ className, ...props }: IconButtonProps) {
  return <button {...props} className={classNames(className, 'IconButton')} />;
}

export default IconButton;
