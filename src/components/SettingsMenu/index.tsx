import React, { useCallback, useState } from 'react';
import { useBoolean } from '../../hooks';
import {
  addNote,
  addNotes,
  getNotes,
  removeAllNotes,
  useStore
} from '../../store';

import Note, { INoteJSON } from '../../models/Note';
import Hx from '../Hx';
import BottomModal from '../Modal/BottomModal';
import CenterModal from '../Modal/CenterModal';

interface ISettingsMenuProps {
  close: () => void;
  isOpen: boolean;
}
export function SettingsMenu({ close, isOpen }: ISettingsMenuProps) {
  const [, dispatch] = useStore();

  const {
    setFalse: closeImport,
    setTrue: openImport,
    value: isImportOpen
  } = useBoolean(false);

  const openImportAndClose = useCallback(() => {
    openImport();
    close();
  }, [openImport, close]);

  const importNotes = useCallback(() => {
    function handleData(noteString: string) {
      let noteJSON: INoteJSON[];
      try {
        noteJSON = JSON.parse(noteString);
      } catch {
        alert('Invalid data');
        return;
      }

      const notes = noteJSON.map(json => Note.import(json));
      addNotes(notes).then(dispatch);
    }

    navigator.clipboard
      .readText()
      .then(handleData)
      .catch(() => {
        const promptString =
          'We were unable to read the data from your clipboard, try pasting it here:';
        const userInput = prompt(promptString);

        if (typeof userInput === 'string') {
          handleData(userInput);
        }
      });

    closeImport();
  }, [closeImport, dispatch]);

  const exportNotes = useCallback(async () => {
    const action = await getNotes();

    if (action.type === 'SET_NOTES') {
      const exportedNotes = JSON.stringify(
        Object.values(action.payload).map(note => note.export())
      );

      navigator.clipboard
        .writeText(exportedNotes)
        .then(() => {
          alert('Copied to clipboard!');
        })
        .catch(() => {
          alert('Unable to copy.');
        });
    }

    close();
  }, [close]);

  const deleteAll = useCallback(async () => {
    const action = await removeAllNotes();
    dispatch(action);
    close();
  }, [dispatch, close]);

  return (
    <>
      <BottomModal
        isOpen={isOpen}
        onRequestClose={close}
        className="Home__settings"
      >
        <Hx size={3} className="Home__settings-title">
          Settings
        </Hx>
        <button onClick={openImportAndClose}>Import notes</button>
        <button onClick={exportNotes}>Export notes</button>
        <button onClick={deleteAll}>Delete all notes</button>
      </BottomModal>

      <CenterModal
        isOpen={isImportOpen}
        onRequestClose={closeImport}
        className="SettingsMenu__import-modal"
      >
        <Hx size={3} className="SettingsMenu__import-title">
          Import Notes
        </Hx>
        <p>
          To import the notes you need to copy the value that was exported into
          your clipboard.
        </p>
        <p>
          Once you click the "Okay" button, you will be prompted to allow access
          to your clipboard and the notes will be imported.
        </p>
        <button onClick={importNotes}>Okay</button>
      </CenterModal>
    </>
  );
}

export function useSettingsMenu() {
  const { setFalse: close, setTrue: open, value: isOpen } = useBoolean(false);
  return [open, <SettingsMenu close={close} isOpen={isOpen} />];
}
