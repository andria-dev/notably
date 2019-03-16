import { Editor as DraftEditor, EditorState, Modifier, RichUtils, SelectionState } from 'draft-js';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { inputHandler } from '../../inputHandler';
import { IAction, updateState, useStore } from '../../store';

import Controls from './Controls';
import { generateKeyBindingFn, styleMap } from './rich-style';
import './style.css';

function EditorStateReducer(state: EditorState, action: IAction): EditorState {
  switch (action.type) {
    case 'change':
      return action.payload;
    case 'inline':
      const { key, start, end, style } = action.payload;

      if (key === undefined || start === undefined || end === undefined) {
        return RichUtils.toggleInlineStyle(state, style);
      }

      const content = state.getCurrentContent();
      const selection = new SelectionState({
        anchorKey: key,
        anchorOffset: start,
        focusKey: key,
        focusOffset: end,
        isBackward: false,
        hasFocus: false
      });

      const newContent = Modifier.applyInlineStyle(content, selection, style);
      return EditorState.push(state, newContent, 'change-inline-style');
    case 'block':
      return RichUtils.toggleBlockType(state, action.payload);
    default:
      throw new Error(`Invalid action: ${action.type}`);
  }
}

let exportedDispatch: React.Dispatch<IAction>;
export { exportedDispatch as dispatch };

function Editor() {
  const [state] = useStore();

  const id = state.activeNoteID;
  const note = state.notes[id];

  const [editorState, dispatch] = useReducer(EditorStateReducer, note.state);
  exportedDispatch = dispatch;
  const [setter, unmounted] = useMemo(
    () => inputHandler<EditorState>(2000, id, updateState, true),
    [id]
  );
  const handleChange = useCallback(
    newState => {
      dispatch({ type: 'change', payload: newState });
      setter(newState);
    },
    [dispatch, setter]
  );

  useEffect(() => {
    dispatch({ type: 'change', payload: note.state });
    return unmounted;
  }, [id]);

  const keyBindingFn = useCallback(generateKeyBindingFn(editorState, dispatch), [dispatch]);

  return (
    <div className="Editor">
      <Controls editorState={editorState} dispatch={dispatch} />
      <DraftEditor
        editorState={editorState}
        onChange={handleChange}
        customStyleMap={styleMap}
        keyBindingFn={keyBindingFn}
        handleKeyCommand={(command: string, currentState: EditorState) => {
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            handleChange(newState);
            return 'handled';
          }
          return 'not-handled';
        }}
      />
    </div>
  );
}

export default Editor;
