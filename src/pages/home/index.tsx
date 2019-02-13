import React from 'react';
import { useStore, addNote } from '../../store';
import Note from '../../models/Note';
import { removeAllNotes } from '../../actions';

function Home() {
  const [state, dispatch] = useStore();

  return (
    <main>
      <h1>Test</h1>
      <p>{JSON.stringify(state)}</p>
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
