// tslint:disable-next-line: interface-over-type-literal
export type ObjectOf<T> = {
  [s: string]: T;
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
