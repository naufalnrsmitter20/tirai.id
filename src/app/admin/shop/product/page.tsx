import { getProducts } from "@/actions/products";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageSelector } from "@/components/ui/PageSelector";
import { H1 } from "@/components/ui/text";
import { notFound } from "next/navigation";
import { ProductContainer } from "./components/ProductContainer";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ProductAdmin({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const { page } = await searchParams;
  let curPage = page ? parseInt(page) : 1;

  const res = await getProducts(12, curPage, "latest");
  if (!res.data) {
    return notFound();
  }
  const products = res.data.data;
  const meta = res.data.meta;

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Produk</H1>
      <div className="mb-3 inline-flex w-full justify-end">
        <Link
          className={buttonVariants({ variant: "default" })}
          href={"/admin/shop/product/add"}
        >
          <Plus /> Tambah Produk
        </Link>
      </div>
      <div className="mb-2 grid grid-cols-4 gap-3">
        <ProductContainer products={products} />
      </div>
      <PageSelector meta={meta} />
    </div>
  );
}
