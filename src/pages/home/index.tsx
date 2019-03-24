import React from 'react';

import Note from '../../models/Note';
import { addNote, removeAllNotes, useStore } from '../../store';

import { MdAdd, MdSettings } from 'react-icons/md';
import { RouteChildrenProps } from 'react-router';
import DarkModeToggle from '../../components/DarkModeToggle';
import FAB from '../../components/FAB';
import Header from '../../components/Header';
import Hx from '../../components/Hx';
import IconButton from '../../components/IconButton';
import NotesList from '../../components/NotesList';

function Home({ history }: RouteChildrenProps) {
  const [, dispatch] = useStore();

  async function createNote() {
    const action = await addNote(new Note());
    dispatch(action);

    history.push(`/note/${action.payload.id}`);
  }

  return (
    <div className="Home">
      <Header>
        <Hx size={1}>Notably</Hx>
        <DarkModeToggle />
        {/* TODO: build menu component that pops up from bottom of screen */}
        {/* TODO: hook up settings button to said menu component */}
        <IconButton title="Open settings">
          <MdSettings size={24} />
        </IconButton>
      </Header>

      <NotesList responsive />

      <FAB title="Create a new note" onClick={createNote}>
        <MdAdd size={24} style={{ marginRight: '0.5rem' }} />
        New note
      </FAB>
    </div>
  );
}

export default Home;
