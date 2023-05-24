import type { ElementOf, ExactEntries, ValueOf } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readonlyIncludes<Arr extends ReadonlyArray<any>, const V>(array: Arr, item: V): V extends ElementOf<Arr> ? true : boolean {
  // @ts-expect-error - TS doesn't know that V extends ElementOf<Arr> -> V is in Arr
  return array.includes(item);
}

export function exactEntries<const Obj extends object, OutType=ExactEntries<Obj>>(obj: Obj): OutType {
  return Object.entries(obj) as OutType;
}

export function fromExactEntries<const Obj extends Record<PropertyKey, unknown>>(entries: Array<ElementOf<ExactEntries<Obj>>>): Obj {
  return Object.fromEntries(entries as unknown as Iterable<readonly [PropertyKey, ValueOf<Obj>]>) as Obj;
}