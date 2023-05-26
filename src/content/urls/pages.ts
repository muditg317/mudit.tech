import type {ElementOf, ReadonlyTuplifyUnion, TuplifyUnion} from '~/utils/types';
import type { GetAliases, MultiWord, UrlEntry } from './types';
import { EntryType } from './types';
import type { ValidateListField } from '../manipulators';

export type InvalidPageAlias = MultiWord;

// TODO: custom validator for pages
export type Page = UrlEntry<{
  isMainPage: boolean;
  isMinorPage: boolean;
  description: string;
  entryType: EntryType.Page;
}>;

export const PAGES = [
  {
    aliases: ['', 'main', 'home', 'landing'],
    title: "Mudit Gupta",
    showOnNavBar: false,
    isMainPage: true,
    isMinorPage: false,
    description: "Mudit Gupta's personal website",
    entryType: EntryType.Page,
  },
  {
    aliases: ['redirects'],
    title: "Redirect Hub",
    showOnNavBar: false,
    isMainPage: false,
    isMinorPage: false,
    description: "You've reached the redirect hub. There's probably a broken link somewhere...",
    entryType: EntryType.Page,
  },
  // {
  //   aliases: ['projects'],
  //   title: "Projects",
  //   showOnNavBar: true,
  //   isMainPage: false,
  //   isMinorPage: false,
  //   description: "Mudit Gupta's projects",
  //   entryType: EntryType.Page,
  // },
  {
    aliases: ['blog'],
    title: "Blog?",
    showOnNavBar: true,
    isMainPage: false,
    isMinorPage: false,
    description: "Mudit Gupta's blog",
    entryType: EntryType.Page,
  },
  {
    aliases: ['about'],
    title: "About This Site",
    showOnNavBar: true,
    isMainPage: false,
    isMinorPage: true,
    description: "About this site",
    entryType: EntryType.Page,
  },
] as const satisfies ReadonlyArray<Page>;
PAGES satisfies ValidateListField<Page, 'aliases', typeof PAGES, 'no duplicates', InvalidPageAlias>;
// PAGES satisfies ValidatedList<typeof PAGES, Page, InvalidPageAlias>;
// typeCheckFn<typeof PAGES, Page, InvalidPageAlias>(PAGES);

export type ConstPages = typeof PAGES;
export type PageConst = ElementOf<ConstPages>;
export function excluding<F extends keyof PageConst, V extends PageConst[F]>(flagName: F, value: V) {
  type FilteredPage = Exclude<PageConst, {[K in F]: V}>;
  function filterFunc(page: PageConst): page is FilteredPage {
    return page[flagName] !== value;
  }
  const filteredPages = PAGES.filter(filterFunc);
  return filteredPages as ReadonlyTuplifyUnion<FilteredPage>;
  // return arrayAsReadonly(filteredPages as TuplifyUnion<ElementOf<typeof filteredPages>>);
}
export function where<F extends keyof PageConst, V extends PageConst[F]>(flagName: F, value: V) {
  type FilteredPage = Extract<PageConst, {[K in F]: V}>;
  function filterFunc(page: PageConst): page is FilteredPage {
    return page[flagName] === value;
  }
  return PAGES.find(filterFunc) as TuplifyUnion<FilteredPage>[0];
}
export type AllSources = GetAliases<typeof PAGES>;