import React, { ReactNode, useEffect } from 'react';
import { useTransition } from 'react-spring';
import ModalBackdrop from './ModalBackdrop';
import ModalPortal from './ModalPortal';

export interface IBaseModalProps {
  children: ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
}

function BaseModal({ isOpen, onRequestClose, children }: IBaseModalProps) {
  const backdropTransition = useTransition(isOpen, null, {
    '--opacity': 0,
    from: { '--opacity': 0 },
    enter: { '--opacity': 0.5 },
    leave: { '--opacity': 0 },
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
            {children}
          </ModalBackdrop>
        ) : null
      )}
    </ModalPortal>
  );
}

export default BaseModal;
