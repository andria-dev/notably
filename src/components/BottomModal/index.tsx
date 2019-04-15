import React from 'react';

import { animated, useTransition } from 'react-spring';
import ModalBackdrop from '../ModalBackdrop';
import ModalPortal from '../ModalPortal';
import './style.css';

interface IProps {
  children?: JSX.Element;
  isOpen: boolean;
}

function BottomModal({ children, isOpen, ...props }: IProps) {
  const backdropTransition = useTransition(isOpen, null, {
    from: {
      // @ts-ignore
      opacity: 0
    },
    enter: {
      // @ts-ignore
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  });

  const modalTransition = useTransition(isOpen, null, {
    from: {
      transform: 'translateY(100%) translateX(-50%)'
    },
    enter: {
      transform: 'translateY(0%) translateX(-50%)'
    },
    leave: {
      transform: 'translateY(100%) translateX(-50%)'
    },
    config: { mass: 1, tension: 200, friction: 26 }
  });

  return (
    <ModalPortal>
      {backdropTransition.map(
        // @ts-ignore
        backdrop =>
          backdrop.item && (
            <ModalBackdrop
              key={backdrop.key}
              className="BottomModal__backdrop"
              style={backdrop.props}
            >
              {modalTransition.map(
                modal =>
                  modal.item && (
                    <animated.div
                      className="BottomModal"
                      key={modal.key}
                      style={modal.props}
                    >
                      {children}
                    </animated.div>
                  )
              )}
            </ModalBackdrop>
          )
      )}
    </ModalPortal>
  );
}

export default BottomModal;
