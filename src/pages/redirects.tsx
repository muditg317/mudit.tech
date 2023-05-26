import type { NextPage } from "next";
import Link from "next/link";

import { REDIRECTS } from "~/content/urls";

const RedirectHub: NextPage = () => {
  return <div className="grid w-full h-screen bg-purple-800 place-items-center">
    {REDIRECTS.map((redirect) => {
      return <Link key={redirect.target.toString()} href={redirect.target}>{redirect.title}</Link>
    })}
  </div>
};

export default RedirectHub;