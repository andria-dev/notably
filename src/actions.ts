import { Action } from './store';
import { keys, get, del, set } from 'idb-keyval';
import Note from './models/Note';
import Page from './models/Page';
import uuid from 'uuid/v4';

async function getNote(id: string): Promise<Note> {
  const noteData: Note = (await get(id)) as Note;
  noteData.pages = noteData.pages.map(
    (pageData: Page) => new Page(pageData.title, pageData.state),
  );
  return new Note(noteData.title, noteData.pages, noteData.lastModified);
}

export async function getNotes(): Promise<Action> {
  try {
    const noteIDs = await keys();
    const notes: { [s: string]: Note } = {};

    for (const id of noteIDs as Array<string>) {
      notes[id] = await getNote(id);
    }

    return {
      type: 'SET_NOTES',
      payload: notes,
    };
  } catch {
    return {
      type: 'ERROR',
      payload: 'Unable to get your saved notes from your database.',
    };
  }
}

export async function removeNote(noteID: string): Promise<Action> {
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

export async function addNote(note: Note): Promise<Action> {
  const id = uuid();
  try {
    await set(id, note);
    return {
      type: 'NEW_NOTE',
      payload: { id, note },
    };
  } catch {
    return {
      type: 'ERROR',
      payload: 'Unable to add your new note to the database. Please try again',
    };
  }
}

export async function removePage(
  noteID: string,
  pageIndex: number,
): Promise<Action> {
  try {
    const note: Note = await getNote(noteID);
    note.pages.splice(pageIndex, 1);
    await set(noteID, note);

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note },
    };
  } catch {
    return {
      type: 'ERROR',
      payload: 'Unable to remove your page from this note. Please try again',
    };
  }
}

export async function addPage(noteID: string): Promise<Action> {
  try {
    const note: Note = await getNote(noteID);
    note.pages.push(new Page());

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note },
    };
  } catch {
    return {
      type: 'ERROR',
      payload: 'Unable to add a page to this note. Please try again',
    };
  }
}
