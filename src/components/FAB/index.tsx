import classNames from '@chbphone55/classnames';
import React, { memo } from 'react';

import './style.css';

interface IFABProps {
  [s: string]: any;
}

function FAB({ className, ...props }: IFABProps) {
  return <button {...props} className={classNames(className, 'FAB')} />;
}

export default memo(FAB);
