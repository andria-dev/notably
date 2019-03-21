import { Dispatch, ReducerState } from 'react';
import { useReduxDispatch, useReduxState } from 'react-hooks-easy-redux';
import { createStore } from 'redux';
import Note from '../models/Note';

export interface IAction {
  type: string | number;
  payload?: any;
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

function reducer(state: IState = initialState, action: IAction) {
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
        notes: { ...state.notes, [action.payload.id]: action.payload.note }
      };

    case 'REMOVE_NOTE':
      const {
        [action.payload]: {},
        ...newNotes
      } = state.notes;
      return {
        ...state,
        notes: newNotes
      };

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
export function useStore(): [IState, Dispatch<IAction>] {
  return [useReduxState(), useReduxDispatch()];
}

export { ReduxProvider } from 'react-hooks-easy-redux';
export * from './actions';
