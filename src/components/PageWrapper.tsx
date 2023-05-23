import React, { useMemo } from "react";
import Footer from "./Footer";

import { useRouterWithPage } from "~/hooks";
import Head from "next/head";
import { MAIN_PAGE, navPages } from "~/content/urls";
import NavBar from "./NavBar";
import type { PageConst } from "~/content/urls/pages";
import { readonlyIncludes } from "~/utils/type-modifiers";

type PageWrapperProps = {
  children: React.ReactNode;
};
const PageWrapper = ({ children }: PageWrapperProps) => {
  const [router, currentRoute, page] = useRouterWithPage();
  // const [activeTab, setActiveTab] = useState<string>(currentRoute);
  const activeTab = currentRoute;

  const navbar = useMemo(() => {
    return <NavBar<PageConst>
      entries={[
        MAIN_PAGE,
        ...navPages
      ] as const}
      isActiveTab={(entry: PageConst) => readonlyIncludes(entry.aliases, activeTab)}
      onTabClick={(entry: PageConst) => void router.push(`/${entry.aliases[0]}`)}
    />
  }, [activeTab, router]);

  if (!page) {
    return <>
      {children}
    </>
  }

  return (<>
    <Head>
      <title key='title'>{page.isMainPage ? page.title : `${MAIN_PAGE?.title} - ${page.title}`}</title>
      <meta key='desc' name="description" content="Mudit Gupta website" />
      {/* <link rel="icon" href="/favicon.ico" /> */}
      <link key='icon-svg' rel="icon" href="favicon.svg"
        type="image/svg+xml" />
      <link key='ico-light' rel="icon" href="favicon-light.ico"
        media="(prefers-color-scheme: light)"
      />
      <link key='ico-dark' rel="icon" href="favicon-dark.ico"
        media="(prefers-color-scheme: dark)"
      />
    </Head>
    <div className="flex selection:bg-zinc-200/30 flex-col overflow-x-hidden min-h-screen items-center bg-zinc-100 dark:bg-zinc-900 font-clash max-h-auto relative">
      {/* <Palette /> used for KBar */}
      <header className="">
        <nav className="w-[6%] fixed left-0 h-full z-50 hidden lg:block md:block">
          { navbar }
        </nav>
        <nav className="fixed top-0 w-full z-50 block lg:hidden md:hidden px-8 pt-4">
          {/* <MobileNavBar path={currentRoute} /> */}
        </nav>
      </header>
      <div className="w-full min-h-screen h-full flex flex-col items-center relative">
        <section className="flex flex-col w-full justify-between mt-16 lg:mt-0 md:mt-0 prose">
          {/* <Header /> -- only for main page */}
          {/* {!page.isMainPage && <>
            <h1 className="dark:text-zinc-200 text-zinc-900 leading-none mb-3">{page?.title ?? "no title"}</h1>
            <p className="dark:text-zinc-400 text-zinc-800 m-0 leading-tight">
              {page?.description ?? "no description"}
            </p>
          </>} */}
          { children }
        </section>
      </div>
      <Footer />
    </div>
  </>);
};

export default PageWrapper;