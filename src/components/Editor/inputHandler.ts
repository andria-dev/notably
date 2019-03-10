import { debounce } from 'mini-debounce';
import { store } from '../../store';

const values = new Map();

type Setter<T> = (newValue: T) => void;
type Unmounted = () => void;

export function inputHandler<T>(
  debounceDelay: number,
  id: string,
  // tslint:disable-next-line: ban-types
  actionCreator: Function,
  ...args: any[]
): [Setter<T>, Unmounted] {
  async function updateStore(newValue: T) {
    store.dispatch(await actionCreator(id, newValue, ...args));
  }
  updateStore.debounced = debounce(updateStore, debounceDelay);

  /**
   * Setter
   * Starts debounce and keeps track of value + timeoutID
   */
  const setter = (newValue: T) => {
    values.set(id, { value: newValue, timeoutID: updateStore.debounced(newValue) });
  };

  /**
   * Unmounted
   * Cancels previous updates and saves everything immediately
   */
  const unmounted = () => {
    if (values.has(id)) {
      const { value, timeoutID } = values.get(id);

      clearTimeout(timeoutID);
      updateStore(value);

      // cleanup
      values.delete(id);
    }
  };

  return [setter, unmounted];
}
