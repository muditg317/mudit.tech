import { ElementOf } from "./types";

export function readonlyIncludes<Arr extends ReadonlyArray<any>, const V>(array: Arr, item: V): V extends ElementOf<Arr> ? true : boolean {
  // @ts-expect-error - TS doesn't know that V extends ElementOf<Arr> -> V is in Arr
  return array.includes(item);
}