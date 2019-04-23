import React from 'react';

import classNames from '@chbphone55/classnames';
import './style.css';

function Button({ className, ...props }: any) {
  return (
    <button className={classNames('Button shadow', className)} {...props} />
  );
}

export default Button;
