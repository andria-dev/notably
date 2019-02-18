import React from 'react';

import { useStore, addNote } from '../../store';
import { removeAllNotes } from '../../actions';
import Note from '../../models/Note';

import Header from '../../components/Header';
import Title from '../../components/Title';
import IconButton from '../../components/IconButton';
import { MdSettings } from 'react-icons/md';

function Home() {
  const [, dispatch] = useStore();

  return (
    <main className="Home">
      <Header>
        <Title size={4}>Notably</Title>
        <IconButton>
          <MdSettings size={24} />
        </IconButton>
      </Header>
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
