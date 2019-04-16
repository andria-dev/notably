import classNames from '@chbphone55/classnames';
import React, { useCallback, useRef } from 'react';
import './style.css';

function ModalBackdrop({ className, onClick, ...props }: any) {
  const ref = useRef(null);

  const handleClick = useCallback(
    event => {
      if (ref.current === event.target) {
        onClick(event);
      }
    },
    [onClick]
  );

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={classNames('ModalBackdrop', className)}
      {...props}
    />
  );
}

export default ModalBackdrop;
