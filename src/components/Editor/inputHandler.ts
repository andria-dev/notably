import { debounce } from 'mini-debounce';
import { store } from '../../store';

type Setter<T> = (newValue: T) => void;
type Unmounted = () => void;

/**
 * @param ...args passed to `actionCreator` after `id` and `newValue`
 */
export function inputHandler<T>(
  debounceDelay: number,
  id: string,
  // tslint:disable-next-line: ban-types
  actionCreator: Function,
  ...args: any[]
): [Setter<T>, Unmounted] {
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
  const setter = (newValue: T) => {
    value = newValue;
    timeoutID = updateStore.debounced(newValue);
  };

  /**
   * Unmounted
   * Cancels previous updates and saves everything immediately
   */
  const unmounted = () => {
    if (timeoutID !== undefined) {
      clearTimeout(timeoutID as number);
      updateStore(value);
    }
  };

  return [setter, unmounted];
}
