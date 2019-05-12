import React from 'react';
import { animated, ItemTransition } from 'react-spring';
import { useTransition } from '../../../hooks';
import { ObjectOf } from '../../../lib/generic-types';
import BaseModal, { IBaseModalProps } from '../BaseModal';

import classNames from '@chbphone55/classnames';
import { fast } from '../../../spring-configs';
import './style.css';

interface IProps extends IBaseModalProps, ObjectOf<any> {
  modalTransition?: Array<ItemTransition<any, any>>;
}

export function useCenterModalTransition(
  isOpen: boolean,
  props: ObjectOf<any> = {}
) {
  return useTransition(isOpen, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: fast,
    ...props
  });
}

function CenterModal({
  isOpen,
  onRequestClose,
  className,
  // eslint-disable-next-line react-hooks/rules-of-hooks
  modalTransition = useCenterModalTransition(isOpen),
  ...props
}: IProps) {
  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      {modalTransition.map(({ item, key, props: style }) =>
        item ? (
          <animated.div
            key={key}
            style={style}
            className={classNames('CenterModal shadow-lg', className)}
            {...props}
          />
        ) : null
      )}
    </BaseModal>
  );
}

export default CenterModal;
