import classNames from '@chbphone55/classnames';
import React, { forwardRef, useCallback, useRef } from 'react';
import { animated } from 'react-spring';
import './style.css';

function ModalBackdrop({ className, onClick, ...props }: any, ref: any) {
  const handleClick = useCallback(
    event => {
      if (ref.current === event.target) {
        onClick(event);
      }
    },
    [onClick]
  );

  return (
    <animated.div
      ref={ref}
      onClick={handleClick}
      className={classNames('ModalBackdrop', className)}
      {...props}
    />
  );
}

export default forwardRef(ModalBackdrop);
