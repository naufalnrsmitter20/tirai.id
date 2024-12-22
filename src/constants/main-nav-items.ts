interface NavItem {
  title: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Beranda", href: "/" },
  { title: "Tentang Kami", href: "/about" },
  { title: "Artikel", href: "/article" },
  { title: "Belanja", href: "/shop" },
  { title: "Kustom", href: "/shop/custom-product" },
] as const;
