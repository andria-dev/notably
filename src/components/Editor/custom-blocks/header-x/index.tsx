import React from 'react';
import HeadingLabel from '../../../HeadingLabel';
import Hx from '../../../Hx';

interface ILabelledHxProps {
  size: 1 | 2 | 3 | 4 | 5 | 6;
  labelProps?: { [s: string]: any };
  [s: string]: any;
}
export function LabelledHx({ size, labelProps, ...props }: ILabelledHxProps) {
  return (
    <span>
      <HeadingLabel size={size} {...labelProps} />
      <Hx size={size} {...props} />
    </span>
  );
}

export function headerX(size: 1 | 2 | 3 | 4 | 5 | 6) {
  return () => <LabelledHx size={size} />;
}
