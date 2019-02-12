import { Action } from './store';
import { keys, get, del } from 'idb-keyval';

export async function getNotesFromDB(): Promise<Action> {
  try {
    const noteIDs = await keys();
    const notes = await Promise.all(noteIDs.map(id => get(id)));

    return {
      type: 'SET_NOTES',
      payload: notes,
    };
  } catch (error) {
    console.error('> Unable to get notes from database', error);
    return {
      type: 'ERROR',
      payload: 'Unable to get your saved notes from your database.',
    };
  }
}

export async function removeNoteFromDB(noteID: string) {
  try {
    await del(noteID);
    return {
      type: 'REMOVE_NOTE',
      payload: noteID,
    };
  } catch (error) {
    return {
      type: 'ERROR',
      payload: 'Unable to remove your note. Try again',
    };
  }
}
