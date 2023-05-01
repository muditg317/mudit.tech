import type { NextPage } from "next";
import Link from "next/link";

import { REDIRECTS } from "~/content/urls";

const RedirectHub: NextPage = () => {
  return <>{REDIRECTS.map((redirect) => {
    return <Link key={redirect.target.toString()} href={redirect.target}>{redirect.title}</Link>
  })}</>
};

export default RedirectHub;