import { createContext } from 'react';
import { DarkMode } from 'use-dark-mode';

export const DarkModeContext = createContext<DarkMode>({
  value: false,
  enable: () => {},
  disable: () => {},
  toggle: () => {}
});

export const SavedContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {});
