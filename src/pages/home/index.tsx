import React from 'react';

import Note from '../../models/Note';
import { addNote, removeAllNotes, useStore } from '../../store';

import { MdAdd, MdSettings } from 'react-icons/md';
import { RouteChildrenProps } from 'react-router';
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
    <main className="Home">
      <Header>
        <Hx size={4}>Notably</Hx>
        {/* TODO: build menu component that pops up from bottom of screen */}
        {/* TODO: hook up settings button to said menu component */}
        <IconButton>
          <MdSettings size={24} />
        </IconButton>
      </Header>

      <NotesList responsive />

      {/* TODO: build FAB to replace button below */}
      <FAB onClick={createNote}>
        <MdAdd size={24} style={{ marginRight: '0.5rem' }} />
        New note
      </FAB>
    </main>
  );
}

export default Home;
