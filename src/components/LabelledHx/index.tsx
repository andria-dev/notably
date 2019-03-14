import React from 'react';

import { ContentState } from 'draft-js';
import HeadingLabel from '../HeadingLabel';
import Hx from '../Hx';
import './style.css';

interface ILabelledHxProps {
  size: 1 | 2 | 3 | 4 | 5 | 6;
  labelProps?: { [s: string]: any };
  [s: string]: any;
}
export function LabelledHx({ size, labelProps, ...props }: ILabelledHxProps) {
  return (
    <span className="LabelledHx">
      <HeadingLabel size={size} {...labelProps} />
      <Hx size={size} {...props} />
    </span>
  );
}
