import type { ArrayOf, ElementOf, ValueOf } from "~/utils/types";
import type { CapitalizedString, GetArrayFieldValues, MultiWord } from "./urls/types";
import { type ValidateListField, filterFuncsFor } from "./manipulators";

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
  title: CapitalizedString;
  subtitle?: string;
  aliases: Readonly<ArrayOf<'at least', 1, string>>;
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
    aliases: ["bokay"],
    startDate: new Date(2021, 10, 10),
    endDate: new Date(),
    languages: [Language.CPP],
    tags: [Tags.Compiler, Tags.Interpreter],
    contents: "I implemented a compiler for .bokay files in C++. The compiler involved a custom lexer, parser, and compiler."
  },
  {
    title: "Termdraw",
    subtitle: "Graphics Library for the Terminal",
    aliases: ["termdraw"],
    startDate: new Date(2021, 10, 21),
    endDate: new Date(), //2021,10,28),
    languages: [Language.CPP],
    tags: [Tags.Graphics, Tags.Terminal],
    contents: "I made a graphics library for drawing in the terminal with a series of braille characters (to get more pixels than console size). The library provides a similar API to p5.js."
  },
  {
    title: "Bokay 2 for testing",
    subtitle: "Programming language created from scratch",
    aliases: ["termddraw", "bodkay"],
    startDate: new Date(2021, 10, 21),
    endDate: new Date(), //2021,10,28),
    languages: [Language.CPP],
    tags: [Tags.Graphics, Tags.Terminal],
    contents: "I made a graphics library for drawing in the terminal with a series of braille characters (to get more pixels than console size). The library provides a similar API to p5.js."
  },
] as const satisfies ReadonlyArray<Project>;
PROJECTS satisfies ValidateListField<Project, 'aliases', typeof PROJECTS, 'no duplicates', MultiWord|CapitalizedString|"">;


// (PROJECTS as unknown as Array<Project>)
//     .sort((a,b) => b.startDate.valueOf() - a.startDate.valueOf()) // subsort by start date
//     .sort((a,b) => b.endDate.valueOf() - a.endDate.valueOf());    // sort by end date

type ConstProjects = typeof PROJECTS;
type ProjectConst = ElementOf<ConstProjects>;
export type AllTags = GetArrayFieldValues<typeof PROJECTS, 'tags', ProjectConst>;


export const projectFilter = filterFuncsFor(PROJECTS);
// const foo = projectFilter('subtitle', 'Programming language created from scratch');
// type t = typeof foo[number]['title'];
// const bar = projectFilter.firstWith.byField('subtitle')('Programming language created from scratch');
// // const bar = projectFilter.firstWith('subtitle','Programming language created from scratch');
// type t2 = typeof bar['title'];
// const bar2 = projectFilter.firstWith.byField('subtitle')('Graphics Library for the Terminal');
// // const bar2 = projectFilter.firstWith('subtitle','Graphics Library for the Terminal');
// type t2_ = typeof bar2['title'];
// const exc = projectFilter.excluding('title', 'Termdraw');
// type t3 = typeof exc[number]['title'];
