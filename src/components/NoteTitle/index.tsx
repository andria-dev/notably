import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSaveHandler } from '../../hooks/useSaveHandler';
import { updateTitle, useStore } from '../../store';

import { LabelledHx } from '../LabelledHx';
import './style.css';

function NoteTitle() {
  const [state] = useStore();

  const id = state.activeNoteID;
  const note = state.notes[id];

  const [title, setTitle] = useState(note.title);
  const [setter, unmounted] = useSaveHandler<string>(2000, id, updateTitle);

  useEffect(() => {
    setTitle(note.title);
    return unmounted;
  }, [id, note.title, unmounted]);

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
      aria-label="Title of note"
      labelProps={{ htmlFor: id }}
    />
  );
}

export default NoteTitle;
