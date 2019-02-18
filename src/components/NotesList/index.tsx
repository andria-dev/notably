import React, { useMemo } from 'react';
import Note from '../../models/Note';
import classNames from '@chbphone55/classnames';
import Hx from '../Hx';

import './style.css';

type NotesListProps = {
  notes: { [id: string]: Note };
  responsive?: Boolean;
  activeID?: string;
};

function NotesList({ notes, responsive = false, activeID }: NotesListProps) {
  const sortedNotes = useMemo(
    () =>
      Object.entries(notes).sort(
        ([, noteA], [, noteB]) =>
          noteB.lastModified.getTime() - noteA.lastModified.getTime(),
      ),
    [notes],
  );

  return (
    <section
      className={classNames('NotesList', {
        'NotesList--responsive': responsive,
      })}
    >
      {sortedNotes.map(([noteID, note]) => {
        function openNote() {
          /* TODO: open the note */
          console.log(note);
        }

        return (
          <article
            className={classNames('NotesList__note', {
              'NotesList__note--active': activeID === noteID,
            })}
            onClick={openNote}
            key={noteID}
          >
            <Hx size={0} weight={4} className="note__title">
              {note.title}
            </Hx>
            <Hx size={0} weight={3} type="h2" className="note__modified">
              Last modified {note.timeSinceModified}
            </Hx>
          </article>
        );
      })}
    </section>
  );
}

export default NotesList;
