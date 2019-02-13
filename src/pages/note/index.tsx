import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { RouteChildrenProps } from 'react-router';

interface NoteParams {
  id: string;
}

function Note({ match }: RouteChildrenProps<NoteParams>) {
  const [state, dispatch] = useStore();

  /* useEffect(() => {
    if (match && state.notes[match.params.id]) {
      dispatch(setCurrentNote(match.params.id));
    } else {
      dispatch(setCurrentNote(null));
    }
    console.log(match);
  }, [match, state]); */
  if (!match) {
    /* Reroute to 404 */
    return null;
  }

  const note = state.notes[match.params.id];
  console.log(state, note);

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
