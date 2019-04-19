import React from 'react';
import { animated } from 'react-spring';
import { useTransition } from '../../../hooks';
import BaseModal, { IBaseModalProps } from '../BaseModal';

import classNames from '@chbphone55/classnames';
import { ObjectOf } from '../../../generic-types';
import './style.css';

function BottomModal({
  children,
  isOpen,
  onRequestClose,
  className,
  ...props
}: IBaseModalProps & ObjectOf<any>) {
  const modalTransition = useTransition(isOpen, null, {
    from: { transform: 'translateY(100%) translateX(-50%)' },
    enter: { transform: 'translateY(0%) translateX(-50%)' },
    leave: { transform: 'translateY(100%) translateX(-50%)' },
    config: { mass: 1, tension: 200, friction: 26 }
  });

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
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
    </BaseModal>
  );
}

export default BottomModal;
