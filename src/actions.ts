import { Action } from './store';
import { keys, get, del, set } from 'idb-keyval';
import Note from './models/Note';
import uuid from 'uuid/v4';

export async function getNotesFromDB(): Promise<Action> {
  try {
    const noteIDs = await keys();
    const notes: { [s: string]: Note } = {};

    for (const id of noteIDs as Array<string>) {
      notes[id] = (await get(id)) as Note;
    }

    return {
      type: 'SET_NOTES',
      payload: notes,
    };
  } catch (error) {
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
      payload: 'Unable to remove your note. Please try again',
    };
  }
}

export async function addNoteToDB(note: Note) {
  const id = uuid();
  try {
    await set(id, note);
    return {
      type: 'NEW_NOTE',
      payload: {
        id,
        note,
      },
    };
  } catch (error) {
    return {
      type: 'ERROR',
      payload: 'Unable to add your new note to the database. Please try again',
    };
  }
}

export async function removePageFromDB(note: Note, pageIndex: number) {
  note.pages.splice(pageIndex, 1);
  try {
    
  }
}
