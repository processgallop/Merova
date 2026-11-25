import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic check only: send visitors without a session cookie to the login
 * page. Real authorisation happens server-side in every admin page and action.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (!req.cookies.get("mrv_session")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/preview/:path*"] };
