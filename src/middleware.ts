import { NextRequest, NextResponse } from "next/server";
import { paraglideMiddleware } from "./paraglide/server";

export function middleware(request: NextRequest) {
  return paraglideMiddleware(request, ({ request, locale }) => {
    request.headers.set("x-paraglide-locale", locale);
    request.headers.set("x-paraglide-request-url", request.url);
    return NextResponse.next({ request });
  });
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
