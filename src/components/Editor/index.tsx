import { Editor as DraftEditor, EditorState } from 'draft-js';
import Note from '../../models/Note';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { updatePageState, IAction } from '../../store';

interface IEditorProps {
  note: Note;
  id: string;
  dispatch: React.Dispatch<IAction>;
}

function Editor({ note, dispatch, ...props }: IEditorProps) {
  const [editorState, setEditorState] = useState(note.state);
  const idleCallbackID = useRef(-1);
  const savePageState = useDebouncedCallback(
    async (value: EditorState) =>
      // @ts-ignore
      (idleCallbackID.current = requestIdleCallback(
        () => updatePageState(id, currentPage, value, true).then(dispatch),
        { timeout: 5000 }
      )),
    2000,
    [id, currentPage]
  );

  useEffect(() => {
    return () => {
      // @ts-ignore
      cancelIdleCallback(idleCallbackID.current);
      updatePageState(id, currentPage, editorState).then(dispatch);
    };
  });

  const handleEditorStateChange = useCallback((value: EditorState) => {
    setEditorState(value);
    savePageState(value);
  }, []);

  return <DraftEditor />;
}

export default Editor;
