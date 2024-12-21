import { getProducts } from "@/actions/products";
import { buttonVariants } from "@/components/ui/button";
import { Body3, H1 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProductContainer } from "./components/ProductContainer";

export default async function ProductAdmin({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const { page } = await searchParams;
  const curPage = page ? parseInt(page) : 1;

  const res = await getProducts(12, curPage, "latest");

  const products = res.data?.data;

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Produk</H1>
      <div className="mb-3 flex w-full items-center justify-end">
        <Link
          className={buttonVariants({ variant: "default" })}
          href={"/admin/shop/product/add"}
        >
          <Plus /> Tambah Produk
        </Link>
      </div>
      <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <ProductContainer products={products || []} />
      </div>
      {res.data && res.data.data.length > 0 && res.data.meta && (
        <PageSelector meta={res.data.meta} />
      )}
      {res.data?.data.length === 0 && (
        <Body3 className="text-neutral-500">Belum ada produk apapun...</Body3>
      )}
    </div>
  );
}
