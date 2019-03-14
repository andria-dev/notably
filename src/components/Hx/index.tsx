import classNames from '@chbphone55/classnames';
import React, { memo } from 'react';

import './style.css';

interface IHxProps {
  size?: number;
  weight?: number;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | string;
  className?: any;
  style?: { [s: string]: any };
  [s: string]: any;
}

/**
 * @param props.size size determines font-size: 1-6 -> 2rem-1rem
 * @param props.weight weight determines font-weight: 1-6 -> 600-100
 */
function Hx({ size = 1, weight = size, type = 'h1', className, style, ...props }: IHxProps) {
  return React.createElement(type, {
    ...props,
    className: classNames(className, 'Hx'),
    style: {
      fontSize: `${2 - (size - 1) * 0.2}rem`,
      fontWeight: (7 - weight) * 100,
      ...style
    }
  });
}

export default memo(Hx);
