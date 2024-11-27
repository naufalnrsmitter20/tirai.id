interface NavItem {
  title: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Beranda", href: "/" },
  { title: "Produk", href: "#custom" },
  { title: "Tentang Kami", href: "/about" },
  { title: "Kain", href: "#fabric" },
  { title: "Testimoni", href: "#testimony" },
] as const;
