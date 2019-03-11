import { Editor as DraftEditor, EditorState } from 'draft-js';
import React, { useEffect, useMemo, useState } from 'react';
import { updateState, useStore } from '../../store';
import { inputHandler } from './inputHandler';

function Editor() {
  const [state] = useStore();

  const id = state.activeNoteID;
  const note = state.notes[id];

  const [editorState, setEditorState] = useState(note.state);
  const [setter, unmounted] = useMemo(
    () => inputHandler<EditorState>(2000, id, updateState, true),
    [id]
  );

  useEffect(() => {
    setEditorState(note.state);
    return unmounted;
  }, [id]);

  return (
    <DraftEditor
      editorState={editorState}
      onChange={newState => {
        setEditorState(newState);
        setter(newState);
      }}
    />
  );
}

export default Editor;
