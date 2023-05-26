import type { ArrayOf, ElementOf, ReadonlyTuplifyUnion, ValueOf } from "~/utils/types";
import type { GetArrayFieldValues, ValidatedList } from "./urls/types";
import { filterFuncsFor } from "./manipulators";

const Language = {
  CPP: "C++",
} as const;
const Tags = {
  Compiler: "Compiler",
  Interpreter: "Interpreter",
  Graphics: "Graphics",
  Terminal: "Terminal",
} as const;
// type Language = ValueOf<typeof Language>;
// type Tags = ValueOf<typeof Tags>;

interface Project {
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  startDate: Date;
  endDate: Date;
  languages: Readonly<ArrayOf<'at least', 1, ValueOf<typeof Language>>>;
  tags: Readonly<ArrayOf<'at least', 1, ValueOf<typeof Tags>>>;
  contents: string | JSX.Element;
}

export const PROJECTS = [
  {
    title: "Bokay: Custom C-style language",
    subtitle: "Programming language created from scratch",
    startDate: new Date(2021, 10, 10),
    endDate: new Date(),
    languages: [Language.CPP],
    tags: [Tags.Compiler, Tags.Interpreter],
    contents: "I implemented a compiler for .bokay files in C++. The compiler involved a custom lexer, parser, and compiler."
  },
  {
    title: "Termdraw",
    subtitle: "Graphics Library for the Terminal",
    startDate: new Date(2021, 10, 21),
    endDate: new Date(), //2021,10,28),
    languages: [Language.CPP],
    tags: [Tags.Graphics, Tags.Terminal],
    contents: "I made a graphics library for drawing in the terminal with a series of braille characters (to get more pixels than console size). The library provides a similar API to p5.js."
  },
] as const satisfies ReadonlyArray<Project>;
// PROJECTS satisfies ValidatedList<typeof PROJECTS, Project, never>;


(PROJECTS as unknown as Array<Project>)
    .sort((a,b) => b.startDate.valueOf() - a.startDate.valueOf()) // subsort by start date
    .sort((a,b) => b.endDate.valueOf() - a.endDate.valueOf());    // sort by end date

export type ConstProjects = typeof PROJECTS;
export type ProjectConst = ElementOf<ConstProjects>;
export function excluding<F extends keyof ProjectConst, V extends ProjectConst[F]>(flagName: F, value: V) {
  type FilteredProject = Exclude<ProjectConst, {[K in F]: V}>;
  function filterFunc(page: ProjectConst): page is FilteredProject {
    return page[flagName] !== value;
  }
  const filteredProjects = PROJECTS.filter(filterFunc);
  return filteredProjects as ReadonlyTuplifyUnion<FilteredProject>;
  // return arrayAsReadonly(filteredProjects as TuplifyUnion<ElementOf<typeof filteredProjects>>);
}
export type AllTags = GetArrayFieldValues<typeof PROJECTS, 'tags', ProjectConst>;

// export const filteredProjects = filterFor(PROJECTS);
// export const projectWhere = whereFuncFor(PROJECTS);

export const projectFilter = filterFuncsFor(PROJECTS);
// const foo = projectFilter('title', 'Termdraw');
// type t = typeof foo[number]['title'];
// const bar = projectFilter.firstOf('title', 'Termdraw');
