import { useContext, createContext, ReducerState, Dispatch } from 'react';
import Note from './models/Note';
import Page from './models/Page';

export interface Action {
  type: string;
  payload: any;
}

interface State extends ReducerState<any> {
  notes: { [s: string]: Note };
  loadedFromDB: boolean;
  currentNote: string | null;
  currentPage: number | null;
  error: string | null;
}

export const initialState: State = {
  notes: {},
  loadedFromDB: false,
  currentNote: null,
  currentPage: null,
  error: null,
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
      };

    case 'ADD_NOTE':
      return {
        ...state,
        notes: { ...state.notes, [action.payload.id]: action.payload.note },
      };

    case 'REMOVE_NOTE':
      const {
        [action.payload]: {},
        ...newNotes
      } = state.notes;
      return {
        ...state,
        notes: newNotes,
      };

    case 'ADD_PAGE':
      if (state.currentNote) {
        state.notes[state.currentNote].pages.push(new Page());
        return { ...state };
      }

    case 'REMOVE_PAGE':
      if (state.currentNote) {
        state.notes[state.currentNote].pages.splice(action.payload, 1);
        return { ...state };
      }

    case 'SET_CURRENT_NOTE':
      return {
        ...state,
        currentNote: action.payload,
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };

    case 'SET_NOTE_TITLE':
      if (state.currentNote) {
        const note = state.notes[state.currentNote];
        note.title = action.payload;
        note.updateLastModified();

        return { ...state };
      }

    case 'SET_PAGE_TITLE':
      if (state.currentNote && state.currentPage) {
        const note = state.notes[state.currentNote];
        const page = note.pages[state.currentPage];

        page.title = action.payload;
        note.updateLastModified();

        return { ...state };
      }

    case 'SET_PAGE_CONTENT':
      if (state.currentNote && state.currentPage) {
        const note = state.notes[state.currentNote];
        const page = note.pages[state.currentPage];

        page.state = action.payload;
        note.updateLastModified();

        return { ...state };
      }

    case 'ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLOSE_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

export const StoreContext = createContext([
  initialState,
  (action: Action) => {},
]);

export function useStore(): [State, Dispatch<Action>] {
  // @ts-ignore
  return useContext(StoreContext);
}

export * from './actions';
