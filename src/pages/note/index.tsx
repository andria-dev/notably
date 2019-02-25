import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { RouteChildrenProps } from 'react-router';
import Header from '../../components/Header';
import Hx from '../../components/Hx';
import { updatePageState, useStore } from '../../store';

import { Editor, EditorState } from 'draft-js';
import { useDebouncedCallback } from 'use-debounce';
import { updateNoteTitle } from '../../actions';

function Note({});

interface NotePageParams {
  id: string;
}
function NotePage({ match, history }: RouteChildrenProps<NotePageParams>) {
  const [state, dispatch] = useStore();

  const [currentPage, _setCurrentPage] = useState(0);
  function setCurrentPage(index: number) {
    _setCurrentPage(index);

    // side effect, update editor state to page
    if (!localState && match && state.notes[match.params.id]) {
      setLocalState(state.notes[match.params.id].pages[index].state);
    }
  }

  const [localState, setLocalState] = useState<EditorState | null>(null);

  const autoSave = useDebouncedCallback(
    async value => {
      if (!match) {
        return;
      }
      const action = await updatePageState(match.params.id, currentPage, value);
      dispatch(action);
    },
    100,
    [match, currentPage],
  );
  const saveTitle = useDebouncedCallback(
    async (value: string) => {
      if (!match) {
        return;
      }
      const action = await updateNoteTitle(match.params.id, value);
      dispatch(action);
    },
    100,
    [match],
  );

  useEffect(() => {
    if (match) {
      setCurrentPage(0);
    } else {
      setLocalState(null);
    }
  }, [match]);

  if (!match) {
    /* TODO: Display 404 Not Found */
    return null;
  }

  const id = match.params.id;
  const note = state.notes[id];

  if (state.loadedFromDB && !note) {
    return (
      // TODO: replace `<main>` with a new component named `<Center>`
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
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
          height: '100vh',
        }}
      >
        <Hx size={2}>Loading...</Hx>
      </main>
    );
  }

  function handleStateChange(value: EditorState) {
    setLocalState(value);
    // @ts-ignore
    requestIdleCallback(() => autoSave(value));
  }

  return (
    <main>
      {/* TODO: add side bar here + media query for desktop only */}
      <Header>
        <Hx
          size={4}
          contentEditable
          suppressContentEditableWarning
          onInput={(event: SyntheticEvent) =>
            // @ts-ignore
            saveTitle(event.target.textContent)
          }
          // Prevents newlines
          onKeyPress={(event: KeyboardEvent) =>
            event.key === 'Enter' && event.preventDefault()
          }
        >
          {note.title}
        </Hx>
      </Header>
      {localState && (
        <Editor editorState={localState} onChange={handleStateChange} />
      )}
    </main>
  );
}

export default NotePage;
