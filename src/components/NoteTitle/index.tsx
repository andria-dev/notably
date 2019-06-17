import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSaveHandler } from '../../hooks/';
import { updateTitle, useStore } from '../../store';

import { LabelledHx } from '../LabelledHx';
import './style.css';

function NoteTitle({ activeID }: { activeID: string }) {
  const [state] = useStore();
  const note = state.notes[activeID];

  const [title, setTitle] = useState(note.title);
  const [debouncedSave, save] = useSaveHandler<string>(
    2000,
    activeID,
    updateTitle
  );

  useEffect(() => {
    setTitle(note.title);
    return save;
  }, [note.title, save]);

  return (
    <LabelledHx
      size={1}
      hxProps={{
        type: 'input',
        value: title,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          setTitle(value);
          debouncedSave(value);
        },
        className: 'NoteTitle',
        id: activeID,
        'aria-label': 'Title of note'
      }}
      labelProps={{ htmlFor: activeID, className: 'NoteTitle__label' }}
      className="NoteTitle__wrapper"
    />
  );
}

export default NoteTitle;
