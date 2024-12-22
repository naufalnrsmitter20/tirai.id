import { notFound } from "next/navigation";
import SeoForm from "../_components/SeoForm";
import { getSeoPageById } from "@/utils/database/seo.query";

export default async function UpdateSeo({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const seo = await getSeoPageById(parseInt(id));
  if (!seo) return notFound();

  return <SeoForm updateData={seo} />;
}
