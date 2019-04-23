import React, { useCallback, useEffect, useRef, useState } from 'react';
import { updateState, useStore } from '../../store';

import { List } from 'immutable';
import { Operation, Value } from 'slate';
import { Editor as SlateEditor } from 'slate-react';
import { useSaveHandler } from '../../hooks/';

import isHotkey from 'is-hotkey';
import { onKeyDown, plugins, renderMark, renderNode } from './rich-style';

import './style.css';

function fixValue(value: Value) {
  return Value.fromJSON(value.toJSON());
}

// const saveSound = new Audio('/save-sound.webm');
const saveSound = document.querySelector('#save-sound')! as HTMLAudioElement;
saveSound.volume = 0.25;

const isSaveHotkey = isHotkey('mod+s');

function Editor() {
  const [state] = useStore();

  const id = state.activeNoteID;
  const idRef = useRef(id);
  const note = state.notes[id];

  const [editorState, setEditorState] = useState(fixValue(note.state));
  const [debouncedSave, save] = useSaveHandler<Value>(
    2000,
    id,
    updateState,
    true
  );
  const handleChange = useCallback(
    ({ value, operations }: any) => {
      setEditorState(value);

      // only save if the content has changed (i.e. not just moving cursor)
      if (
        operations.some(
          (operation: Operation) => operation.type !== 'set_selection'
        )
      ) {
        debouncedSave(value);
      }
    },
    [setEditorState, debouncedSave]
  );

  // Once mounted, or id updated, update the editor state
  // Once unmounted, or id has changed again, run immediate save
  useEffect(() => {
    // check current id against past id
    if (id !== idRef.current) {
      setEditorState(fixValue(note.state));
    }
    idRef.current = id;

    return save;
  }, [id, save, note.state, setEditorState]);

  const saveListener = useCallback(
    (event: KeyboardEvent) => {
      if (isSaveHotkey(event)) {
        event.preventDefault();
        save();

        saveSound.play().catch(error => {
          saveSound.controls = true;
          document.body.appendChild(saveSound);
        });
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
    <main className="Editor--wrapper">
      <SlateEditor
        className="Editor"
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
