import { useEffect, useState } from 'react';

/**
 * a hook that allows you to receive an update via useEffect only once (or when the value is null)
 *
 * @tutorial
   ```
function Component({ match, notes }) {
  useOnce(() => match && notes[match.param.id], [match]);
}
   ```
 */
export default function useOnce<T>(
  setterCallback: () => T,
  deps: any[],
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    if (value === null) {
      setValue(setterCallback());
    }
  }, deps);

  return [value, setValue];
}
