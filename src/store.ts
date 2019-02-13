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
        loadedFromDB: true,
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

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.payload.noteID]: action.payload.note,
        },
      };

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
