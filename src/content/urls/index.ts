
import type {InvalidPageAlias,     Page,     PageConst    } from "./pages";
import type {InvalidRedirectAlias, Redirect, RedirectConst} from './redirects';
import {PAGES,     excluding as pagesExcluding,     where as pageWhere    } from "./pages";
import {REDIRECTS, excluding as redirectsExcluding, where as redirectWhere} from "./redirects";
import {EntryTypeUnion, GetTitles, } from "./types";
import {typeCheckFn} from "./types";
import { arrayAsReadonly } from "~/utils/type-modifiers";
import type { TuplifyUnion, ElementOf, AsReadonlyArr, IndicesOf, Permutations } from "~/utils/types";

export {isEntryType} from './types';

export {redirectsExcluding, pagesExcluding};
const allEntries = [...PAGES, ...REDIRECTS] as const;
typeCheckFn<typeof allEntries, EntryTypeUnion, InvalidRedirectAlias&InvalidPageAlias>(allEntries);
export {PAGES, REDIRECTS};
export {pageWhere, redirectWhere};

export type {Redirect, Page};
export function page<T extends GetTitles<typeof PAGES, Page>>(pageTitle: T) {
  // console.log(pageTitle);
  // console.log(pageWhere);
  return pageWhere('title', pageTitle);
}
export const defaultPage = pageWhere('isMainPage', true);
// console.log(defaultPage);

export function redirect<T extends GetTitles<typeof REDIRECTS, Redirect>>(redirectTitle: T) {
  return redirectWhere('title', redirectTitle);
}

export function filtered<Const extends EntryTypeUnion, L extends ReadonlyArray<Const> = ReadonlyArray<Const>, F extends keyof Const = keyof Const, V extends Const[F] = Const[F]>(entries: readonly [...L], flagName: F, value: V) {
  type FilteredEntry = Extract<ElementOf<L>, {[K in F]: V}>;
  function filterFunc(entry: Const): entry is FilteredEntry {
    return entry[flagName] === value;
  }
  const filteredEntries = entries.filter(filterFunc);
  return arrayAsReadonly(filteredEntries as TuplifyUnion<ElementOf<typeof filteredEntries>>);
}
export function filteredPages<F extends keyof PageConst, V extends PageConst[F]>(flagName: F, value: V) {
  return filtered<PageConst>(PAGES, flagName, value);
}
export function filteredRedirects<F extends keyof RedirectConst, V extends RedirectConst[F]>(flagName: F, value: V) {
  return filtered<RedirectConst>(REDIRECTS, flagName, value);
}

export function withAlias<Const extends EntryTypeUnion, A extends string, L extends ReadonlyArray<Const> = ReadonlyArray<Const>>(entries: readonly [...L], alias: A) {
  type stringArr = readonly [] | readonly [string] | readonly [string, string] | readonly [string, string, string] | readonly [string, string, string, string];
  type AliasesType = Permutations<readonly [A, ...stringArr]>;
  type FilteredEntry = Extract<Const, {readonly aliases: AliasesType}>;
  function filterFunc(entry: Const): entry is FilteredEntry {
    return (entry.aliases as ReadonlyArray<string>).includes(alias);
  }
  return entries.find(filterFunc)!;
}
export function pageWithAlias<A extends string>(alias: A) {
  return withAlias<PageConst, A>(PAGES, alias);
}
export function redirectWithAlias<A extends string>(alias: A) {
  return withAlias<RedirectConst, A>(REDIRECTS, alias);
}

export const navPages = filteredPages("showOnNavBar", true);
export const navRedirects = filteredRedirects("showOnNavBar", true);
export const navEntries = [...navPages, ...navRedirects] as const;

const redirectHub = pageWhere('title', 'Redirect Hub');
export const Page_RedirectHub = {
  ...redirectHub,
  pathname: redirectHub.aliases[0],
} as const;