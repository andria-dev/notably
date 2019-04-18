import React, { useCallback } from 'react';
import { useBoolean } from '../../hooks';
import { getNotes, removeAllNotes, useStore } from '../../store';

import BottomModal from '../BottomModal';
import Hx from '../Hx';

interface ISettingsMenuProps {
  close: () => void;
  open: () => void;
  isOpen: boolean;
}
export function SettingsMenu({ close, isOpen }: ISettingsMenuProps) {
  const [, dispatch] = useStore();

  const importNotes = useCallback(() => {
    close();
  }, [close]);

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
        <button onClick={importNotes}>Import notes</button>
        <button onClick={exportNotes}>Export notes</button>
        <button onClick={deleteAll}>Delete all notes</button>
      </BottomModal>
    </>
  );
}

export function useSettingsMenu() {
  const { setFalse: close, setTrue: open, value: isOpen } = useBoolean(false);
  return [open, <SettingsMenu open={open} close={close} isOpen={isOpen} />];
}
