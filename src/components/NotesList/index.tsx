import classNames from '@chbphone55/classnames';
import React, { useMemo } from 'react';
import Note from '../../models/Note';
import Hx from '../Hx';

import { Link } from 'react-router-dom';
import Tag from '../Tag';
import './style.css';

interface NotesListProps {
  notes: { [id: string]: Note };
  responsive?: Boolean;
  activeID?: string;
}

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
          .split('\n')[0]
          .slice(0, 100);

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
              <Hx size={0} weight={5} className="note__title truncate">
                {note.title}
              </Hx>
              <Hx
                size={0}
                weight={3}
                type="h2"
                className="note__modified truncate"
              >
                Last modified {note.timeSinceModified}
              </Hx>
              {noteContentSnippet.length ? (
                <p className="note__content truncate">{noteContentSnippet}</p>
              ) : (
                <Tag>No content</Tag>
              )}
            </article>
          </Link>
        );
      })}
    </section>
  );
}

export default NotesList;
