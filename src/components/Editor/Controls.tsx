import StyleButton from './StyleButton';
import { EditorState, RichUtils } from 'draft-js';
import { inlineStyles } from './rich-style';
import { useCallback } from 'react';

interface ControlsProps {
  editorState: EditorState;
}
function Controls({ editorState }: ControlsProps) {
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
        <StyleButton onToggle={handleToggle} active={currentInlineStyles.has(style)}>
          {label}
        </StyleButton>
      ))}
    </section>
  );
}

export default Controls;
