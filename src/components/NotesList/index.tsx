import React, { useMemo } from 'react';

import classNames from '@chbphone55/classnames';
import { removeNote } from '../../actions';
import Note from '../../models/Note';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import Hx from '../Hx';
import Tag from '../Tag';

import { useStore } from '../../store';
import './contextmenu.css';
import './style.css';

interface NotesListProps {
  responsive?: Boolean;
  activeID?: string;
}

function NotesList({ responsive = false, activeID }: NotesListProps) {
  const [{ notes }, dispatch] = useStore();

  const sortedNotes = useMemo(
    () =>
      Object.entries(notes).sort(
        ([, noteA], [, noteB]) =>
          noteB.lastModified.getTime() - noteA.lastModified.getTime(),
      ),
    [notes],
  );

  async function handleRemoveNote(event: Event, { id }: { id: string }) {
    dispatch(await removeNote(id));
  }

  return (
    <section
      className={classNames('NotesList', {
        'NotesList--responsive': responsive,
      })}
    >
      {sortedNotes.map(([id, note]) => {
        const noteContentSnippet = note.pages[note.pages.length - 1].state
          .getCurrentContent()
          .getPlainText()
          .split('\n')[0]
          .slice(0, 100);
        const menuID = `notes-list__${id}`;

        return [
          <ContextMenuTrigger
            id={menuID}
            key={id}
            attributes={{
              className: classNames('NotesList__note', {
                'NotesList__note--active': activeID === id,
              }),
            }}
          >
            <Link
              to={`/note/${id}`}
              style={{ color: 'unset', textDecoration: 'none' }}
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
          </ContextMenuTrigger>,
          <ContextMenu id={menuID}>
            <MenuItem data={{ id }} onClick={handleRemoveNote}>
              Delete note
            </MenuItem>
            <MenuItem
              data={{ url: `${location.origin}/note/${id}` }}
              onClick={handleCopyToClipboard}
            >
              Copy link
            </MenuItem>
          </ContextMenu>,
        ];
      })}
    </section>
  );
}

function handleCopyToClipboard(event: Event, { url }: { url: string }) {
  // @ts-ignore
  navigator.clipboard
    .writeText(url)
    .then(() => {
      // TODO: notify the user of success
    })
    .catch((error: Error) => {
      console.log(error);
      // TODO: replace with snackbar or similar
      alert('Unable to copy');
    });
}

export default NotesList;
