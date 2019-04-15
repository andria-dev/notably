import React from 'react';
import ReactModal from 'react-modal';

import { animated, useTransition } from 'react-spring';

interface IProps extends ReactModal.Props {
  children?: JSX.Element;
}

function BottomModal({ children, ...props }: IProps) {
  const transition = useTransition(props.isOpen, null, {
    from: {
      position: 'absolute',
      bottom: 0,
      transform: 'translateY(100%)'
    },
    enter: {
      transform: 'translateY(100%)'
    },
    leave: {
      transform: 'translateY(0%)'
    }
  });

  return (
    <ReactModal
      className="BottomModal"
      overlayClassName="BottomModal-overlay"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      {...props}
    >
      {transition.map(
        ({ item, key, props: style }) =>
          item && (
            <animated.div key={key} style={style}>
              {children}
            </animated.div>
          )
      )}
    </ReactModal>
  );
}

export default BottomModal;
