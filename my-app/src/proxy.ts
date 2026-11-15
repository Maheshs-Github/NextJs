import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authPages = ["/sign-in", "/sign-up", "/verify"];
const protectedPages = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  const isAuthPage = authPages.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isProtectedPage = protectedPages.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (token && (isAuthPage || pathname === "/")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!token && isProtectedPage) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in/:path*", "/sign-up/:path*", "/dashboard/:path*", "/verify/:path*"],
};

