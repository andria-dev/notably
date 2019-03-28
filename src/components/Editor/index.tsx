import React, { useCallback, useEffect, useReducer } from 'react';
import { IAction, updateState, useStore } from '../../store';

import { Value } from 'slate';
import { Editor as SlateEditor } from 'slate-react';
import { useSaveHandler } from '../../hooks/saveHandler';

import isHotkey from 'is-hotkey';
import { onKeyDown, plugins, renderMark, renderNode } from './rich-style';

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

const isSaveHotkey = isHotkey('mod+s');

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

  // Once mounted (or id has changed) update the editor state
  // Once unmounted (or id has changed again) run immediate save
  useEffect(() => {
    dispatch({ type: types.CHANGE, payload: note.state });
    return save;
  }, [id]);

  const saveListener = useCallback(
    (event: KeyboardEvent) => {
      if (isSaveHotkey(event)) {
        event.preventDefault();
        save();
      }
    },
    [save]
  );

  // Once mounted (or saveListener has changed) listen for CMD+S to save
  // Once unmounted (or saveListener changed again) remove the listener
  useEffect(() => {
    window.addEventListener('keydown', saveListener);
    return () => {
      window.removeEventListener('keydown', saveListener);
    };
  }, [saveListener]);

  return (
    <main className="Editor">
      <SlateEditor
        value={editorState}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        renderNode={renderNode}
        renderMark={renderMark}
        plugins={plugins}
      />
    </main>
  );
}

export default Editor;
