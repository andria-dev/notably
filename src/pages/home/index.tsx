import React, { useCallback, useState } from 'react';

import Note from '../../models/Note';
import { addNote, getNotes, removeAllNotes, useStore } from '../../store';

import { MdAdd, MdSettings } from 'react-icons/md';
import { RouteChildrenProps } from 'react-router';
import DarkModeToggle from '../../components/DarkModeToggle';
import FAB from '../../components/FAB';
import Header from '../../components/Header';
import Hx from '../../components/Hx';
import IconButton from '../../components/IconButton';
import NotesList from '../../components/NotesList';

import BottomModal from '../../components/BottomModal';
import './style.css';

function Home({ history }: RouteChildrenProps) {
  const [, dispatch] = useStore();
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const closeSettings = useCallback(() => setSettingsOpen(false), [
    setSettingsOpen
  ]);

  const openSettings = useCallback(() => setSettingsOpen(true), [
    setSettingsOpen
  ]);

  const createNote = useCallback(async () => {
    const action = await addNote(new Note());
    dispatch(action);

    if (action.type === 'ADD_NOTE') {
      history.push(`/note/${action.payload.noteID}`);
    }
  }, [history, dispatch]);

  const importNotes = useCallback(async () => {}, []);

  const exportNotes = useCallback(async () => {
    const action = await getNotes();

    if (action.type === 'SET_NOTES') {
      const notes = Object.values(action.payload).map(note => note.export());
      // now we need to copy it to the clipboard!
    }
  }, []);

  const deleteAll = useCallback(async () => {
    const action = await removeAllNotes();
    dispatch(action);
    closeSettings();
  }, [dispatch, closeSettings]);

  return (
    <div className="Home">
      <Header>
        <Hx size={1}>Notably</Hx>
        <div className="Home__header-actions">
          <DarkModeToggle className="Home__dark-mode-toggle" />
          <IconButton title="Open settings" onClick={openSettings}>
            <MdSettings size={24} />
          </IconButton>
        </div>
      </Header>

      <NotesList responsive />

      <FAB title="Create a new note" onClick={createNote}>
        <MdAdd size={24} style={{ marginRight: '0.5rem' }} />
        New note
      </FAB>

      <BottomModal
        isOpen={isSettingsOpen}
        onRequestClose={closeSettings}
        className="Home__settings"
      >
        <Hx size={3} className="Home__settings-title">
          Settings
        </Hx>
        <button onClick={importNotes}>Import</button>
        <button onClick={exportNotes}>Export</button>
        <button onClick={deleteAll}>Delete all</button>
      </BottomModal>
    </div>
  );
}

export default Home;
