import { useRouter } from "next/router";
import { pageWithAlias } from "~/content/urls";

/**
 * gets the current page object from the content source
 * @returns [page, currentRoute]
 */
export default function useRouterWithPage() {
  const router = useRouter();
  const currentRoute = router.pathname.substring(1);
  // console.log(router, currentRoute);

  const page = pageWithAlias(currentRoute);

  // console.log(page);

  return [router, currentRoute, page] as const;
}