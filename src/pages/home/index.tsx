import React from 'react';

import { useStore, addNote } from '../../store';
import { removeAllNotes } from '../../actions';
import Note from '../../models/Note';

import Header from '../../components/Header';
import IconButton from '../../components/IconButton';
import { MdSettings } from 'react-icons/md';
import NotesList from '../../components/NotesList';
import Hx from '../../components/Hx';

function Home() {
  const [{ notes }, dispatch] = useStore();

  return (
    <main className="Home">
      <Header>
        <Hx size={4}>Notably</Hx>
        <IconButton>
          <MdSettings size={24} />
        </IconButton>
      </Header>

      <NotesList notes={notes} responsive />

      <button onClick={() => addNote(new Note()).then(dispatch)}>
        New note
      </button>
      <button onClick={() => removeAllNotes().then(dispatch)}>
        Remove all notes
      </button>
    </main>
  );
}

export default Home;
