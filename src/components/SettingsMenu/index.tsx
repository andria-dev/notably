import React, { RefObject, useCallback, useRef } from 'react';
import { animated, ReactSpringHook, useChain, useSpring } from 'react-spring';
import { useBoolean } from '../../hooks';
import { addNotes, removeAllNotes, useStore } from '../../store';

import Note, { INoteJSON } from '../../models/Note';
import Hx from '../Hx';
import BottomModal from '../Modal/BottomModal';
import CenterModal, { useCenterModalTransition } from '../Modal/CenterModal';

import Button from '../Button';
import './style.css';

interface ISettingsMenuProps {
  close: () => void;
  isOpen: boolean;
}
export function SettingsMenu({ close, isOpen }: ISettingsMenuProps) {
  const [{ notes }, dispatch] = useStore();

  const {
    setFalse: closeImport,
    setTrue: openImport,
    value: isImportOpen
  } = useBoolean(false);

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

    function promptUser() {
      const promptString =
        'We were unable to read the data from your clipboard, try pasting it here:';
      const userInput = prompt(promptString);

      if (typeof userInput === 'string') {
        handleData(userInput);
      }
    }

    if (navigator.clipboard.readText) {
      navigator.clipboard
        .readText()
        .then(handleData)
        .catch(promptUser);
    } else {
      promptUser();
    }

    closeImport();
  }, [closeImport, dispatch]);

  const exportNotes = useCallback(async () => {
    const exportedNotes = JSON.stringify(
      Object.values(notes).map(note => note.export())
    );

    navigator.clipboard
      .writeText(exportedNotes)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(() => {
        // Couldn't copy, so we're downloading the file now
        const message =
          'Unable to copy automatically, would you like to download the data?';

        // eslint-disable-next-line no-restricted-globals
        if (confirm(message)) {
          const uriContent = `data:application/octet-stream,${encodeURIComponent(
            exportedNotes
          )}`;
          const a = document.createElement('a');
          a.href = uriContent;
          a.download = 'notes-backup.json';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });

    close();
  }, [close, notes]);

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
        <button onClick={openImport}>Import notes</button>
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
        <Button onClick={importNotes}>Okay</Button>
      </CenterModal>
    </>
  );
}

export function useSettingsMenu() {
  const { setFalse: close, setTrue: open, value: isOpen } = useBoolean(false);
  return [open, <SettingsMenu close={close} isOpen={isOpen} />];
}
