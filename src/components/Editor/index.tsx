import { Editor as DraftEditor, EditorState, RichUtils } from 'draft-js';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { inputHandler } from '../../inputHandler';
import { IAction, updateState, useStore } from '../../store';

import Controls from './Controls';
import { generateHandleKeyCommand, keyBindingFn, styleMap } from './rich-style';
import './style.css';

function EditorStateReducer(state: EditorState, action: IAction): EditorState {
  switch (action.type) {
    case 'change':
      return action.payload;
    case 'inline':
      return RichUtils.toggleInlineStyle(state, action.payload);
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

  useEffect(() => {
    dispatch({ type: 'change', payload: note.state });
    return unmounted;
  }, [id]);

  const handleKeyCommand = useCallback(generateHandleKeyCommand(dispatch), [dispatch]);

  return (
    <div className="Editor">
      <Controls editorState={editorState} dispatch={dispatch} />
      <DraftEditor
        editorState={editorState}
        onChange={newState => {
          dispatch({ type: 'change', payload: newState });
          setter(newState);
        }}
        customStyleMap={styleMap}
        keyBindingFn={keyBindingFn}
        handleKeyCommand={handleKeyCommand}
      />
    </div>
  );
}

export default Editor;
