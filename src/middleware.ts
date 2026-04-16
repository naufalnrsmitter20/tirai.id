import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;
    
    // Helper function to redirect to login with callback URL
    const redirectToLogin = (callbackUrl: string) =>
      NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url));

    // Routes requiring authentication
    const authRequiredRoutes = [
      "/admin",
      "/shop/cart",
      "/shop/product",
      "/account",
      "/shop/custom-product",
      "/cek-resi",
    ];

    if (
      authRequiredRoutes.some((route) => pathname.startsWith(route)) &&
      !token
    ) {
      return redirectToLogin(pathname);
    }

    if (pathname.startsWith("/shop/checkout") && !token) {
      return redirectToLogin("/cart");
    }

    // Admin-specific routes requiring SUPERADMIN role
    const superAdminRoutes = [
      "/admin/shop/category/add",
      "/admin/shop/product/add",
      "/admin/user/add",
      "/admin/seo/add",
      "/admin/referal/add",
      "/admin/material/add",
      "/admin/model/add",
    ];

    if (
      superAdminRoutes.some((route) => pathname.startsWith(route)) &&
      token?.role !== "SUPERADMIN"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url), {
        status: 403,
      });
    }

    // Block access to non-contentwriter
    if (
      pathname.startsWith("/admin/article/add") &&
      token?.role !== "SUPERADMIN" &&
      token?.role === "CONTENTWRITER"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url), {
        status: 403,
      });
    }

    // Role-based access control
    if (
      (pathname.startsWith("/auth") && token) ||
      (pathname.startsWith("/admin") &&
        ["CUSTOMER", "AGENT", "AFFILIATE", "SUPPLIER"].includes(token!.role)) ||
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
