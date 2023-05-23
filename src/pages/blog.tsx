import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MAIN_PAGE, filteredPages, navPages } from "~/content/urls";

import { api } from "~/utils/api";

// const SUBSECTIONS = filteredPages("showOnMainPage", true);
const PROJECTS = [
  {
    title: "this website",
    slug: "this-website",
    description: "The website you're currently on. Built with Next.js, Tailwind CSS, and tRPC.",
  }
] as const;

const Blog: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] my-12">
            Blog
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

export default Blog;

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
