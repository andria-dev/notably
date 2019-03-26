import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { IAction, updateState, useStore } from '../../store';

import { Value } from 'slate';
import { Editor as SlateEditor } from 'slate-react';
import { useSaveHandler } from '../../hooks/saveHandler';

import './style.css';

export const types = {
  CHANGE: 0,
  INLINE: 1,
  BLOCK: 2
};

function EditorStateReducer(state: Value, action: IAction): Value {
  switch (action.type) {
    case types.CHANGE:
      return action.payload;
    default:
      throw new Error(`Invalid action: ${action.type}`);
  }
}

function Editor() {
  const [state] = useStore();

  const id = state.activeNoteID;
  const note = state.notes[id];

  const [editorState, dispatch] = useReducer(EditorStateReducer, note.state);
  const [debouncedSave, save] = useSaveHandler<Value>(2000, id, updateState, true);
  const handleChange = useCallback(
    ({ value }) => {
      dispatch({ type: types.CHANGE, payload: value });
      debouncedSave(value);
    },
    [dispatch, debouncedSave]
  );

  useEffect(() => {
    dispatch({ type: types.CHANGE, payload: note.state });
    return save;
  }, [id]);

  return (
    <main className="Editor">
      <SlateEditor value={editorState} onChange={handleChange} />
    </main>
  );
}

export default Editor;
