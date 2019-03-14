import { EditorState, RichUtils } from 'draft-js';
import React, { useCallback } from 'react';
import { IAction } from '../../../store';
import { inlineStyles, blockStyles } from '../rich-style';
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
      dispatch({ type: 'inline', payload: style });
    },
    [dispatch]
  );
  const handleBlock = useCallback(
    (type: string) => {
      dispatch({ type: 'block', payload: type });
    },
    [dispatch]
  );

  const y = useScrollYPosition();

  return (
    <section className={classNames('Controls', { 'shadow-md': y >= 42 }, className)} {...props}>
      {inlineStyles.map(({ label, style }) => (
        <StyleButton
          key={label}
          onToggle={handleInline}
          style={style}
          active={currentInlineStyles.has(style)}
        >
          {label}
        </StyleButton>
      ))}
      {blockStyles.map(({ label, type }) => (
        <StyleButton
          key={label}
          onToggle={handleBlock}
          style={type}
          active={currentBlockStyle === type}
        >
          {label}
        </StyleButton>
      ))}
    </section>
  );
}

export default Controls;
