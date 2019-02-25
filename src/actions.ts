import { Action } from './store';
import { keys, get, del, set, clear } from 'idb-keyval';
import Note from './models/Note';
import Page from './models/Page';
import uuid from 'uuid/v4';
import { EditorState, ContentState } from 'draft-js';

async function getNote(id: string): Promise<Note> {
  const noteData: { [s: string]: any } = await get(id);
  noteData.pages = noteData.pages.map(
    (pageData: { [s: string]: string }) =>
      new Page(
        pageData.title,
        EditorState.createWithContent(
          ContentState.createFromText(pageData.state),
        ),
      ),
  );

  return new Note(noteData.title, noteData.pages, noteData.lastModified);
}

function setNote(id: string, note: Note): Promise<void> {
  const noteObj = {
    title: note.title,
    lastModified: note.lastModified,
    pages: note.pages.map(page => ({
      title: page.title,
      state: page.state.getCurrentContent().getPlainText(),
    })),
  };
  return set(id, noteObj);
}

export async function getNotes(): Promise<Action> {
  try {
    const noteIDs = await keys();
    const notes: { [s: string]: Note } = {};

    for (const id of noteIDs as string[]) {
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
    await setNote(id, note);
    return {
      type: 'ADD_NOTE',
      payload: { id, note },
    };
  } catch (error) {
    console.error(error);
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

    await setNote(noteID, note);

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

    await setNote(noteID, note);

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

    await setNote(noteID, note);

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

    await setNote(noteID, note);

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

    await setNote(noteID, note);

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

export async function removeAllNotes(): Promise<Action> {
  try {
    await clear();
    return {
      type: 'REMOVE_ALL_NOTES',
    };
  } catch {
    return {
      type: 'ERROR',
      payload: 'Unable to remove all notes. Please try again.',
    };
  }
}
