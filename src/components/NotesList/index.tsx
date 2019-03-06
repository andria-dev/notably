import React, { Fragment, useMemo } from 'react';

import classNames from '@chbphone55/classnames';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import Hx from '../Hx';
import Tag from '../Tag';

import { removeNote, useStore } from '../../store';
import './contextmenu.css';
import './style.css';

interface INotesListProps {
  className?: any;
  responsive?: boolean;
  activeID?: string;
  [s: string]: any;
}

function NotesList({ className, responsive = false, activeID, ...props }: INotesListProps) {
  const [{ notes }, dispatch] = useStore();

  const sortedNotes = useMemo(
    () =>
      Object.entries(notes).sort(
        ([, noteA], [, noteB]) => noteB.lastModified.getTime() - noteA.lastModified.getTime()
      ),
    [notes]
  );

  async function handleRemoveNote(event: Event, { id }: { id: string }) {
    dispatch(await removeNote(id));
  }

  return (
    <section
      className={classNames(className, 'NotesList', {
        'NotesList--responsive': responsive
      })}
      {...props}
    >
      {sortedNotes.map(([id, note]) => {
        const noteContentSnippet = note.pages[note.pages.length - 1].state
          .getCurrentContent()
          .getPlainText()
          .split('\n')[0]
          .slice(0, 100);
        const menuID = `notes-list__${id}`;
        const isActive = activeID === id;

        return (
          <Fragment key={id}>
            <ContextMenuTrigger
              id={menuID}
              attributes={{
                className: classNames('NotesList__note', {
                  'NotesList__note--active': isActive
                })
              }}
            >
              <Link to={`/note/${id}`} style={{ color: 'unset', textDecoration: 'none' }}>
                <article>
                  <Hx size={0} weight={5} className="note__title truncate">
                    {note.title}
                  </Hx>
                  {isActive ? null : (
                    <Hx size={0} weight={3} type="h2" className="note__modified truncate">
                      Last modified {note.timeSinceModified}
                    </Hx>
                  )}
                  {noteContentSnippet.length ? (
                    <p className="note__content truncate">{noteContentSnippet}</p>
                  ) : (
                    <Tag>No content</Tag>
                  )}
                </article>
              </Link>
            </ContextMenuTrigger>
            <ContextMenu className="shadow" id={menuID}>
              <MenuItem data={{ id }} onClick={handleRemoveNote}>
                Delete note
              </MenuItem>
              <MenuItem
                data={{ url: `${location.origin}/note/${id}` }}
                onClick={handleCopyToClipboard}
              >
                Copy link
              </MenuItem>
            </ContextMenu>
          </Fragment>
        );
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
      // TODO: replace with snackbar or similar
      alert('Unable to copy');
    });
}

export default NotesList;
