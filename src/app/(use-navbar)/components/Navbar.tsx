"use client";

import { buttonVariants } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constants/main-nav-items";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useRef } from "react";

const ADMIN_ROLES: Role[] = [
  "ADMIN",
  "SUPERADMIN",
  "CONTENTWRITER",
  "SALES",
] as const;

export const Navbar: FC = () => {
  const { data: session } = useSession();
  const navbarToggle = useRef<HTMLInputElement>(null);

  return (
    <>
      <nav className="fixed z-[1000] w-full bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 py-4 md:px-12">
          <Link href={"/"} className="max-w-[100.37px]">
            <span className="block h-[48px] w-[100.37px] bg-[url(/assets/logo-trimmed.png)] bg-contain bg-no-repeat text-transparent">
              Tirai.id
            </span>
          </Link>
          <ul className="hidden items-center lg:flex lg:items-end">
            {NAV_ITEMS.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={buttonVariants({
                    variant: "link",
                    size: "link",
                    className:
                      "border-b border-neutral-100 px-6 pb-3 text-neutral-500 hover:border-primary-900 hover:text-primary-900",
                  })}
                >
                  {item.title}
                </Link>
              </li>
            ))}

            <Link
              href={
                session?.user?.role
                  ? ADMIN_ROLES.includes(session.user.role)
                    ? "/admin"
                    : "#"
                  : "/auth/login"
              }
              className={buttonVariants({
                variant: "default",
                className: "ml-6 w-full text-center",
              })}
            >
              {session?.user?.role
                ? ADMIN_ROLES.includes(session.user.role)
                  ? "Dashboard"
                  : "Belanja sekarang"
                : "Belanja sekarang"}
            </Link>
          </ul>
          <div className="flex items-center gap-2 lg:hidden">
            <input
              type="checkbox"
              id="sidebar-btn"
              className="checkbox-sidebar hidden"
              ref={navbarToggle}
            />

            <label
              htmlFor="sidebar-btn"
              className="sidebar-btn flex items-center text-black"
            >
              <span className="icon-hamburger"></span>
            </label>
          </div>
        </div>
      </nav>
      {/* Mobile Sidebar */}
      <aside className="mobile-sidebar nav-shadow fixed right-0 top-0 z-[999] h-screen w-[264px] overflow-y-scroll bg-white transition-all duration-300 lg:hidden">
        <div className="flex h-full flex-col justify-between px-5 py-[42px]">
          <div className="block">
            <ul className="mb-8 mt-14 flex flex-col gap-7">
              {NAV_ITEMS.map((item, i) => (
                <li key={i} className="ml-3">
                  <Link
                    href={item.href}
                    className={buttonVariants({
                      variant: "link",
                      size: "link",
                    })}
                    onClick={() => {
                      navbarToggle.current!.checked = false;
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex w-full flex-col items-center justify-between gap-4 lg:hidden">
            {/* TODO: Change the href to e-commerce or something */}
            <Link
              href={
                session?.user?.role
                  ? ADMIN_ROLES.includes(session.user.role)
                    ? "/admin"
                    : "#"
                  : "/auth/login"
              }
              className={buttonVariants({
                variant: "default",
                className: "ml-6 w-full text-center",
              })}
            >
              {session?.user?.role
                ? ADMIN_ROLES.includes(session.user.role)
                  ? "Dashboard"
                  : "Belanja sekarang"
                : "Belanja sekarang"}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
