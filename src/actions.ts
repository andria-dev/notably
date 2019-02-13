import { Action } from './store';
import { keys, get, del, set } from 'idb-keyval';
import Note from './models/Note';
import Page from './models/Page';
import uuid from 'uuid/v4';
import { EditorState } from 'draft-js';

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
      payload: 'Unable to remove your note. Please try again.',
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
      payload: 'Unable to add your new note to the database. Please try again.',
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
    note.updateLastModified();

    await set(noteID, note);

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note },
    };
  } catch {
    return {
      type: 'ERROR',
      payload: 'Unable to remove your page from this note. Please try again.',
    };
  }
}

export async function addPage(noteID: string): Promise<Action> {
  try {
    const note: Note = await getNote(noteID);
    note.pages.push(new Page());
    note.updateLastModified();

    await set(noteID, note);

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note },
    };
  } catch {
    return {
      type: 'ERROR',
      payload: 'Unable to add a page to this note. Please try again.',
    };
  }
}

export async function updateNoteTitle(noteID: string, newTitle: string) {
  try {
    const note: Note = await getNote(noteID);
    note.title = newTitle;
    note.updateLastModified();

    await set(noteID, note);

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note },
    };
  } catch {
    return {
      type: 'ERROR',
      payload: "Unable to update your note's title. Please try again.",
    };
  }
}

export async function updatePageTitle(
  noteID: string,
  pageIndex: number,
  newTitle: string,
) {
  try {
    const note: Note = await getNote(noteID);
    note.pages[pageIndex].title = newTitle;
    note.updateLastModified();

    await set(noteID, note);

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note },
    };
  } catch {
    return {
      type: 'ERROR',
      payload: "Unable to update your page's title. Please try again.",
    };
  }
}

export async function updatePageState(
  noteID: string,
  pageIndex: number,
  newState: EditorState,
): Promise<Action> {
  try {
    const note: Note = await getNote(noteID);
    note.pages[pageIndex].state = newState;
    note.updateLastModified();

    await set(noteID, note);

    return {
      type: 'UPDATE_NOTE',
      payload: { noteID, note },
    };
  } catch {
    return {
      type: 'ERROR',
      payload: 'Unable to save the content of your note.',
    };
  }
}

export function setActiveNote(noteID: string): Action {
  return {
    type: 'SET_CURRENT_NOTE',
    payload: noteID,
  };
}

export function setActivePage(pageIndex: number): Action {
  return {
    type: 'SET_CURRENT_PAGE',
    payload: pageIndex,
  };
}
