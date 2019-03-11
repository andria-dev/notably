import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { updateTitle, useStore } from '../../store';
import { inputHandler } from '../Editor/inputHandler';
import Hx from '../Hx';

import './style.css';

function NoteTitle() {
  const [state] = useStore();

  const id = state.activeNoteID;
  const note = state.notes[id];

  const [title, setTitle] = useState(note.title);
  const [setter, unmounted] = useMemo(() => inputHandler<string>(2000, id, updateTitle), [id]);

  useEffect(() => {
    setTitle(note.title);
    return unmounted;
  }, [id]);

  return (
    <>
      <label className="NoteTitle__label" htmlFor={id}>
        H1
      </label>
      <Hx
        aria-label="Title"
        size={4}
        type="input"
        value={title}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          setTitle(value);
          setter(value);
        }}
        className="NoteTitle"
        id={id}
      />
    </>
  );
}

export default NoteTitle;
