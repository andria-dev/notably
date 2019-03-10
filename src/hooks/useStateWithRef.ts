import React, { useRef, useState } from 'react';

export function useStateWithRef<T>(
  defaultValue: T
): [T, React.MutableRefObject<T>, React.SetStateAction<T>] {
  const [state, setState] = useState(defaultValue);
  const ref = useRef(defaultValue);

  function updateState(newState: T): void {
    ref.current = typeof newState === 'function' ? newState(state) : newState;
    setState(newState);
  }

  return [state, ref, updateState as React.SetStateAction<T>];
}
