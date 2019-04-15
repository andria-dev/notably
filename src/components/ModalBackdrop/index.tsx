import classNames from '@chbphone55/classnames';
import React from 'react';
import './style.css';

function ModalBackdrop({ className, ...props }: any) {
  return <div className={classNames('ModalBackdrop', className)} {...props} />;
}

export default ModalBackdrop;
