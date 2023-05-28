import type { ElementOf, ExactEntries, DistributedTuple2ArrayOfUnion, ReadonlyArrayTupleOfConst, ValueOf } from "./types";

export function readonlyIncludes<const Arr extends ReadonlyArray<unknown>, const V>(array: Arr, item: V): V extends ElementOf<Arr> ? true : boolean {
  // @ts-expect-error - TS doesn't know that V extends ElementOf<Arr> -> V is in Arr
  return array.includes(item);
}

export function readonlyFilter<const Arr extends ReadonlyArray<unknown>, S extends ElementOf<Arr>, Filter extends ((c:ElementOf<Arr>) => c is S)|((c:ElementOf<Arr>) => boolean)>(array: Arr, filterFn: Filter) {
  type ResultType =
    Filter extends ((c:ElementOf<Arr>) => c is infer F extends ElementOf<Arr>)
      ? ReadonlyArrayTupleOfConst<F>
      : DistributedTuple2ArrayOfUnion<Arr>;
  return (array as ReadonlyArray<ElementOf<Arr>>).filter(filterFn) as ResultType;
}

export function readonlyFind<const Arr extends ReadonlyArray<unknown>, S extends ElementOf<Arr>, Filter extends (c:ElementOf<Arr>) => c is S>(array: Arr, filterFn: Filter) {
  type ResultType =
    Filter extends ((c:ElementOf<Arr>) => c is infer F extends ElementOf<Arr>)
      ? ReadonlyArrayTupleOfConst<F>
      : DistributedTuple2ArrayOfUnion<Arr>;
  return (array as ReadonlyArray<ElementOf<Arr>>).find(filterFn) as ResultType[0];
}

export function exactEntries<const Obj extends object, OutType=ExactEntries<Obj>>(obj: Obj): OutType {
  return Object.entries(obj) as OutType;
}

export function fromExactEntries<const Obj extends Record<PropertyKey, unknown>>(entries: Array<ElementOf<ExactEntries<Obj>>>): Obj {
  return Object.fromEntries(entries as unknown as Iterable<readonly [PropertyKey, ValueOf<Obj>]>) as Obj;
}