import { useMemo, useState } from 'react';

type props = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
export function useBooleanFromState([value, setValue]: props) {
  const { setFalse, setTrue, toggle } = useMemo(
    () => ({
      setFalse() {
        setValue(false);
      },
      setTrue() {
        setValue(true);
      },
      toggle() {
        setValue(prev => !prev);
      }
    }),
    [setValue]
  );

  return {
    setFalse,
    setTrue,
    toggle,
    setValue,
    value
  };
}

export function useBoolean(initialValue: boolean) {
  return useBooleanFromState(useState(initialValue));
}
