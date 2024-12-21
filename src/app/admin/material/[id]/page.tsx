import { findMaterial } from "@/utils/database/material.query";
import { notFound } from "next/navigation";
import MaterialForm from "../components/MaterialForm";

export default async function UpdateMaterial({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const material = await findMaterial({ id });
  if (!material) return notFound();

  return <MaterialForm updateData={material} />;
}
