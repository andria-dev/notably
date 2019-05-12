import { ObjectOf } from './generic-types';

declare global {
  interface Object {
    fromEntries<T>(pairs: Array<[string, T]>): ObjectOf<T>;
  }
}

export async function arrayFromAsyncIterator<T>(
  iterator: AsyncIterable<T>
): Promise<T[]> {
  const returnValue = [];

  for await (const value of iterator) {
    returnValue.push(value);
  }

  return returnValue;
}
