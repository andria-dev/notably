import { debounce } from 'mini-debounce';
import { useContext, useMemo } from 'react';
import { SavedContext } from '../contexts';
import { store } from '../store';

type DebouncedSave<T> = (newValue: T) => void;
type Save = () => void;

/**
 * @param ...args passed to `actionCreator` after `id` and `newValue`
 */
export function saveHandler<T>(
  debounceDelay: number,
  setSaved: React.Dispatch<React.SetStateAction<boolean>>,
  id: string,
  actionCreator: CallableFunction,
  ...args: any[]
): [DebouncedSave<T>, Save] {
  let value: T;
  let timeoutID: number | NodeJS.Timeout;

  async function updateStore(newValue: T) {
    const action = await actionCreator(id, newValue, ...args);
    setSaved(true);
    store.dispatch(action);
  }
  updateStore.debounced = debounce(updateStore, debounceDelay);

  /**
   * Takes in a value and updates the store with it
   * after the specified amount of time.
   */
  const debouncedSave = (newValue: T) => {
    setSaved(false);
    value = newValue;
    timeoutID = updateStore.debounced(newValue);
  };

  /**
   * Clears the timeout for the latest save and
   * updates the store with the latest value.
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
  const setSaved = useContext(SavedContext); // I have to spread `args` because it is spread in the definition

  /* eslint-disable react-hooks/exhaustive-deps */ return useMemo(
    () => saveHandler<T>(debounceDelay, setSaved, id, actionCreator, ...args),
    [debounceDelay, setSaved, id, actionCreator, ...args]
  );
  /* eslint-enable */
}
