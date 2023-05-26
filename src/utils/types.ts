/** Type of the elements in an array */
export type ElementOf<T> = T extends (infer E)[] ? E : T extends readonly (infer E)[] ? E : T extends ArrayLike<infer E> ? E : never;

/** Used internally for `Tail`. */
type AsFunctionWithArgsOf<T extends unknown[] | readonly unknown[]> = (...args: T) => unknown;

/** Used internally for `Tail` */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TailArgs<T> = T extends (x: any, ...args: infer Rest) => unknown ? Rest : never;

/** Elements of an array after the first. */
export type Tail<T extends unknown[] | readonly unknown[]> = TailArgs<AsFunctionWithArgsOf<T>>;

/** Used internally for `IndicesOf`; probably useless outside of that. */
type AsDescendingLengths<T extends unknown[] | readonly unknown[]> =
    [] extends T ? [0] :
    [ElementOf<ElementOf<AsDescendingLengths<Tail<T>>[]>>, T['length']];

/** Used to get index of an array as a string */
export type StrIndicesOf<A> = Exclude<keyof A, keyof []>;
// type indexStrToNum = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];
// type SmartIndexOf<T extends readonly unknown[]> = indexStrToNum[StrIndicesOf<T>];

/** Union of numerical literals corresponding to a tuple's possible indices */
export type IndicesOf<T extends ArrayLike<unknown>> =
    number extends T['length'] ? number : // unspecified length -> any number
    // [] extends T ? never : // empty list
    0 extends T['length'] ? never : // 0 length -> cannot index
    T extends unknown[] | readonly unknown[] ? ElementOf<AsDescendingLengths<Tail<T>>> : // extract numeric indices up to length 44 (index 43)
    keyof T extends 'length' ? never : // T only has length but no indices
    keyof T; // cannot get actual indices -> any key of T

/** Length of the given tuple */
export type LengthOf<T> =
    T extends {length: infer L} ? L : // has length -> that number
    [] extends T ? 0 : // empty list
    T extends unknown[] | readonly unknown[] ? T['length'] : // extract numeric indices up to length 44 (index 43)
    never; // cannot get actual length

/** Used internally by AsReadonlyArr - get keys excluding indices and length */
export type ReadonlyArrayMethods<T=unknown> = Omit<readonly T[], number|'length'>;

/** Convert a record of number to item to a readonly array of those items */
export type AsReadonlyArr<Items extends Record<number, unknown>, Length> = Items & ReadonlyArrayMethods & {length: Length};
    
/** Extract keys from each option in a union type */
export type AllUnionMemberKeys<T> = T extends unknown ? keyof T : never;

/** Convert union to intersection type */
export type UnionToIntersection<T> = 
    (T extends unknown ? (x: T) => void : never) extends 
    (x: infer R) => void ? R : never;

/** Used internally for TuplifyUnion - gets last entry in union
 * works b/c inferring from overloaded function will infer from last signature
 */
type LastOf<T> =
    UnionToIntersection<
        T extends unknown ? () => T : never
    > extends
    () => infer R ? R : never;

/** Used internally for TuplifyUnion - adds type V to list of types T */
type Push<T extends Array<unknown>, V> = [...T, V];

/** Used internally for TuplifyUnion - adds necessary generic params */
type TuplifyUnionHelper<
    T, // the union type
    L = LastOf<T>, // the last option of the union
    N = [T] extends [never] ? true : false // true if the union type is never
> =
    true extends N 
    ? [] // the union is empty, return empty tuple
    : Push< // build the tuple type
        TuplifyUnionHelper<Exclude<T, L>>, // tuplify all options but the last from the union
        L // add the last option to the tuple type
    >;

/** Convert union type to tuple by repeatedly extracting last item */
export type TuplifyUnion<T> = TuplifyUnionHelper<T>;

export type ReadonlyTuplifyUnion<T> = Readonly<TuplifyUnion<T>>;

/** Get all value types from object type - (key,value) pairs */
export type ValueOf<T extends Record<string|number|symbol, unknown>> = T extends Record<infer K, unknown> ? T[K] : never;

/** Used internally for Permutations - removes the first instance of `T` from `A`. */
type ExcludeElement<A extends ReadonlyArray<unknown>, T> =
    A extends readonly [infer H, ...infer R]
        ? H extends T ? T extends H
            ? R // we've found T; just return what's left
            : [H, ...ExcludeElement<R, T>] : [H, ...ExcludeElement<R, T>] // H is not our T
        : A; // we've reached the end of the tuple; T isn't present

export type Permutations<T extends readonly unknown[]> =
    T['length'] extends 0 | 1
        ? T // if T only has one permutation, just return it
        : {
            // put each member of T first in an array, and concatenate the permutations of T without that member
            [K in keyof T]: readonly [T[K], ...Permutations<ExcludeElement<T, T[K]>>]
        }[keyof T & number]; // get the union of all permutations starting with each element of T

/** Used internally for ArrayOf */
type BuildArrayOf<
    Quantifier extends 'exactly' | 'at least',
    Count extends number,
    Type,
    Current extends Type[]
> =
    Current['length'] extends Count
        ? Quantifier extends 'exactly'
            ? [...Current]
            : [...Current, ...Type[]]
        : BuildArrayOf<Quantifier, Count, Type, [...Current, Type]>;

/** An array of a given type comprised of either exactly or at least a certain count of that type. */
export type ArrayOf<Quantifier extends 'exactly' | 'at least', Count extends number, Type> = BuildArrayOf<
    Quantifier,
    Count,
    Type,
    []
>;

/** Merge two tuples (assumes they have same length) */
export type ZipTuple<T extends readonly unknown[], U extends readonly unknown[]> = {
    [K in keyof T]: [T[K], K extends keyof U ? U[K] : never]
  }

/** Get the exact entries of an object if possible */
export type ExactEntries<Obj extends object> = ZipTuple<TuplifyUnion<keyof Obj>, TuplifyUnion<Obj[keyof Obj]>>;

/** General utility type for readonly array of given union type */
export type ReadonlyArrayTupleOfConst<C> = ReadonlyTuplifyUnion<C> & ReadonlyArrayMethods<C>;

/** Apply */
// type GenericFilteredList<L extends ArrayLike<unknown>> = {
//   [I in keyof TuplifyUnion<L>]: ElementOf<TuplifyUnion<L>[I]>;
// }[IndicesOf<TuplifyUnion<L>>]
export type DistributedTuple2ArrayOfUnion<L> = L extends ArrayLike<infer T> ? ReadonlyArray<T> : never;