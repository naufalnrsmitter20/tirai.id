import { Body3, Display } from "@/components/ui/text";
import Image from "next/image";

type NavItem = {
  title: string;
  href: string;
};

const navItems: NavItem[] = [
  { title: "Beranda", href: "/" },
  { title: "Produk", href: "#custom" },
  { title: "Tentang Kami", href: "/about" },
  { title: "Kain", href: "#fabric" },
  { title: "Testimoni", href: "#testimony" },
];

export default function Home() {
  return (
    <>
      <nav className="fixed z-[999] w-full bg-white">
        <div className="mx-auto max-w-screen-xl"></div>
      </nav>
      <main className="mx-auto min-h-screen w-full max-w-screen-xl px-6 pt-[5.375rem] md:px-12">
        <section id="hero" className="mx-auto w-full py-[5.125rem]">
          <div className="relative h-[582px] overflow-hidden rounded-[1.25rem]">
            <Image
              src={"/assets/hero.png"}
              width={1440}
              height={582}
              alt="Hero Image"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-[44%]">
              <div className="flex flex-col items-center px-6 py-[7.375rem] text-center sm:px-12 md:px-[8.625rem]">
                <div className="flex items-center gap-2">
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 19.9V4.1C10.75 2.6 10.11 2 8.52 2H4.48C2.89 2 2.25 2.6 2.25 4.1V19.9C2.25 21.4 2.89 22 4.48 22H8.52C10.11 22 10.75 21.4 10.75 19.9Z"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22.25 19.9V4.1C22.25 2.6 21.61 2 20.02 2H15.98C14.39 2 13.75 2.6 13.75 4.1V19.9C13.75 21.4 14.39 22 15.98 22H20.02C21.61 22 22.25 21.4 22.25 19.9Z"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <Body3>Tirai Berkualitas Global</Body3>
                </div>
                <Display>
                  Pilihan Tirai Terbaik untuk Rumah, Kantor, dan Bisnis Anda
                </Display>
                <Body3>
                  Hadirkan suasana baru dengan gorden terbaik, dirancang untuk
                  kenyamanan dan gaya modern Anda.
                </Body3>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
