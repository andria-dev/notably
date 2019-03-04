import { Dispatch, ReducerState } from 'react';
import { useReduxDispatch, useReduxState } from 'react-hooks-easy-redux';
import { createStore } from 'redux';
import Note from '../models/Note';

export interface Action {
  type: string;
  payload?: any;
}

interface State extends ReducerState<any> {
  notes: { [s: string]: Note };
  loadedFromDB: boolean;
  error: string | null;
}

const initialState: State = {
  notes: {},
  loadedFromDB: false,
  error: null,
};

function reducer(state: State = initialState, action: Action) {
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

    case 'REMOVE_ALL_NOTES':
      return {
        ...state,
        notes: {},
        currentNote: null,
        currentPage: null,
      };

    default:
      return state;
  }
}

export const store = createStore(reducer);

/**
 * Hook for getting the current state and dispatch
 */
export function useStore(): [State, Dispatch<Action>] {
  return [useReduxState(), useReduxDispatch()];
}

export { ReduxProvider } from 'react-hooks-easy-redux';
export * from './actions';
