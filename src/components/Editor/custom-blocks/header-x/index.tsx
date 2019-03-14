import React from 'react';
import HeadingLabel from '../../../HeadingLabel';
import Hx from '../../../Hx';

import { ContentState } from 'draft-js';
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

export function headerX(size: 1 | 2 | 3 | 4 | 5 | 6) {
  return ({ isContent = true, ...props }) => {
    if (!isContent) {
      return <LabelledHx size={size} {...props} />;
    }

    const { block, contentState } = props;
    return <LabelledHx size={size}>{contentState.getPlainText()}</LabelledHx>;
  };
}
