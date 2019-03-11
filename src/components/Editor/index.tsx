import { Editor as DraftEditor, EditorState } from 'draft-js';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { inputHandler } from '../../inputHandler';
import { updateState, useStore } from '../../store';

import { blockRenderMap, inlineStyles, styleMap } from './rich-style';
import './style.css';
import StyleButton from './StyleButton';

function Editor() {
  const [state] = useStore();

  const editorRef = useRef<DraftEditor>(null);

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
    <div className="Editor">
      <section className="toolbar">
        {inlineStyles.map(([name, modifier]) => (
          <StyleButton
            key={name}
            onToggle={() => {
              setEditorState(modifier);
            }}
            active={false}
          >
            {name}
          </StyleButton>
        ))}
      </section>
      <DraftEditor
        ref={editorRef}
        editorState={editorState}
        onChange={newState => {
          setEditorState(newState);
          setter(newState);
        }}
        customStyleMap={styleMap}
        // @ts-ignore
        blockRenderMap={blockRenderMap}
      />
    </div>
  );
}

export default Editor;
