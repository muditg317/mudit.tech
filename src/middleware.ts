// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { pageWithAlias, redirectWithAlias, Page_RedirectHub, type Redirect } from '~/content/urls'

export function middleware(request: NextRequest) {
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
  if (redirection) {
    console.log(`redirect from [${pathname}] to [${redirection.title}](${redirection.target})`);
    return NextResponse.redirect(redirection.target);
  } else if (redirectionMatch?.[4]) {
    console.log(`Unknown redirection @ [${pathname}] -- [${redirectionMatch}]`);
    // TODO: fetch redirections from database
    const desiredRedirect = null as Partial<Redirect> | null;
    if (desiredRedirect) {
      console.log(`redirect from [${pathname}] to [${desiredRedirect.title}](${desiredRedirect.target})`);
      return NextResponse.redirect(desiredRedirect.target!);
    }
    
    console.log(`Redirecting to Redirect Hub @ [${Page_RedirectHub.pathname}]`);
    return NextResponse.redirect(new URL(`/${Page_RedirectHub.pathname}`, request.url));
  } else if (redirectionMatch) {
    console.log(`Broken redirection @ [${pathname}] -- [${redirectionMatch}]`);
    if (pathname === Page_RedirectHub.pathname) {
      return NextResponse.next();
    }
    console.log(`Redirecting to Redirect Hub @ [${Page_RedirectHub.pathname}]`);
    return NextResponse.redirect(new URL(`/${Page_RedirectHub.pathname}`, request.url));
  }

  return NextResponse.next();
  // return NextResponse.redirect(new URL('/about-2', request.url))
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