import React from 'react';
import { animated, useTransition } from 'react-spring';
import { ObjectOf } from '../../../generic-types';
import BaseModal, { IBaseModalProps } from '../BaseModal';

import classNames from '@chbphone55/classnames';
import './style.css';

function CenterModal({
  isOpen,
  onRequestClose,
  className,
  ...props
}: IBaseModalProps & ObjectOf<any>) {
  const modalTransition = useTransition(isOpen, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 200, friction: 26 }
  });

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      {modalTransition.map(({ item, key, props: style }) =>
        item ? (
          <animated.div
            key={key}
            style={style}
            className={classNames('CenterModal', className)}
            {...props}
          />
        ) : null
      )}
    </BaseModal>
  );
}

export default CenterModal;
