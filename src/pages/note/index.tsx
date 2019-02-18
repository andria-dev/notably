import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { RouteChildrenProps } from 'react-router';

interface NoteParams {
  id: string;
}

function Note({ match }: RouteChildrenProps<NoteParams>) {
  const [state, dispatch] = useStore();

  if (!match) {
    /* Reroute to 404 */
    return null;
  }

  const note = state.notes[match.params.id];

  return (
    <main>
      {note ? (
        <header>
          <h1>{note.title}</h1>
        </header>
      ) : (
        <p>loading...</p>
      )}
    </main>
  );
}

export default Note;
