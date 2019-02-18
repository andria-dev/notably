import React from 'react';
import classNames from '@chbphone55/classnames';

interface HxProps {
  size?: number;
  weight?: number;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: any;
  style?: { [s: string]: any };
  [s: string]: any;
}

/**
 * @param props.size size determines font-size: 0-5 -> 1rem-2rem
 * @param props.weight weight determines font-weight: 0-5 -> 100-600
 */
function Hx({
  size = 5,
  weight = size,
  type = 'h1',
  className,
  style,
  ...props
}: HxProps) {
  return React.createElement(type, {
    ...props,
    className: classNames(className, 'Hx'),
    style: {
      fontSize: `${size * 0.2 + 1}rem`,
      fontWeight: (weight + 1) * 100,
      margin: 0,
      ...style,
    },
  });
}

export default Hx;
