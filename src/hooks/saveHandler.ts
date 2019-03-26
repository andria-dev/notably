import { useMemo } from 'react';
import { debounce } from 'mini-debounce';
import { store } from '../store';

type DebouncedSave<T> = (newValue: T) => void;
type Save = () => void;

/**
 * @param ...args passed to `actionCreator` after `id` and `newValue`
 */
export function saveHandler<T>(
  debounceDelay: number,
  id: string,
  actionCreator: CallableFunction,
  ...args: any[]
): [DebouncedSave<T>, Save] {
  let value: T;
  let timeoutID: number | NodeJS.Timeout;

  async function updateStore(newValue: T) {
    const action = await actionCreator(id, newValue, ...args);
    store.dispatch(action);
  }
  updateStore.debounced = debounce(updateStore, debounceDelay);

  /**
   * Setter
   * Starts debounce and keeps track of value + timeoutID
   */
  const debouncedSave = (newValue: T) => {
    value = newValue;
    timeoutID = updateStore.debounced(newValue);
  };

  /**
   * Unmounted
   * Cancels previous updates and saves everything immediately
   */
  const save = () => {
    if (timeoutID !== undefined) {
      clearTimeout(timeoutID as number);
      updateStore(value);
    }
  };

  return [debouncedSave, save];
}

export function useSaveHandler<T>(
  debounceDelay: number,
  id: string,
  actionCreator: CallableFunction,
  ...args: any[]
): [DebouncedSave<T>, Save] {
  return useMemo(() => saveHandler<T>(debounceDelay, id, actionCreator), [
    debounceDelay,
    id,
    actionCreator
  ]);
}
