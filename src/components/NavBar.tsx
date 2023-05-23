import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { MAIN_PAGE, navPages } from "~/content/urls";
import { ArrayOf, ElementOf } from "~/utils/types";

const NavbarItems = [
  MAIN_PAGE,
  ...navPages
] as const;

type NavBarEntry = {
  readonly title: string;
} & Readonly<Record<string, unknown>>;

interface NavBarProps<EntryType extends NavBarEntry> {
  entries: Readonly<ArrayOf<'at least', 1, EntryType>>,
  isActiveTab: (entry: EntryType) => boolean;
  onTabClick: (entry: EntryType) => void;
}
export default function NavBar<EntryType extends NavBarEntry>({ entries, isActiveTab, onTabClick }: NavBarProps<EntryType>) {
  const activeIndex = useMemo(() => {
    return entries.findIndex(isActiveTab);
  }, [entries, isActiveTab]);

  return (
    <div className="w-full min-h-full h-full flex flex-col justify-start items-center">
      <div className="basis-1/2 w-full flex flex-col items-center mt-4">
        {activeIndex > 0 && <NavBarOptionGroup
          // @ts-expect-error slice guaranteed non-empty because of activeIndex > 0
          entries={entries.slice(0, activeIndex)}
          isActiveTab={isActiveTab}
          onTabClick={onTabClick}
        />}
        <NavGroupDivider heightClass={`h-full mb-4 ${activeIndex > 0 ? "mt-4" : "-mt-4"}`} />
      </div>
      <NavBarOptionGroup
          // @ts-expect-error slice guaranteed non-empty because of activeIndex > 0
          entries={entries.slice(activeIndex, activeIndex + 1)}
          isActiveTab={isActiveTab}
          onTabClick={onTabClick}
        />
      <div className="basis-1/2 w-full flex flex-col items-center">
        {activeIndex < entries.length - 1 && <>
          <NavGroupDivider heightClass="h-full my-4" />
          <NavBarOptionGroup
            // @ts-expect-error slice guaranteed non-empty because of activeIndex < entries length - 1
            entries={entries.slice(activeIndex + 1)}
            isActiveTab={isActiveTab}
            onTabClick={onTabClick}
          />
        </>}
        <NavGroupDivider heightClass={`${activeIndex < entries.length - 1 ? "h-1/3" : "h-full"} mt-4`} />
      </div>
    </div>
  );
}

function NavGroupDivider({ heightClass }: { heightClass: string }) {
  return (
    <div className={`border-r-2 dark:border-zinc-800 border-zinc-500 ${heightClass}`} />
  );
}

interface NavBarOptionGroupProps<EntryType extends NavBarEntry>
  extends NavBarProps<EntryType> {}
function NavBarOptionGroup<EntryType extends NavBarEntry>({ entries, isActiveTab, onTabClick }: NavBarOptionGroupProps<EntryType>) {
  return (
    <div className="flex flex-col gap-4">
      {entries.map(item => {
        return (
          <NavBarOption key={item.title}
            item={item}
            isActive={isActiveTab(item)}
            onTabClick={onTabClick} />
        );
      })}
    </div>
  );
}

interface NavBarOptionProps<EntryType extends NavBarEntry> {
  item: ElementOf<NavBarProps<EntryType>['entries']>;
  isActive: ReturnType<NavBarProps<EntryType>['isActiveTab']>;
  onTabClick: NavBarProps<EntryType>['onTabClick'];
};
function NavBarOption<EntryType extends NavBarEntry>({ item, isActive, onTabClick }: NavBarOptionProps<EntryType>) {
  return (
    <button
      className={`
        relative
        w-full flex justify-center items-center
        shadow hover:shadow-xl
        rounded
        hover:scale-110 duration-300 ease-in-out
        focus:bg-zinc-800 dark:focus:bg-zinc-700 
        hover:bg-zinc-800 dark:hover:bg-zinc-700
        group
        ${isActive
          ? "bg-zinc-800 dark:bg-zinc-700"
          : "bg-zinc-700 dark:bg-zinc-800"}
      `}
      onClick={() => onTabClick(item)}
    >
      <div className="p-2">
        {/* <item.icon size="1rem" className="text-zinc-100" /> */}
      </div>
      {(
        <span className={`
          absolute left-10 p-[0.62rem]
          min-w-max max-h-[200%]
          rounded shadow-xl
          text-[0.75rem] leading-none
          text-zinc-200
          bg-zinc-800 dark:bg-zinc-700
          pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out
        `}>
          {item.title}
        </span>
      )}
    </button>
  );
}