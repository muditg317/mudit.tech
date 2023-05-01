import type {ElementOf, TuplifyUnion} from '~/utils/types';
import {arrayAsReadonly} from '~/utils/type-modifiers';
import type { EmptyString, GetAliases, MultiWord, UrlEntry, ValidatedList } from './types';
import { EntryType } from './types';

export type InvalidRedirectAlias = MultiWord|EmptyString;

export enum RedirectGroup {
  QuickLinks = 'QuickLinks',
  ResumeReferences = 'ResumeReferences',
}
export const RedirectGroups = [
  RedirectGroup.QuickLinks,
  RedirectGroup.ResumeReferences,
] as const;


export type Redirect = UrlEntry<{
  target: URL;
  entryType: EntryType.Redirect;
  group: RedirectGroup;
}>;

export const REDIRECTS = [
  ({
    aliases: ['resume', 'muditgupta-resume', 'guptamudit-resume'],
    title: "Resume",
    target: new URL('https://tinyurl.com/muditgupta-resume'),
    showOnNavBar: true,
    group: RedirectGroup.QuickLinks,
    entryType: EntryType.Redirect,
  }),
  ({
    aliases: ['mungus', 'mungus-irl','among-us','amongus'],
    title: "Mungus-IRL",
    target: new URL('http://mungus.mudit.tech'),
    showOnNavBar: true,
    group: RedirectGroup.QuickLinks,
    entryType: EntryType.Redirect,
  }),
  ({
    aliases: ['games', 'game-lounge'],
    title: "Game Lounge",
    target: new URL('https://muditgupta.appspot.com/game-lounge'),
    showOnNavBar: true,
    group: RedirectGroup.QuickLinks,
    entryType: EntryType.Redirect,
  }),
  ({
    aliases: ['source', 'website-code', 'website-source', 'website-source-code'],
    title: "Source Code",
    target: new URL('https://github.com/muditg317/muditg317.github.io'),
    showOnNavBar: false,
    group: RedirectGroup.QuickLinks,
    entryType: EntryType.Redirect,
  }),
  ({
    aliases: ['vip', 'autolidar', 'autolidar-vip', 'vip-autolidar', 'automotive-lidar'],
    title: "AutoLiDAR VIP",
    target: new URL('https://vip.gatech.edu/teams/automotive-lidar'),
    showOnNavBar: false,
    group: RedirectGroup.ResumeReferences,
    entryType: EntryType.Redirect,
  }),
  ({
    aliases: ['farrt', 'fa-rrt', 'field-aided-rrt'],
    title: "FA-RRT*",
    target: new URL('https://github.com/ishanchadha01/Field-Aided-RRT'),
    showOnNavBar: false,
    group: RedirectGroup.ResumeReferences,
    entryType: EntryType.Redirect,
  }),
] as const;
REDIRECTS satisfies ValidatedList<typeof REDIRECTS, Redirect, InvalidRedirectAlias>;
// typeCheckFn<typeof REDIRECTS, Redirect, InvalidRedirectAlias>(REDIRECTS);

export type ConstRedirects = typeof REDIRECTS;
export type RedirectConst = ElementOf<ConstRedirects>;
export function excluding<F extends keyof RedirectConst, V extends RedirectConst[F]|undefined>(flagName: F, value: V) {
  type FilteredRedirect = Exclude<RedirectConst, {[K in F]: V}>;
  function filterFunc(redir: RedirectConst): redir is FilteredRedirect {
    return redir[flagName] !== value;
  }
  const filteredRedirects = REDIRECTS.filter(filterFunc);
  return arrayAsReadonly(filteredRedirects as TuplifyUnion<ElementOf<typeof filteredRedirects>>);
}
export function where<F extends keyof RedirectConst, V extends RedirectConst[F]>(flagName: F, value: V) {
  type FilteredRedirect = Extract<RedirectConst, {[K in F]: V}>;
  function filterFunc(redir: RedirectConst): redir is FilteredRedirect {
    return redir[flagName] === value;
  }
  return REDIRECTS.find(filterFunc);
}

export type AllSources = GetAliases<typeof REDIRECTS>;