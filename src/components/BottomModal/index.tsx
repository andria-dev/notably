import React, { useEffect } from 'react';
import { animated, useTransition } from 'react-spring';

import ModalBackdrop from '../ModalBackdrop';
import ModalPortal from '../ModalPortal';

import classNames from '@chbphone55/classnames';

import './style.css';

interface IProps {
  children?: JSX.Element | JSX.Element[];
  isOpen: boolean;
  onRequestClose: () => void;
  [s: string]: any;
}

function BottomModal({
  children,
  isOpen,
  onRequestClose,
  className,
  ...props
}: IProps) {
  const backdropTransition = useTransition(isOpen, null, {
    '--opacity': 0,
    from: { '--opacity': 0 },
    enter: { '--opacity': 0.5 },
    leave: { '--opacity': 0 },
    config: { mass: 1, tension: 200, friction: 26 }
  });

  const modalTransition = useTransition(isOpen, null, {
    from: { transform: 'translateY(100%) translateX(-50%)' },
    enter: { transform: 'translateY(0%) translateX(-50%)' },
    leave: { transform: 'translateY(100%) translateX(-50%)' },
    config: { mass: 1, tension: 200, friction: 26 }
  });

  // Close on Escape
  useEffect(() => {
    function listener(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onRequestClose();
      }
    }
    window.addEventListener('keyup', listener);

    return () => {
      window.removeEventListener('keyup', listener);
    };
  }, [onRequestClose]);

  return (
    <ModalPortal>
      {backdropTransition.map(backdrop =>
        backdrop.item ? (
          <ModalBackdrop
            key={backdrop.key}
            className="BottomModal__backdrop"
            style={backdrop.props}
            onClick={onRequestClose}
          >
            {modalTransition.map(modal =>
              modal.item ? (
                <animated.div
                  className={classNames('BottomModal', className)}
                  key={modal.key}
                  style={modal.props}
                  {...props}
                >
                  {children}
                </animated.div>
              ) : null
            )}
          </ModalBackdrop>
        ) : null
      )}
    </ModalPortal>
  );
}

export default BottomModal;
