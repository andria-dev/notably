import { Editor as DraftEditor, EditorState } from 'draft-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { updateState, useStore } from '../../store';

function Editor() {
  const [state, dispatch] = useStore();

  const id = state.activeNoteID;
  const note = state.notes[id];

  const idleCallbackID = useRef(-1);
  const [editorState, setEditorState] = useState(note.state);
  const editorStateRef = useRef(editorState);

  const saveEditorState = useDebouncedCallback(
    async (value: EditorState) => {
      // @ts-ignore
      idleCallbackID.current = requestIdleCallback(
        () => {
          updateState(id, value, true).then(dispatch);
        },
        { timeout: 5000 }
      );
    },
    2000,
    [id]
  );

  const handleEditorStateChange = useCallback(
    (value: EditorState) => {
      editorStateRef.current = value;
      setEditorState(value);
      saveEditorState(value);
    },
    [setEditorState, saveEditorState]
  );

  useEffect(() => {
    return () => {
      if (editorStateRef.current !== note.state) {
        // @ts-ignore
        cancelIdleCallback(idleCallbackID.current);
        updateState(id, editorStateRef.current).then(dispatch);
      }
    };
  }, []);

  return <DraftEditor editorState={editorState} onChange={handleEditorStateChange} />;
}

export default Editor;
