import React from "react";
import { useRouter } from "next/router";
// import Header from "./Header";
import Footer from "./Footer";

import { pageWithAlias } from "~/content/urls"

type PageWrapperProps = {
  children: React.ReactNode;
};
const PageWrapper = ({ children }: PageWrapperProps) => {
  const router = useRouter();
  const currentRoute = router.pathname.substring(1);
  // console.log(router, currentRoute);

  const page = pageWithAlias(currentRoute);

  // console.log(page);

  if (!page) {
    return <>
      {children}
    </>
  }

  return (
    <main className="flex selection:bg-zinc-200/30 flex-col overflow-x-hidden min-h-screen items-center bg-zinc-100 dark:bg-zinc-900 font-clash max-h-auto relative">
      {/* <Palette /> used for KBar */}
      <div className="flex w-full h-full lg:w-[60%] md:w-2/3">
        <div className="w-[6%] fixed left-0 h-full z-50 hidden lg:block md:block">
          {/* <NavBar path={currentRoute} /> */}
        </div>
        <div className="fixed top-0 w-full z-50 block lg:hidden md:hidden px-8 pt-4">
          {/* <MobileNavBar path={currentRoute} /> */}
        </div>
        <div className="w-full min-h-screen h-full p-8 flex flex-col items-center relative">
          <section className="flex flex-col w-full justify-between mt-16 lg:mt-0 md:mt-0 prose">
            <h1 className="dark:text-zinc-200 text-zinc-900 leading-none mb-3">{page?.title ?? "no title"}</h1>
            <p className="dark:text-zinc-400 text-zinc-800 m-0 leading-tight">
              {page?.description ?? "no description"}
            </p>
            { children }
          </section>
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default PageWrapper;