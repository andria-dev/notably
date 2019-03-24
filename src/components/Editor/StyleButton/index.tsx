import classNames from '@chbphone55/classnames';
import React, { useCallback } from 'react';

import './style.css';

interface IStyleButtonProps {
  active: boolean;
  onToggle: (name: string) => any;
  style: string;
  children: string;
  [s: string]: any;
}
function StyleButton({ active = false, onToggle, children, style, ...props }: IStyleButtonProps) {
  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      /* If not left click do nothing */
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      onToggle(style);
    },
    [onToggle]
  );

  return (
    <button
      className={classNames('StyleButton', { 'StyleButton--active': active })}
      onMouseDown={handleToggle}
      {...props}
    >
      {children}
    </button>
  );
}

export default StyleButton;
