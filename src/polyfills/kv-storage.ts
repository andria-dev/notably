interface IKvStorage {
  set(key: string, value: any): Promise<undefined>;
  get(key: string): Promise<any | undefined>;
  delete(key: string): Promise<undefined>;
  clear(): Promise<undefined>;
  entries(): AsyncIterable<[string, any]>;
  keys(): AsyncIterable<string>;
  values(): AsyncIterable<string>;
}

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    kvStorage: IKvStorage;
  }
}

export default window.kvStorage as IKvStorage;
