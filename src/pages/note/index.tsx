import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { RouteChildrenProps } from 'react-router';
import Header from '../../components/Header';
import Hx from '../../components/Hx';
import { IAction, setActiveNoteID, useStore } from '../../store';

import NoteModel from '../../models/Note';

import { MdKeyboardArrowLeft, MdMoreHoriz } from 'react-icons/md';
import Editor from '../../components/Editor';
import IconButton from '../../components/IconButton';
import NotesList from '../../components/NotesList';
import './style.css';

interface INoteProps {
  id: string;
  history: RouteChildrenProps['history'];
}
function Note({ id, history }: INoteProps) {
  // useEffect(() => {
  //   setEditorState(note.pages[currentPage].state);
  // }, [id]);

  // function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
  //   const value = event.target.value;
  //   updateNoteTitle(id, value).then(dispatch);
  // }

  return (
    <main className="Note">
      <section className="Note__sidebar shadow-lg">
        <Header>
          <Hx size={4}>Notes</Hx>
        </Header>
        <NotesList activeID={id} />
      </section>
      <section className="Note__main">
        <Header>
          <IconButton onClick={() => history.push('/')}>
            <MdKeyboardArrowLeft size={24} />
          </IconButton>
          <Hx
            size={4}
            type="input"
            // onChange={handleTitleChange}
            // value={note.title}
            className="Note__title"
          />
          <IconButton>
            <MdMoreHoriz size={24} />
          </IconButton>
        </Header>
        <Editor />
      </section>
    </main>
  );
}

interface INotePageParams {
  id: string;
}
function NotePage({ match, history }: RouteChildrenProps<INotePageParams>) {
  const [state, dispatch] = useStore();

  if (!match) {
    /* TODO: Display 404 Not Found */
    return null;
  }

  const id = match.params.id;
  if (state.activeNoteID !== id) {
    dispatch(setActiveNoteID(id));
  }

  if (state.loadedFromDB && !(id in state.notes)) {
    return (
      // TODO: replace `<main>` with a new component named `<Center>`
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <Hx size={4}>Note not found</Hx>
        {/* TODO: Replace with styled component button */}
        <button onClick={() => history.push('/')}>Return to home page</button>
      </main>
    );
  }

  if (!state.loadedFromDB) {
    return (
      // TODO: replace `<main>` with `<Center>`
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <Hx size={2}>Loading...</Hx>
      </main>
    );
  }

  return <Note id={match.params.id} history={history} />;
}

export default NotePage;
