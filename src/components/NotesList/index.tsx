import React, { useCallback, useContext, useMemo } from 'react';
// @ts-ignore
import { __RouterContext as RouterContext } from 'react-router';
import { removeNote, useStore } from '../../store';

import { animated } from 'react-spring';
import { Grid } from 'react-spring-grid';
import { useTransition } from '../../hooks';
import createNoteRenderer, { INoteData } from './NoteRenderer';
import { ReactComponent as NotesListSVG } from './notes-list.svg';

import { ObjectOf } from '../../lib/generic-types';

import classNames from '@chbphone55/classnames';
import './contextmenu.css';
import './style.css';

interface INotesListProps extends ObjectOf<any> {
  className?: any;
  responsive?: boolean;
  activeID?: string;
}

const notesDataKeyMapper = (item: any) => item.id;

const opaqueTransition = { from: { position: 'absolute', opacity: 1 } };
function NotesList({
  className,
  responsive = false,
  activeID,
  ...props
}: INotesListProps) {
  const [{ notes, activeNoteID, loadedFromDB }, dispatch] = useStore();

  const { history } = useContext(RouterContext);
  const handleRemoveNote = useCallback(
    async (event: Event, { id }: { id: string }) => {
      dispatch(await removeNote(id));
      if (activeNoteID === id) {
        history.replace('/');
      }
    },
    [activeNoteID, history]
  );

  const notesData: INoteData[] = useMemo(() => {
    return Object.entries(notes)
      .sort(([, noteA], [, noteB]) => {
        return noteB.lastModified.getTime() - noteA.lastModified.getTime();
      })
      .map(([id, note]) => {
        const data: INoteData = {
          id,
          note,
          width: responsive ? 288 : 236,
          height: 94
        };
        return data;
      });
  }, [notes]);

  const Component = responsive ? 'main' : 'section';
  const emptyTransition = useTransition(
    !notesData.length && loadedFromDB,
    null,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
    }
  );

  const NoteRenderer = useMemo(
    () => createNoteRenderer(handleRemoveNote, activeID),
    []
  );

  return (
    <Component
      className={classNames(className, 'NotesList', {
        'NotesList--responsive': responsive,
        'NotesList--empty': !notesData.length
      })}
      {...props}
    >
      <Grid
        items={notesData}
        keys={notesDataKeyMapper}
        renderer={NoteRenderer}
        wrapper="div"
        columnGap={32}
        rowGap={16}
        transitionProps={opaqueTransition}
      />
      {emptyTransition.map(
        ({ item, key, props }) =>
          item && (
            <animated.article
              className="NotesList__placeholder"
              key={key}
              style={props}
            >
              <figure>
                <NotesListSVG className="NotesList__placeholder-svg" />
                <figcaption className="NotesList__placeholder-text">
                  You don't have any notes yet. Try creating one using the "New
                  Note" button.
                </figcaption>
              </figure>
            </animated.article>
          )
      )}
    </Component>
  );
}

export default NotesList;
