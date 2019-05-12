import { Dispatch, ReducerState } from 'react';
import { useReduxDispatch, useReduxState } from 'reactive-react-redux';
import { createStore } from 'redux';
import { ObjectOf } from '../lib/generic-types';
import Note from '../models/Note';

export type IAction =
  | {
      type: 'SET_NOTES';
      payload: ObjectOf<Note>;
    }
  | {
      type: 'ADD_NOTE' | 'UPDATE_NOTE';
      payload: {
        noteID: string;
        note: Note;
      };
    }
  | {
      type: 'ADD_NOTES';
      payload: Array<{
        noteID: string;
        note: Note;
      }>;
    }
  | {
      type: 'REMOVE_NOTE' | 'SET_ACTIVE_NOTE_ID';
      payload: string;
    }
  | {
      type: 'ERROR';
      payload: {
        message: string;
        instance: Error;
      };
    };

export interface IActionEmpty {
  type: 'REMOVE_ALL_NOTES' | 'CLOSE_ERROR';
}

interface IState extends ReducerState<any> {
  error: { message: string; instance: Error } | null;
  loadedFromDB: boolean;
  notes: { [s: string]: Note };
  activeNoteID: string;
}

const initialState: IState = {
  error: null,
  loadedFromDB: false,
  notes: {},
  activeNoteID: ''
};

function reducer(state: IState = initialState, action: IAction | IActionEmpty) {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        loadedFromDB: true,
        notes: action.payload
      };

    case 'ADD_NOTE':
      return {
        ...state,
        notes: { ...state.notes, [action.payload.noteID]: action.payload.note }
      };

    case 'ADD_NOTES': {
      const newNotes = { ...state.notes };
      for (const { noteID, note } of action.payload) {
        newNotes[noteID] = note;
      }

      return {
        ...state,
        notes: newNotes
      };
    }

    case 'REMOVE_NOTE': {
      const newNotes = { ...state.notes };
      delete newNotes[action.payload];

      return {
        ...state,
        notes: newNotes
      };
    }

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.payload.noteID]: action.payload.note
        }
      };

    case 'ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'CLOSE_ERROR':
      return {
        ...state,
        error: null
      };

    case 'REMOVE_ALL_NOTES':
      return {
        ...state,
        notes: {}
      };

    case 'SET_ACTIVE_NOTE_ID':
      return {
        ...state,
        activeNoteID: action.payload
      };

    default:
      return state;
  }
}

export const store = createStore(
  reducer,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

/**
 * Hook for getting the current state and dispatch
 */
export function useStore(): [IState, Dispatch<IAction | IActionEmpty>] {
  return [useReduxState(), useReduxDispatch()];
}

export { ReduxProvider } from 'reactive-react-redux';
export * from './actions';
