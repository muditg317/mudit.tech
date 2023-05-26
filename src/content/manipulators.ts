import type { ReadonlyArrayMethods, ReadonlyTuplifyUnion, TuplifyUnion } from "~/utils/types";

// export function filterFor_good<const L extends ReadonlyArray<any>>(data: L) {
//   return function filteredData<const F extends keyof ElementOf<L>, const V extends ElementOf<L>[F]>(flagName: F, value: V) {
//     type FilteredEntry = Extract<ElementOf<L>, {[K in F]: V}>;
//     function filterFunc(entry: ElementOf<L>): entry is FilteredEntry {
//       return entry[flagName] === value;
//     }
//     const filteredEntries = data.filter(filterFunc);
//     return filteredEntries as ReadonlyTuplifyUnion<FilteredEntry>;
//   }
// }
export function filterFor<const C>(data: ReadonlyTuplifyUnion<C> & ReadonlyArrayMethods<C>) {
  return function filteredData<const F extends keyof C, const V extends C[F]>(flagName: F, value: V) {
    type FilteredEntry = Extract<C, {[K in F]: V}>;
    function filterFunc(entry: C): entry is FilteredEntry {
      return entry[flagName] === value;
    }
    const filteredEntries = data.filter(filterFunc);
    return filteredEntries as ReadonlyTuplifyUnion<FilteredEntry>;
  }
}

export function whereFuncFor<const C>(data: ReadonlyTuplifyUnion<C> & ReadonlyArrayMethods<C>) {
  return function where<F extends keyof C, V extends C[F]>(flagName: F, value: V) {
    type FilteredProject = Extract<C, {[K in F]: V}>;
    function filterFunc(page: C): page is FilteredProject {
      return page[flagName] === value;
    }
    return data.find(filterFunc) as TuplifyUnion<FilteredProject>[0];
  }
}

export function filterFuncsFor<const C>(data: ReadonlyTuplifyUnion<C> & ReadonlyArrayMethods<C>) {
  // type Result = {
  //   // <F extends keyof C, V extends C[F]>(f:F,v:V): ReturnType<ReturnType<typeof filterFor<C>>>;
  //   (...args: Parameters<ReturnType<typeof filterFor<C>>>): ReturnType<ReturnType<typeof filterFor<C>>>;
  // };
  // type Extras = {
  //   firstOf: ReturnType<typeof whereFuncFor<C>>;
  // };

  const filter = filterFor(data);// satisfies Result;
  const extras = {
    firstOf: whereFuncFor(data),
  } as const;

  return Object.assign(filter, extras);
}