import React, { useMemo } from 'react';
import Note from '../../models/Note';
import Title from '../Title';
import classNames from '@chbphone55/classnames';

type NotesListProps = {
  notes: { [id: string]: Note };
  responsive?: Boolean;
};

function NotesList({ notes, responsive = false }: NotesListProps) {
  const sortedNotes = useMemo(
    () =>
      Object.entries(notes).sort(
        ([, noteA], [, noteB]) =>
          noteB.lastModified.getTime() - noteA.lastModified.getTime(),
      ),
    [notes],
  );

  return (
    <section className={classNames('NotesList', { responsive })}>
      {sortedNotes.map(([noteID, note]) => {
        function openNote() {
          /* TODO: open the note */
          console.log(note);
        }

        return (
          <article onClick={openNote} key={noteID}>
            <Title>{note.title}</Title>
            <p>{note.timeSinceModified}</p>
          </article>
        );
      })}
    </section>
  );
}

export default NotesList;
