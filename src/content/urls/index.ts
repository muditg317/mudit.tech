
import type {InvalidPageAlias,     Page,     PageConst    } from "./pages";
import type {InvalidRedirectAlias, Redirect, RedirectConst} from './redirects';
import {PAGES,     excluding as pagesExcluding,     where as pageWhere    } from "./pages";
import {REDIRECTS, excluding as redirectsExcluding, where as redirectWhere} from "./redirects";
import type {EntryTypeUnion, GetTitles, ValidatedList} from "./types";
// import {typeCheckFn} from "./types";
import type { TuplifyUnion, ElementOf, Permutations } from "~/utils/types";

export {isEntryType} from './types';

export {redirectsExcluding, pagesExcluding};
const allEntries = [...PAGES, ...REDIRECTS] as const;
allEntries satisfies ValidatedList<typeof allEntries, EntryTypeUnion, InvalidRedirectAlias&InvalidPageAlias>;
// typeCheckFn<typeof allEntries, EntryTypeUnion, InvalidRedirectAlias&InvalidPageAlias>(allEntries);

export {PAGES, REDIRECTS};
export {pageWhere, redirectWhere};

export type {Redirect, Page};
export function page<T extends GetTitles<typeof PAGES, Page>>(pageTitle: T) {
  return pageWhere('title', pageTitle);
}
export const MAIN_PAGE = pageWhere('isMainPage', true);
export const defaultPage = MAIN_PAGE;

export function redirect<T extends GetTitles<typeof REDIRECTS, Redirect>>(redirectTitle: T) {
  return redirectWhere('title', redirectTitle);
}

export function filtered<Const extends EntryTypeUnion, F extends keyof Const, V extends Const[F], L extends ReadonlyArray<Const> = ReadonlyArray<Const>>(entries: readonly [...L], flagName: F, value: V) {
  type FilteredEntry = Extract<ElementOf<L>, {[K in F]: V}>;
  function filterFunc(entry: Const): entry is FilteredEntry {
    return entry[flagName] === value;
  }
  const filteredEntries = entries.filter(filterFunc);
  return filteredEntries as Readonly<TuplifyUnion<FilteredEntry>>;
}
export function filteredPages<F extends keyof PageConst, V extends PageConst[F]>(flagName: F, value: V) {
  return filtered<PageConst, F, V>(PAGES, flagName, value);
}
export function filteredRedirects<F extends keyof RedirectConst, V extends RedirectConst[F]>(flagName: F, value: V) {
  return filtered<RedirectConst, F, V>(REDIRECTS, flagName, value);
}

export function withAlias<Const extends EntryTypeUnion, A extends string, L extends ReadonlyArray<Const> = ReadonlyArray<Const>>(entries: readonly [...L], alias: A) {
  type stringArr = readonly [] | readonly [string] | readonly [string, string] | readonly [string, string, string] | readonly [string, string, string, string];
  type AliasesType = Permutations<readonly [A, ...stringArr]>;
  type FilteredEntry = Extract<Const, {readonly aliases: AliasesType}>;
  function filterFunc(entry: Const): entry is FilteredEntry {
    return (entry.aliases).includes(alias);
  }
  return entries.find(filterFunc);
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const redirectHub = page('Redirect Hub');
export const Page_RedirectHub = {
  ...redirectHub,
  pathname: redirectHub.aliases[0],
} as const;