import React, { useContext } from 'react';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { Link } from 'react-router-dom';
import Hx from '../Hx';
import Tag from '../Tag';

import { animated } from 'react-spring';
import { RequiredItemFields } from 'react-spring-grid/dist/components/Grid';
import Plain from 'slate-plain-serializer';

import classNames from '@chbphone55/classnames';
import { NoteRendererContext } from '../../contexts';
import { ObjectOf } from '../../lib/generic-types';
import Note from '../../models/Note';

const LinkStyles = { color: 'unset', textDecoration: 'none' };

export interface INoteData extends RequiredItemFields {
  id: string;
  note: Note;
}

interface INoteRendererProps {
  data: INoteData;
  style: ObjectOf<any>;
  index: number;
}

function NoteRenderer({ data, style }: INoteRendererProps) {
  const { id, note } = data;
  const { handleRemoveNote, activeID } = useContext(NoteRendererContext);

  /**
   * Gets the first line as follows:
   * * get the document
   * * get its first block
   * * get the leaves of the first node
   * * join the text on each leaf together
   */
  const noteContentSnippet = Plain.serialize(note.state).slice(0, 200);
  const menuID = `notes-list__${id}`;
  const isActive = activeID === id;

  style.transform = 'translateY(2rem)';

  return (
    <animated.div style={style}>
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
          style={LinkStyles}
          aria-current={isActive}
          aria-label={
            isActive
              ? `Current note, "${note.title}"`
              : `Go to note "${note.title}"`
          }
        >
          <article>
            <Hx size={6} weight={2} className="note__title truncate">
              {note.title}
            </Hx>
            <Hx
              size={6}
              weight={5}
              type="h2"
              className="note__modified truncate"
            >
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
    </animated.div>
  );
}

function handleCopyToClipboard(event: Event, { url }: { url: string }) {
  // @ts-ignore
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('Copied to clipboard!');
    })
    .catch(() => {
      alert(`Unable to copy, here is the value: ${url}`);
    });
}

export default NoteRenderer;
