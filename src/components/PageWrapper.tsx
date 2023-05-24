import React, { ComponentProps, ExoticComponent, FunctionComponent, HTMLAttributes, PropsWithChildren, ReactElement, ReactHTML, ReactPropTypes, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Footer from "./Footer";

import { usePrevious, useRouterWithPage } from "~/hooks";
import Head from "next/head";
import { MAIN_PAGE, navPages } from "~/content/urls";
import NavBar from "./NavBar";
import type { PageConst } from "~/content/urls/pages";
import { exactEntries, fromExactEntries, readonlyIncludes } from "~/utils/type-modifiers";
import { AnimatePresence, AnimationProps, ForwardRefComponent, HTMLMotionProps, MotionProps, MotionStyle, Transition, Variants, createDomMotionComponent, motion } from "framer-motion";
import { ElementOf, ExactEntries, TuplifyUnion, ValueOf } from "~/utils/types";

const navEntries = [
  MAIN_PAGE,
  ...navPages
] as const;

type direction = "left"|"right";
type MotionCustom = direction;
type MotionAnimation = NonNullable<AnimationProps["initial"]>;
type CustomGen<T> = (custom: MotionCustom) => T;
type MotionVariantType<T> = T|CustomGen<T>;
const pageAnimations = {
  screenXEnter: (direction: direction) => ({ opacity: 0, zIndex: 1, x: 200 * (direction === "left" ? 1 : -1), y: 0 } as const), // left flow -> enter from right
  screenXExit: (direction: direction) => ({ opacity: 0, zIndex: 1, x: 200 * (direction === "left" ? -1 : 1), y: 0 } as const), // left flow -> exit to left
  // screenTop: { opacity: 0, x: 0, y: -200 },
  // screenBottom: { opacity: 0, x: 0, y: 200 },
  visible: { opacity: 1, zIndex: 1, x: 0, y: 0 },
} as const satisfies Record<string, MotionVariantType<MotionAnimation>>;
const transitionStyles = {
  enter: { type: 'linear', duration: 5 },
  exit: { type: 'linear', duration: 3 },
} as const satisfies Record<string, Transition>;

type Variant = ValueOf<typeof pageAnimations> & {
  readonly transition: ValueOf<typeof transitionStyles>;
};
type VariantRecord = Record<`${keyof typeof pageAnimations}-${keyof typeof transitionStyles}`|keyof typeof pageAnimations, Variant>;
const pageAnimationVariants = Object.fromEntries(
  exactEntries(pageAnimations).flatMap((kv) => {
    const [key, value] = kv;
    return [kv, ...exactEntries(transitionStyles).map((kv2) => {
      const [key2, value2] = kv2;
      type funcVals = Extract<typeof value, (custom:MotionCustom) => object>;
      function isFuncVal(v: typeof value): v is funcVals { return typeof v === "function" }
      return [`${key}-${key2}`, isFuncVal(value)
        ? (custom:MotionCustom) => {
          const oldValue = value(custom);
          return { ...oldValue, transition: value2 };
        }
        : { ...value, transition: {...value, value2} }
      ] as const;
    })];
  })
) as VariantRecord;

type PageWrapperProps = {
  children: React.ReactNode;
};
const PageWrapper = ({ children }: PageWrapperProps) => {
  const [router, currentRoute, page] = useRouterWithPage();
  // const [activeTab, setActiveTab] = useState<string>(currentRoute);
  // useEffect(() => {
  //   setActiveTab(currentRoute);
  // }, [currentRoute]);
  const activeTab = currentRoute;
  const [previousTab, updatePrevTab] = usePrevious(activeTab);
  const tabChanged = useMemo(() =>
      previousTab !== undefined && previousTab != activeTab,
    [previousTab, activeTab]);
  const pageAnimCustom = useRef<MotionCustom>("left");
  // useEffect(() => {
  if (previousTab !== undefined) {
    const activeInd = navEntries.findIndex(entry => readonlyIncludes(entry.aliases, activeTab));
    const prevInd = navEntries.findIndex(entry => readonlyIncludes(entry.aliases, previousTab));
    if (activeInd < prevInd) {
      pageAnimCustom.current = "right";
    } else if (activeInd > prevInd) {
      pageAnimCustom.current = "left";
    } else {
    }
  }
  // }, [activeTab, previousTab]);

  // console.log({ activeTab, previousTab, custom: pageAnimCustom.current });

  const navTabIsActiveCb = useCallback((entry: PageConst) => {
    return readonlyIncludes(entry.aliases, activeTab);
  }, [activeTab]);
  const navTabClickCb = useCallback((entry: PageConst) => {
    void router.push(`/${entry.aliases[0]}`);
  }, [router]);

  if (!page) {
    return <>
      {children}
    </>
  }

  return (<>
    <Head>
      <title key='title'>{page.isMainPage ? page.title : `${MAIN_PAGE?.title} - ${page.title}`}</title>
      <meta key='desc' name="description" content="Mudit Gupta website" />
      <link key='icon-svg' rel="icon" href="favicon.svg"
        type="image/svg+xml" />
      <link key='ico-light' rel="icon" href="favicon-light.ico"
        media="(prefers-color-scheme: light)"
      />
      <link key='ico-dark' rel="icon" href="favicon-dark.ico"
        media="(prefers-color-scheme: dark)"
      />
    </Head>
    <div
        className={`
          relative
          flex flex-col items-center
          bg-zinc-100 dark:bg-zinc-900 selection:bg-zinc-200/30
          overflow-x-hidden
          min-h-screen max-h-auto
        `.replace(/\s+/g, " ")}
      >
      {/* <Palette /> used for KBar */}
      <header className="">
        <nav className="w-max pl-4 fixed left-0 h-full z-50 hidden lg:block md:block">
          <NavBar<PageConst>
            entries={navEntries}
            isActiveTab={navTabIsActiveCb}
            onTabClick={navTabClickCb}
          />
        </nav>
        <nav className="fixed top-0 w-full z-50 block lg:hidden md:hidden px-8 pt-4">
          {/* <MobileNavBar path={currentRoute} /> */}
        </nav>
      </header>
      <main className="w-full min-h-screen h-full flex flex-col items-center">
        <AnimatePresence
            mode="popLayout"
            initial={false}
            onExitComplete={() => {
              // console.log("page exited");
              window.scrollTo(0, 0);
            }}
            custom={pageAnimCustom.current}
        >
          <motion.section
              className="flex flex-col w-full justify-between mt-16 lg:mt-0 md:mt-0 prose"
              data-page-name={currentRoute}
              key={activeTab}
              initial="screenXEnter-enter"
              animate="visible-enter"
              exit="screenXExit-exit"
              variants={pageAnimationVariants}
              custom={pageAnimCustom.current}
              transition={{ type: "linear" }}
            >
            {/* {(() => {
              console.log("current page is -- ", {
                tabChanged,
                key: activeTab,
              },'\n',
                'exit:',(pageAnimations["screenXExit"])(pageAnimCustom.current),
                'enter:',(pageAnimations["screenXEnter"])(pageAnimCustom.current)
              );
              return <></>;
            })()} */}
            { children }
          </motion.section>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  </>);
};

export default PageWrapper;