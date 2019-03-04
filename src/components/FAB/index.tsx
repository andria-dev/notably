import classNames from '@chbphone55/classnames';
import React, { memo } from 'react';

import './style.css';

interface FABProps {
  [s: string]: any;
}

function FAB({ className, ...props }: FABProps) {
  return <button {...props} className={classNames(className, 'FAB')} />;
}

export default memo(FAB);
