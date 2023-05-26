import { readonlyFilter } from "~/utils/type-modifiers";
import type { ElementOf, IndicesOf, TuplifyUnion } from "~/utils/types";

// function withByFieldMember<const C, Func extends <F extends keyof C, V extends C[F]>(f:F, v: V) => unknown>(data: ReadonlyArray<C>, func: Func) {
function withByFieldMember<const C, Func extends <F extends keyof C, V extends C[F]>(f: F, v: V) => ReturnType<Func>>(data: ReadonlyArray<C>, func: Func) {
  return Object.assign(func, {
    byField: 
       function withByFieldMemberFor<const F extends keyof C>(flagName: F) {
        return function withByFieldMemberForField<const V extends C[F]>(value: V) {
          type Result =
            Func extends (f:F, v: V) => infer R
              ? R
              : typeof func<F,V> extends ((f:F, v: V) => infer R)
                ? typeof func<F,V>
                : false;//`Error: ${Exclude<F, symbol>} ${Extract<V, string|number>} -- ${ReturnType<typeof func<F,V>>}`;
          // type Result = ReturnType<typeof func<F, V>>;
          return func<F,V>(flagName, value) as Result;
        }
      }
      // <const F extends keyof C>(flagName: F) => func.bind(null, flagName),
  });
}

type Transformer = { c: unknown, f: unknown, v: unknown, type: unknown }
type apply<$T extends Transformer, C, F, V> = ($T & {c:C,f:F,v:V})['type'];
// interface $With extends Transformer { type: TuplifyUnion<Extract<this['c'], {[K in this['f']]: this['v']}>>[0] }
// type foo = apply<$With, {a:1,b:2}|{a:2,b:5}, 'a', 2>;

function withField2<
  $transformer extends Transformer,
  const C,
  Fn extends <F extends keyof C, V extends C[F]>(f:F, v:V) => unknown,
>(func: Fn) {
  return Object.assign(func, {
    byField: <F extends keyof C>(flagName: F) => <V extends C[F]>(value: V) => func(flagName, value) as apply<$transformer, C, F, V>,
  });
}
// function withData<
//   $transformer extends Transformer,
//   const C,
//   Fn extends <const C, F extends keyof C, V extends C[F]>(c:C,f:F,v:V) => unknown,
// >(data: ReadonlyArray<C>, func: Fn) {
//   return function method<F extends keyof C, V extends C[F]>(f:F,v:V) {
//     return func(data, f, v) as apply<$transformer, C, F, V>;
//   }
// }

function filterData<const C, const F extends keyof C, const V extends C[F]>(data: ReadonlyArray<C>, flagName: F, value: V) {
  type FilteredItem = Extract<C, {[K in F]: V}>;
  function filterFunc(item: C): item is FilteredItem {
    return item[flagName] === value;
  }
  return readonlyFilter(data, filterFunc);
}
function filterFor<const C>(data: ReadonlyArray<C>) {
  return function filteredData<const F extends keyof C, const V extends C[F]>(flagName: F, value: V) {
    return filterData(data, flagName, value);
  }
}


function firstWithFromData<const C, const F extends keyof C, const V extends C[F]>(data: ReadonlyArray<C>, flagName: F, value: V) {
  type FilteredItem = Extract<C, {[K in F]: V}>;
  function filterFunc(item: C): item is FilteredItem {
    return item[flagName] === value;
  }
  return data.find(filterFunc) as TuplifyUnion<FilteredItem>[0];
}
interface $firstWithFromData extends Transformer {
  type: ReturnType<typeof firstWithFromData<
    this['c'],
    this['f'] extends keyof this['c'] ? this['f'] : never,
    this['v'] extends this['c'][
        this['f'] extends keyof this['c'] ? this['f'] : never
      ] ? this['v'] : never
  >>
}

function firstWithFuncFor<const C>(data: ReadonlyArray<C>) {
  function where<F extends keyof C, V extends C[F]>(flagName: F, value: V) {
    return firstWithFromData(data, flagName, value);
  }
  // type t<F extends keyof C, V extends C[F]> = ReturnType<typeof where>;
  
  // type f<F,V> = apply<$transformer, C, F, V>;
  // return where as <F extends keyof C, V extends C[F]>(flagName: F, value: V) => apply<$firstWithInData, C, F, V>;
  // return withByFieldMember(data, where);
  return withField2<$firstWithFromData, C, typeof where>(where);
  // return Object.assign(where, {
  //   byField: <F extends keyof C>(flagName: F) => <V extends C[F]>(value: V) => where(flagName, value),
  // } as const);
  // return Object.assign(where, {
  //   byField: function byField<F extends keyof C>(flagName: F) {
  //     return function firstWithFieldValue<V extends C[F]>(value: V) {
  //       return where(flagName, value);
  //     }
  //   }
  // } as const);
}


function excludingFromData<const C, const F extends keyof C, const V extends C[F]>(data: ReadonlyArray<C>, flagName: F, value: V) {
  type FilteredProject = Exclude<C, {[K in F]: V}>;
  function filterFunc(item: C): item is FilteredProject {
    return item[flagName] !== value;
  }
  return readonlyFilter(data, filterFunc);
}
function excludingFuncFor<const C>(data: ReadonlyArray<C>) {
  return function excluding<F extends keyof C, V extends C[F]>(flagName: F, value: V) {
    return excludingFromData(data, flagName, value);
  }
}
function firstWithFieldValueMetaFuncFor<const C>(data: ReadonlyArray<C>) {
  return function firstWithFieldSlot<F extends keyof C>(flagName: F) {
    return function firstWithFieldValue<V extends C[F]>(value: V) {
      return firstWithFromData(data, flagName, value);
    }
  }
}

export function filterFuncsFor<const C>(data: ReadonlyArray<C>) {
  return Object.assign(
    filterFor(data), {
      firstWith: firstWithFuncFor(data),
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
