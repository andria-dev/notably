import { createContext } from 'react';
import { DarkMode } from 'use-dark-mode';

/* DARK MODE */
export const DarkModeContext = createContext<DarkMode>({
  value: false,
  enable: () => {},
  disable: () => {},
  toggle: () => {}
});

/* SAVED */
export type SavedContextData = React.Dispatch<React.SetStateAction<boolean>>;
export const SavedContext = createContext<SavedContextData>(() => {});

interface IObjectWithID {
  id: string;
}
/* NOTE RENDERER */
export type HandleRemoveNoteSignature = (
  event: Event,
  { id }: IObjectWithID
) => Promise<void>;
export interface INoteRendererContextData {
  handleRemoveNote: HandleRemoveNoteSignature;
  activeID?: string;
}
export const NoteRendererContext = createContext<INoteRendererContextData>({
  handleRemoveNote: async (event: Event, { id }: IObjectWithID) => void 0,
  activeID: undefined
});
