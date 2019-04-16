import { clear, del, get, keys, set } from 'idb-keyval';
import { Value } from 'slate';
import uuid from 'uuid/v4';
import Note from '../models/Note';
import { IAction, IActionEmpty } from './';

async function getNote(id: string): Promise<Note> {
  return Note.import(await get(id));
}

function setNote(id: string, note: Note): Promise<void> {
  return set(id, note.export());
}

function createError(message: string, instance: Error): IAction {
  return {
    type: 'ERROR',
    payload: { message, instance }
  };
}

export async function getNotes(): Promise<IAction> {
  try {
    const noteIDs = await keys();
    const notes: { [s: string]: Note } = {};

    for (const id of noteIDs as string[]) {
      notes[id] = await getNote(id);
    }

    return {
      type: 'SET_NOTES',
      payload: notes
    };
  } catch (error) {
    return createError(
      'Unable to get your saved notes from your database.',
      error
    );
  }
}

export async function removeNote(noteID: string): Promise<IAction> {
  try {
    await del(noteID);
    return {
      type: 'REMOVE_NOTE',
      payload: noteID
    };
  } catch (error) {
    return createError('Unable to remove your note. Please try again.', error);
  }
}

export async function addNote(note: Note): Promise<IAction> {
  const noteID = uuid();
  try {
    await setNote(noteID, note);
    return {
      type: 'ADD_NOTE',
      payload: { noteID, note }
    };
  } catch (error) {
    return createError(
      'Unable to add your new note to the database. Please try again.',
      error
    );
  }
}

export async function updateTitle(
  noteID: string,
  newTitle: string
): Promise<IAction> {
  try {
    const note: Note = await getNote(noteID);
    note.title = newTitle;

    await setNote(noteID, note);

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note }
    };
  } catch (error) {
    return createError(
      "Unable to update your note's title. Please try again.",
      error
    );
  }
}

export async function updateState(
  noteID: string,
  newState: Value,
  updateLastModified?: boolean
): Promise<IAction> {
  try {
    const note: Note = await getNote(noteID);
    note.state = newState;

    if (updateLastModified) {
      note.updateLastModified();
    }

    await setNote(noteID, note);

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note }
    };
  } catch (error) {
    return createError('Unable to save the content of your note.', error);
  }
}

export async function removeAllNotes(): Promise<IAction | IActionEmpty> {
  try {
    await clear();
    return {
      type: 'REMOVE_ALL_NOTES'
    };
  } catch (error) {
    return createError('Unable to remove all notes. Please try again.', error);
  }
}

export function setActiveNoteID(id: string): IAction {
  return {
    type: 'SET_ACTIVE_NOTE_ID',
    payload: id
  };
}
