import React from 'react';

import { animated, useTransition } from 'react-spring';
import ModalBackdrop from '../ModalBackdrop';
import ModalPortal from '../ModalPortal';
import './style.css';

interface IProps extends ReactModal.Props {
  children?: JSX.Element;
}

function BottomModal({ children, ...props }: IProps) {
  const transition = useTransition(props.isOpen, null, {
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
      <ModalBackdrop className="BottomModal__backdrop">
        {transition.map(({ item, key, props: style }) =>
          item ? (
            <animated.div className="BottomModal" key={key} style={style}>
              {children}
            </animated.div>
          ) : null
        )}
      </ModalBackdrop>
    </ModalPortal>
  );
}

export default BottomModal;
