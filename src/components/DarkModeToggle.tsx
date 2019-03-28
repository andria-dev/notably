import React, { useContext } from 'react';
import { DarkModeContext } from '../contexts';
import Toggle from './Toggle';

const icons = {
  checked: <img src="/moon.png" width="16" height="16" alt="" style={{ pointerEvents: 'none' }} />,
  unchecked: <img src="/sun.png" width="16" height="16" alt="" style={{ pointerEvents: 'none' }} />
};

function DarkModeToggle({ ...props }) {
  const { value, toggle } = useContext(DarkModeContext);

  return <Toggle checked={value} onChange={toggle} icons={icons} {...props} />;
}

export default DarkModeToggle;
