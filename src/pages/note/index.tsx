import React, {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { RouteChildrenProps } from 'react-router';
import Header from '../../components/Header';
import Hx from '../../components/Hx';
import { Action, updatePageState, useStore } from '../../store';

import { Editor, EditorState } from 'draft-js';
import { useDebouncedCallback } from 'use-debounce';
import { updateNoteTitle } from '../../actions';
import NoteModel from '../../models/Note';

import { MdKeyboardArrowLeft, MdMoreHoriz } from 'react-icons/md';
import IconButton from '../../components/IconButton';
import './style.css';

interface NoteProps {
  note: NoteModel;
  id: string;
  dispatch: React.Dispatch<Action>;
  history: RouteChildrenProps['history'];
}
function Note({ note, id, dispatch, history }: NoteProps) {
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    setEditorState(note.pages[currentPage].state);
  }, [currentPage]);

  const [editorState, setEditorState] = useState(note.pages[currentPage].state);
  const savePageState = useDebouncedCallback(
    async (value: EditorState) =>
      // @ts-ignore
      requestIdleCallback(
        async () => {
          const action = await updatePageState(id, currentPage, value);
          dispatch(action);
        },
        { timeout: 5000 },
      ),
    500,
    [id, currentPage],
  );

  function handleEditorStateChange(value: EditorState) {
    setEditorState(value);
    savePageState(value);
  }

  const [noteTitle, setNoteTitle] = useState(note.title);
  const saveNoteTitle = useDebouncedCallback(
    value =>
      // @ts-ignore
      requestIdleCallback(
        async () => {
          const action = await updateNoteTitle(id, value);
          dispatch(action);
        },
        { timeout: 5000 },
      ),
    250,
    [id],
  );
  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setNoteTitle(value);
    saveNoteTitle(value);
  }

  return (
    <main>
      {/* TODO: add side bar here + media query for desktop only */}
      <Header>
        <IconButton onClick={() => history.push('/')}>
          <MdKeyboardArrowLeft size={24} />
        </IconButton>
        <Hx
          size={4}
          type="input"
          onChange={handleTitleChange}
          value={noteTitle}
          className="Note__title"
        />
        <IconButton>
          <MdMoreHoriz size={24} />
        </IconButton>
      </Header>
      {editorState && (
        <Editor editorState={editorState} onChange={handleEditorStateChange} />
      )}
    </main>
  );
}

interface NotePageParams {
  id: string;
}
function NotePage({ match, history }: RouteChildrenProps<NotePageParams>) {
  const [state, dispatch] = useStore();

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

  return (
    <Note
      note={note}
      id={match.params.id}
      dispatch={dispatch}
      history={history}
    />
  );
}

export default NotePage;
