export const enum FetchStatus {
  Initial,
  InProgress,
  Success,
  Failed,
}

export const keyByIntoMap = function <
  T,
  K extends keyof T,
  R extends Map<T[K], T>
>(arr: T[], key: K): R {
  const res: R = new Map<K, T>() as any;
  for (const item of arr) {
    res.set(item[key], item);
  }
  return res;
};
