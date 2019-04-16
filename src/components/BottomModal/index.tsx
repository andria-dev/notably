import React from 'react';

import { animated, useTransition } from 'react-spring';
import ModalBackdrop from '../ModalBackdrop';
import ModalPortal from '../ModalPortal';
import './style.css';

interface IProps {
  children?: JSX.Element;
  isOpen: boolean;
  onRequestClose: () => void;
}

function BottomModal({ children, isOpen, onRequestClose, ...props }: IProps) {
  const backdropTransition = useTransition(isOpen, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 200, friction: 26 }
  });

  const modalTransition = useTransition(isOpen, null, {
    from: { transform: 'translateY(100%) translateX(-50%)' },
    enter: { transform: 'translateY(0%) translateX(-50%)' },
    leave: { transform: 'translateY(100%) translateX(-50%)' },
    config: { mass: 1, tension: 200, friction: 26 }
  });

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
                  className="BottomModal"
                  key={modal.key}
                  style={modal.props}
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
