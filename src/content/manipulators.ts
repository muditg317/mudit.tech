import { readonlyFilter } from "~/utils/type-modifiers";
import type { ElementOf, IndicesOf, TuplifyUnion } from "~/utils/types";

function filterFor<const C>(data: ReadonlyArray<C>) {
  return function filteredData<const F extends keyof C, const V extends C[F]>(flagName: F, value: V) {
    type FilteredItem = Extract<C, {[K in F]: V}>;
    function filterFunc(item: C): item is FilteredItem {
      return item[flagName] === value;
    }
    return readonlyFilter(data, filterFunc);
  }
}
function firstOfFuncFor<const C>(data: ReadonlyArray<C>) {
  return function where<F extends keyof C, V extends C[F]>(flagName: F, value: V) {
    type FilteredItem = Extract<C, {[K in F]: V}>;
    function filterFunc(item: C): item is FilteredItem {
      return item[flagName] === value;
    }
    return data.find(filterFunc) as TuplifyUnion<FilteredItem>[0];
  }
}
function excludingFuncFor<const C>(data: ReadonlyArray<C>) {
  return function excluding<F extends keyof C, V extends C[F]>(flagName: F, value: V) {
    type FilteredProject = Exclude<C, {[K in F]: V}>;
    function filterFunc(item: C): item is FilteredProject {
      return item[flagName] !== value;
    }
    return readonlyFilter(data, filterFunc);
  }
}

export function filterFuncsFor<const C>(data: ReadonlyArray<C>) {
  return Object.assign(
    filterFor(data), {
      firstOf: firstOfFuncFor(data),
      excluding: excludingFuncFor(data),
    } as const
  );
}

// validators logic

type GetFieldValues<C, F extends keyof C, L extends ReadonlyArray<C>, Field=L[IndicesOf<L>][F]> = Field extends ArrayLike<infer T> ? T : never;

type InterfaceFollowingList<AllFieldValues, InvalidV, C> =
    TuplifyUnion<AllFieldValues> extends TuplifyUnion<Exclude<AllFieldValues, InvalidV>>
      ? Record<number, C>
      : Record<number, {
        valid: Exclude<AllFieldValues, InvalidV>,
        invalid: Extract<AllFieldValues, InvalidV>,
        invalidT: InvalidV,
      }> ;

type FieldUnions<L extends ReadonlyArray<C>, C, F extends keyof C> = { [I in IndicesOf<L>]: ElementOf<L[Extract<I, IndicesOf<L>>][F]> };
type Reused<C, L extends ReadonlyArray<C>, Unions extends Record<IndicesOf<L>, string>> = { [I in keyof Unions]: Extract<Unions[Exclude<keyof Unions, I>], Unions[I]>}[keyof Unions];
export type ValidateListField<C, F extends keyof C, L extends ReadonlyArray<C>, AllowDups extends "allow duplicates"|"no duplicates", InvalidV extends (C[F] extends ArrayLike<infer V> ? V : never)> =
    AllowDups extends "allow duplicates"
      ? InterfaceFollowingList<GetFieldValues<C, F, L>, InvalidV, C>
    : Reused<C, L, FieldUnions<L, C, F>> extends never
      ? InterfaceFollowingList<GetFieldValues<C, F, L>, InvalidV, C>
    : `data list cannot repeat items in ${F extends symbol ? `symbol` : F} field: found "${Reused<C, L, FieldUnions<L, C, F>>}"`;
