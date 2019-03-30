import React, { Fragment, useContext, useMemo } from 'react';
// @ts-ignore
import { __RouterContext as RouterContext } from 'react-router';

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
  const [{ notes, activeNoteID }, dispatch] = useStore();

  const sortedNotes = useMemo(
    () =>
      Object.entries(notes).sort(
        ([, noteA], [, noteB]) => noteB.lastModified.getTime() - noteA.lastModified.getTime()
      ),
    [notes]
  );

  const { history } = useContext(RouterContext);
  async function handleRemoveNote(event: Event, { id }: { id: string }) {
    dispatch(await removeNote(id));
    if (activeNoteID === id) {
      history.replace('/');
    }
  }

  const Component = responsive ? 'main' : 'section';

  return (
    <Component
      className={classNames(className, 'NotesList', {
        'NotesList--responsive': responsive
      })}
      {...props}
    >
      {sortedNotes.map(([id, note]) => {
        const noteContentSnippet = note.state.texts.first().getText();
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
              <Link
                to={`/note/${id}`}
                style={{ color: 'unset', textDecoration: 'none' }}
                aria-current={isActive}
                aria-selected={isActive}
              >
                <article>
                  <Hx size={6} weight={2} className="note__title truncate">
                    {note.title}
                  </Hx>
                  <Hx size={6} weight={5} type="h2" className="note__modified truncate">
                    Last modified {note.timeSinceModified()}
                  </Hx>
                  {noteContentSnippet.length ? (
                    <p className="note__content truncate" aria-hidden>
                      {noteContentSnippet}
                    </p>
                  ) : (
                    <Tag aria-hidden>No content</Tag>
                  )}
                </article>
              </Link>
            </ContextMenuTrigger>
            <ContextMenu className="shadow" id={menuID}>
              <MenuItem data={{ id }} onClick={handleRemoveNote}>
                Delete note
              </MenuItem>
              <MenuItem
                data={{ url: `${window.location.origin}/note/${id}` }}
                onClick={handleCopyToClipboard}
              >
                Copy link
              </MenuItem>
            </ContextMenu>
          </Fragment>
        );
      })}
    </Component>
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
