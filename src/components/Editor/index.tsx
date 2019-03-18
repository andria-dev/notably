import { Editor as DraftEditor, EditorState, Modifier, RichUtils, SelectionState } from 'draft-js';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { inputHandler } from '../../inputHandler';
import { IAction, updateState, useStore } from '../../store';

import Controls from './Controls';
// import { generateKeyBindingFn, styleMap } from './rich-style';
import './style.css';

function EditorStateReducer(state: EditorState, action: IAction): EditorState {
  switch (action.type) {
    case 'change':
      return action.payload;
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

  return (
    <div className="Editor">
      {/* <Controls editorState={editorState} dispatch={dispatch} /> */}
      <DraftEditor editorState={editorState} onChange={handleChange} />
    </div>
  );
}

export default Editor;
