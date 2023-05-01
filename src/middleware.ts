// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { pageWithAlias, redirectWithAlias, Page_RedirectHub } from '~/content/urls'
import { prisma } from './server/db';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.substring(1);
  // =========== check for page aliases ===========
  const targetPage = pageWithAlias(pathname);
  if (targetPage) {
    if (pathname === targetPage.aliases[0]) {
      return NextResponse.next();
    }
    console.log(`page redirect from [${pathname}] to [${targetPage.aliases[0]}]`);
    return NextResponse.redirect(new URL(`/${targetPage.aliases[0]}`, request.url))
  }

  // =========== check for configured redirections ===========
  const redirectionMatch = pathname.match(/^(redirect(s|ion)?|external)(\/([^\/]+))?$/);
  const redirection = redirectWithAlias(pathname)
      ?? [redirectionMatch?.[4]].map(pname => pname && redirectWithAlias(pname))[0];
  if (redirection) { // there is an existing internal redirect saved in the config
    console.log(`redirect from [${pathname}] to [${redirection.title}](${redirection.target.href})`);
    return NextResponse.redirect(redirection.target);
  } else if (redirectionMatch?.[4]) { // there is a redirection request with some target
    console.log(`Unknown redirection @ [${pathname}] -- [${redirectionMatch[4]}] - checking database...`);
    // TODO: fetch redirections from database
    // const desiredRedirect = null as Partial<Redirect> | null;
    const desiredRedirect = await prisma.redirection.findFirst({
      where: {
        aliases: {
          contains: `||${redirectionMatch[4]}||`
        }
      },
      select: {
        title: true,
        target: true,
      }
    });
    // console.log('DB result:', desiredRedirect);
    if (desiredRedirect) { // the reqirection request is found in the database
      console.log(`redirect from [${pathname}] to [${desiredRedirect.title}](${desiredRedirect.target})`);
      return NextResponse.redirect(desiredRedirect.target);
    }
    
    console.log(`Return to Redirect Hub @ [${Page_RedirectHub.pathname}]`);
    const target = new URL(`/${Page_RedirectHub.pathname}`, request.url);
    target.searchParams.set('from', redirectionMatch[4]);
    return NextResponse.redirect(target);
  } else if (redirectionMatch) { // there is a redirection request but no target
    console.log(`Broken redirection @ [${pathname}] -- [${redirectionMatch.toString()}]`);
    if (pathname === Page_RedirectHub.pathname) { // already pointed at hub
      return NextResponse.next();
    }
    console.log(`Return to Redirect Hub @ [${Page_RedirectHub.pathname}]`);
    return NextResponse.redirect(new URL(`/${Page_RedirectHub.pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}