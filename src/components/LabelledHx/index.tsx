import React from 'react';

import { ObjectOf, Omit } from '../../generic-types';
import HeadingLabel, { IHeadingLabelProps } from '../HeadingLabel';
import Hx from '../Hx';
import './style.css';

export interface ILabelledHxProps extends ObjectOf<any> {
  size: 1 | 2 | 3 | 4 | 5 | 6;
  labelProps?: Omit<IHeadingLabelProps, 'size'>;
}
export function LabelledHx({
  size,
  labelProps,
  hxProps,
  children,
  ...props
}: ILabelledHxProps) {
  return (
    <span className="LabelledHx" {...props}>
      <HeadingLabel size={size} {...labelProps} />
      <Hx size={size} {...hxProps}>
        {children}
      </Hx>
    </span>
  );
}
