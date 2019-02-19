import React, { useMemo } from 'react';
import Note from '../../models/Note';
import classNames from '@chbphone55/classnames';
import Hx from '../Hx';

import './style.css';
import { Link } from 'react-router-dom';

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
        const noteContentSnippet = note.pages[note.pages.length - 1].state
          .getCurrentContent()
          .getPlainText()
          .slice(0, 36);

        return (
          <Link
            to={`/note/${noteID}`}
            style={{ color: 'unset', textDecoration: 'none' }}
            className={classNames('NotesList__note', {
              'NotesList__note--active': activeID === noteID,
            })}
            key={noteID}
          >
            <article>
              <Hx size={0} weight={4} className="note__title">
                {note.title}
              </Hx>
              <Hx size={0} weight={3} type="h2" className="note__modified">
                Last modified {note.timeSinceModified}
              </Hx>
              <p
                style={{
                  color: 'hsl(0, 0%, 40%)',
                  margin: '0',
                  fontWeight: 200,
                }}
              >
                {noteContentSnippet}
              </p>
            </article>
          </Link>
        );
      })}
    </section>
  );
}

export default NotesList;
