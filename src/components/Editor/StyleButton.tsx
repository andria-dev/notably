import classNames from '@chbphone55/classnames';
import React, { useCallback } from 'react';

interface IStyleButtonProps {
  active: boolean;
  onToggle: () => any;
  children: string;
}
function StyleButton({ active = false, onToggle, children, ...props }: IStyleButtonProps) {
  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      /* If not left click do nothing */
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      onToggle();
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
