import { useEffect, useRef } from 'react';

export function useLastValue<T>(currentValue: T) {
  const lastValue = useRef<T>();

  useEffect(() => {
    lastValue.current = currentValue;
  }, [currentValue]);

  return lastValue.current;
}
