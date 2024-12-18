"use client";

import { buttonVariants } from "@/components/ui/button";
import { Body5 } from "@/components/ui/text";
import { NAV_ITEMS } from "@/constants/main-nav-items";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useRef } from "react";

export const Navbar: FC = () => {
  const { data: session, status } = useSession();
  const navbarToggle = useRef<HTMLInputElement>(null);
  const cart = useCart();

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

            {status === "authenticated" &&
              session.user?.role !== "CUSTOMER" &&
              session.user?.role !== "SUPPLIER" && (
                <Link
                  href={"/admin"}
                  className={buttonVariants({
                    variant: "default",
                    className: "ml-6 w-full text-center",
                  })}
                >
                  Dashboard
                </Link>
              )}
            {status === "authenticated" &&
              (session.user?.role === "CUSTOMER" ||
                session.user?.role === "SUPPLIER") && (
                <div className="ml-6 flex items-center gap-x-2">
                  <Link
                    href={"/profile"}
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full text-center",
                    })}
                  >
                    <UserRound />
                  </Link>
                  <Link
                    href={"/cart"}
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full text-center",
                    })}
                  >
                    <ShoppingCart />
                    {cart.cart && cart.cart.length > 0 && (
                      <Body5>{cart.cart.length}</Body5>
                    )}
                  </Link>
                </div>
              )}
            {status === "unauthenticated" && (
              <div className="ml-6 flex items-center gap-x-2">
                <Link
                  href={"/auth/login"}
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full text-center",
                  })}
                >
                  Masuk
                </Link>
                <Link
                  href={"/auth/register"}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full text-center",
                  })}
                >
                  Daftar
                </Link>
              </div>
            )}
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
            {status === "authenticated" &&
              session.user?.role !== "CUSTOMER" &&
              session.user?.role !== "SUPPLIER" && (
                <Link
                  href={"/admin"}
                  className={buttonVariants({
                    variant: "default",
                    className: "ml-6 w-full text-center",
                  })}
                >
                  Dashboard
                </Link>
              )}
            {status === "authenticated" &&
              (session.user?.role === "CUSTOMER" ||
                session.user?.role === "SUPPLIER") && (
                <div className="ml-6 flex items-center gap-x-2">
                  <Link
                    href={"/profile"}
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full text-center",
                    })}
                  >
                    <UserRound />
                  </Link>
                  <Link
                    href={"/cart"}
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full text-center",
                    })}
                  >
                    <ShoppingCart />
                    {cart.cart && cart.cart.length > 0 && (
                      <Body5>{cart.cart.length}</Body5>
                    )}
                  </Link>
                </div>
              )}
            {status === "unauthenticated" && (
              <div className="ml-6 flex items-center gap-x-2">
                <Link
                  href={"/auth/login"}
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full text-center",
                  })}
                >
                  Masuk
                </Link>
                <Link
                  href={"/auth/register"}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full text-center",
                  })}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
