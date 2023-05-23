import React, { useMemo } from "react";
import type { ArrayOf, ElementOf } from "~/utils/types";
import { LayoutGroup, motion } from "framer-motion";

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
    <motion.div layout layoutRoot
        transition={{ duration: 3 }}
        className="w-full min-h-full h-full flex flex-col justify-start items-center">
      <LayoutGroup>
        <NavGroupDivider name="divider-top" heightClass={`${activeIndex > 0 ? "h-0" : "h-full"} mb-2`} />
        {entries.map((item, index) => {
          const isActive = isActiveTab(item);
          const showBars = isActive || index === activeIndex - 1;
          return (<>
            <motion.div layout layoutId={item.title}
                className={`
                  my-2 aspect-square
                  grid place-items-center
                `.replace(/\s+/g, " ")}
                onClick={() => onTabClick(item)}
              >
              <NavBarOption
                key={item.title}
                {...{item, isActive, onTabClick}}
              />
            </motion.div>
            {<NavGroupDivider
              key={`div-${item.title}`}
              name={`div-${item.title}`}
              heightClass={`
                ${showBars
                  ? "h-full my-2"
                  : (index === entries.length -1
                    ? "h-1/3 my-2"
                    : "h-0")}
                last:mb-0`.replace(/\s+/g, " ")}
              />}
          </>);
        })}
      </LayoutGroup>
    </motion.div>
  );
}

function NavGroupDivider({ heightClass, name }: { heightClass: string, name: string }) {
  return (
    <motion.div layoutId={name} data-name={name} className={`border-r-2 rounded dark:border-zinc-800 border-zinc-500 ${heightClass}`} />
  );
}

interface NavBarOptionProps<EntryType extends NavBarEntry> {
  item: ElementOf<NavBarProps<EntryType>['entries']>;
  isActive: ReturnType<NavBarProps<EntryType>['isActiveTab']>;
  onTabClick: NavBarProps<EntryType>['onTabClick'];
}
function NavBarOption<EntryType extends NavBarEntry>({ item, isActive, onTabClick }: NavBarOptionProps<EntryType>) {
  return (
    <button
        className={`
          relative
          aspect-square h-full
          grid place-items-center
          rounded
          shadow hover:shadow-xl
          hover:scale-110 duration-300 ease-in-out
          focus:bg-zinc-800 dark:focus:bg-zinc-700 
          hover:bg-zinc-800 dark:hover:bg-zinc-700
          group
          ${isActive
            ? "bg-zinc-800 dark:bg-zinc-700"
            : "bg-zinc-700 dark:bg-zinc-800"}
        `.replace(/\s+/g, " ")}
      >
      <div className="p-2 text-white">
        {/* <item.icon size="1rem" className="text-zinc-100" /> */}
        {item.title.at(0)?.toUpperCase()}
      </div>
      {(
        <span className={`
          absolute left-12
          p-[0.62rem]
          min-w-max max-h-[200%]
          rounded shadow-xl
          text-[0.75rem] leading-none
          text-zinc-200
          bg-zinc-800 dark:bg-zinc-700
          pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out
        `.replace(/\s+/g, " ")}>
          {item.title}
        </span>
      )}
    </button>
  );
}