import { useContext, createContext, ReducerState, Dispatch } from 'react';
import Note from './models/Note';
import Page from './models/Page';

interface Action {
  type: string;
  payload: any;
}

interface State extends ReducerState<any> {
  notes: Note[];
  loadedFromDB: boolean;
  currentNoteIndex: number | null;
  currentPageIndex: number | null;
}

export const initialState: State = {
  notes: [],
  loadedFromDB: false,
  currentNoteIndex: null,
  currentPageIndex: null,
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
        notes: state.notes.concat(new Note()),
      };
    case 'REMOVE_NOTE':
      return {
        ...state,
        notes: [
          ...state.notes.slice(0, action.payload),
          ...state.notes.slice(action.payload),
        ],
      };
    case 'ADD_PAGE':
      if (state.currentNoteIndex !== null) {
        state.notes[state.currentNoteIndex].pages.push(new Page());
        return {
          ...state,
          notes: [...state.notes],
        };
      }
    case 'REMOVE_PAGE':
      if (state.currentPageIndex !== null) {
        state.notes[state.currentNoteIndex].pages.splice(action.payload, 1);
        return {
          ...state,
          notes: [...state.notes],
        };
      }
    case 'SET_CURRENT_NOTE':
      return {
        ...state,
        currentNoteIndex: action.payload,
      };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPageIndex: action.payload,
      };
    case 'SET_NOTE_TITLE':
      state.notes[state.currentNoteIndex].title = action.payload;
      return {
        ...state,
        notes: [...state.notes],
      };
    case 'SET_PAGE_TITLE':
      state.notes[state.currentNoteIndex].pages[state.currentPageIndex].title =
        action.payload;
    default:
      return state;
  }
}

export const StoreContext = createContext(null);

export function useStore(): [State, Dispatch<Action>] {
  // @ts-ignore
  return useContext(StoreContext);
}

export * from './actions';
