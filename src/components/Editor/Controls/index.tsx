import { EditorState, RichUtils } from 'draft-js';
import React, { useCallback } from 'react';
import { IAction } from '../../../store';
import { inlineStyles } from '../rich-style';
import StyleButton from '../StyleButton';

import { useScrollYPosition } from 'react-use-scroll-position';

import classNames from '@chbphone55/classnames';
import './style.css';

interface IControlsProps {
  dispatch: React.Dispatch<IAction>;
  editorState: EditorState;
  className?: any;
}
function Controls({ dispatch, editorState, className, ...props }: IControlsProps) {
  const currentInlineStyles = editorState.getCurrentInlineStyle();

  const selection = editorState.getSelection();
  const currentBlockStyle = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const handleInline = useCallback(
    (style: string) => {
      dispatch({ type: 'change', payload: RichUtils.toggleInlineStyle(editorState, style) });
    },
    [editorState, dispatch]
  );

  const y = useScrollYPosition();

  return (
    <section className={classNames('Controls', { shadow: y >= 42 }, className)} {...props}>
      {inlineStyles.map(({ label, style }) => (
        <StyleButton onToggle={handleInline} style={style} active={currentInlineStyles.has(style)}>
          {label}
        </StyleButton>
      ))}
    </section>
  );
}

export default Controls;
