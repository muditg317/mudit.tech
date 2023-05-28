import { readonlyFilter, readonlyFind } from "~/utils/type-modifiers";
import type { ElementOf, IndicesOf, TuplifyUnion } from "~/utils/types";

type C_<$T extends {c:unknown}> = $T['c'];
type F_<$T extends {f:unknown}> = $T['f'];
type V_<$T extends {v:unknown}> = $T['v'];

type Transformer = { c: unknown, f: unknown, v: unknown, type: unknown };
type apply_$T<$T extends Transformer, C, F, V> = ($T & {c:C,f:F,v:V})['type'];

type FieldValidator = { c: unknown, type: unknown };
// type apply_$FV<$FV extends FieldValidator, C> = keyof C & ($FV & {c:C})['type'];

function withField<
  $transformer extends Transformer,
  const C,
  Fn extends <F extends keyof C, V extends C[F]>(f:F, v:V) => unknown,
>(func: Fn) {
  return Object.assign(func, {
    byField: <F extends keyof C>(flagName: F) => <V extends C[F]>(value: V) => func(flagName, value) as apply_$T<$transformer, C, F, V>,
  });
}
function withData<
  $transformer extends Transformer,
  // const C,
  // $fieldValidator extends FieldValidator,
  Fn extends <const C_fn, const F extends keyof C_fn, const V extends C_fn[F]>(d:ReadonlyArray<C_fn>,f:F,v:V) => unknown
  // Fn extends (...args: Parameters<Fn>) => ReturnType<Fn>,
>(func: Fn) {
  return function withData<const C>(data: ReadonlyArray<C>) {
    function funcOnData<const F extends keyof C, const V extends C[F]>(flagName: F, value: V) {
      return func(data, flagName, value) as apply_$T<$transformer, C, F, V>;
    }
    return withField<$transformer, C, typeof funcOnData>(funcOnData);
  }
  // return Object.assign(func, {
  //   withData,
  // });
}

type UnknownArray = Array<unknown>|ReadonlyArray<unknown>;
type ArrayValuedKeys<C> = { [K in keyof C]: C[K] extends UnknownArray ? K : never }[keyof C];
type NonArrayValuedKeys<C> = Exclude<keyof C, ArrayValuedKeys<C>>;
function filterData<const C, const F extends NonArrayValuedKeys<C>, const V extends C[F]>(data: ReadonlyArray<C>, flagName: F, value: V) {
  type FilteredItem = Extract<C, {[K in F]: V}>;
  function filterFunc(item: C): item is FilteredItem {
    return item[flagName] === value;
  }
  return readonlyFilter(data, filterFunc);
}
function filterFor<const C>(data: ReadonlyArray<C>) {
  return function filteredData<const F extends NonArrayValuedKeys<C>, const V extends C[F]>(flagName: F, value: V) {
    return filterData(data, flagName, value);
  }
}


// interface $FV_firstWithFromData extends FieldValidator {
//   type: NonArrayValuedKeys<C_<this>>
// }
export function firstWithFromData<const Const, const Field extends keyof Const, const Val extends Const[Field]>(data: ReadonlyArray<Const>, flagName: Field, value: Val) {
  type FilteredItem = Extract<Const, {[K in Field]: Val}>;
  function filterFunc(item: Const): item is FilteredItem {
    return item[flagName] === value;
  }
  return readonlyFind(data, filterFunc);//data.find(filterFunc) as TuplifyUnion<FilteredItem>[0];
}
interface $T_firstWithFromData extends Transformer {
  type: ReturnType<typeof firstWithFromData<
    C_<this>,
    F_<this> extends keyof C_<this> ? F_<this> : never,
    V_<this> extends C_<this>[
        F_<this> extends keyof C_<this> ? F_<this> : never
      ] ? V_<this> : never
  >>
}
// function firstWithFuncFor<const C>(data: ReadonlyArray<C>) {
//   function where<F extends keyof C, V extends C[F]>(flagName: F, value: V) {
//     return firstWithFromData(data, flagName, value);
//   }
//   return withField<$T_firstWithFromData, C, typeof where>(where);
// }
const genericFirstWith = withData<
  $T_firstWithFromData,
  // $FV_firstWithFromData,
  typeof firstWithFromData
>(firstWithFromData);


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

export function filterFuncsFor<const C>(data: ReadonlyArray<C>) {
  return Object.assign(
    filterFor(data), {
      firstWith: genericFirstWith(data),//firstWithFuncFor(data),
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

