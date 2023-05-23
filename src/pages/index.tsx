import React, { useState } from "react";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { LayoutGroup, motion } from "framer-motion";

import { api } from "~/utils/api";

// const SUBSECTIONS = filteredPages("showOnMainPage", true);
const PROJECTS = [
  {
    title: "this website",
    slug: "this-website",
    description: "The website you're currently on. Built with Next.js, Tailwind CSS, and tRPC.",
  }
] as const;

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const [top, setTop] = useState(true);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] my-12">
            Mudit Gupta
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
        {/* {new Array(10).fill(0).map((_, index) => (
          <h1 key={index} data-nav-tab={`${index}`} className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Mudit Gupta {index}<br />--foo foo {index} foo <br />--foo foo {index} foo <br />--foo foo {index} foo 
          </h1>
        ))} */}
        <motion.div layout onClick={() => (console.log('top'), setTop(t=>!t))}>
          <LayoutGroup>
            {top && <motion.h1 layoutId="title" className="bg-blue-500">title</motion.h1>}
            <motion.p layoutId="span" className="bg-red-500">garbage<br/>garbage<br/>garbage<br/></motion.p>
            {!top && <motion.h1 layoutId="title" className="bg-green-500">title</motion.h1>}
          </LayoutGroup>
        </motion.div>
        <h1 className="text-5xl font-extrabold text-white sm:text-[5rem]">Projects</h1>
        {PROJECTS.map((project) => (
          <div key={project.title} className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            {/* <Link href={`projects/${project.slug}`}> */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem] my-12">
              {project.title}
            </h1>
            {/* </Link> */}
            <p className="text-2xl text-white w-2/3">
              {project.description}
            </p>
          </div>
        ))}
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};


// export const getServerSideProps: GetServerSideProps = async (context) => {
//   console.log(context.req.headers.referer);
//   // const hello = await api.example.hello.fetchQuery({ text: "from getServerSideProps" });

//   // return {
//   //   props: {
//   //     hello,
//   //   },
//   // };
//   return {
//     props: {},
//   };
// };