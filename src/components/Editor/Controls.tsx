import { EditorState, RichUtils } from 'draft-js';
import React, { useCallback } from 'react';
import { IAction } from '../../store';
import { inlineStyles } from './rich-style';
import StyleButton from './StyleButton';

interface IControlsProps {
  dispatch: React.Dispatch<IAction>;
  editorState: EditorState;
}
function Controls({ dispatch, editorState }: IControlsProps) {
  const currentInlineStyles = editorState.getCurrentInlineStyle();

  const selection = editorState.getSelection();
  const currentBlockStyle = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const handleToggle = useCallback(
    (style: string) => {
      RichUtils.toggleInlineStyle(editorState, style);
    },
    [editorState]
  );

  return (
    <section className="Controls">
      {inlineStyles.map(({ label, style }) => (
        <StyleButton onToggle={handleToggle} style={style} active={currentInlineStyles.has(style)}>
          {label}
        </StyleButton>
      ))}
    </section>
  );
}

export default Controls;
