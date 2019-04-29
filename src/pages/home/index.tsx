import React, { useCallback } from 'react';

import Note from '../../models/Note';
import { addNote, useStore } from '../../store';

import { MdAdd, MdSettings } from 'react-icons/md';
import { RouteChildrenProps } from 'react-router';
import DarkModeToggle from '../../components/DarkModeToggle';
import FAB from '../../components/FAB';
import Header from '../../components/Header';
import Hx from '../../components/Hx';
import IconButton from '../../components/IconButton';
import NotesList from '../../components/NotesList';
import { useSettingsMenu } from '../../components/SettingsMenu';

import './style.css';

function Home({ history }: RouteChildrenProps) {
  const [, dispatch] = useStore();
  const [openSettings, settingsMenu] = useSettingsMenu();

  const createNote = useCallback(async () => {
    const action = await addNote(new Note());
    dispatch(action);

    if (action.type === 'ADD_NOTE') {
      history.push(`/note/${action.payload.noteID}`);
    }
  }, [history, dispatch]);

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

      {settingsMenu}
    </div>
  );
}

export default Home;
