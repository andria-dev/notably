import { Context, createContext } from 'react';
import { DarkMode } from 'use-dark-mode';

export const DarkModeContext: Context<DarkMode> = createContext({
  value: false,
  enable: () => {},
  disable: () => {},
  toggle: () => {}
});

export const SavedContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(() => {});
