import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// middleware is applied to all routes, use conditionals to select
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    if (
      (pathname.startsWith("/admin") && !token) ||
      (pathname.startsWith("/shop/cart") && !token) ||
      (pathname.startsWith("/shop/product") && !token) ||
      (pathname.startsWith("/account") && !token)
    ) {
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${pathname}`, req.url),
      );
    }

    if (pathname.startsWith("/shop/checkout") && !token) {
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=/cart`, req.url),
      );
    }

    if (
      (pathname.startsWith("/auth") && token) ||
      (pathname.startsWith("/admin") && token?.role === "CUSTOMER") ||
      (pathname.startsWith("/admin/user") && token?.role !== "SUPERADMIN") ||
      (pathname.startsWith("/admin/chat") && token?.role !== "SALES")
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url), {
        status: 403,
      });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);
