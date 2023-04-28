export function arrayAsReadonly<T extends any[]>(array: T): Readonly<T> {
  return array;
}