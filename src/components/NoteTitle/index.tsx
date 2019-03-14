import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { inputHandler } from '../../inputHandler';
import { updateTitle, useStore } from '../../store';
import Hx from '../Hx';

import { LabelledHx } from '../Editor/custom-blocks/header-x';
import HeadingLabel from '../HeadingLabel';
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
    <LabelledHx
      size={1}
      type="input"
      value={title}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTitle(value);
        setter(value);
      }}
      className="NoteTitle"
      id={id}
      aria-label="Title"
      labelProps={{ htmlFor: id }}
    />
  );
}

export default NoteTitle;
