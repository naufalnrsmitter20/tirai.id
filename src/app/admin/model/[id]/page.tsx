import { findModel } from "@/utils/database/model.query";
import { notFound } from "next/navigation";
import ModelForm from "../components/ModelForm";

export default async function UpdateMaterial({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const model = await findModel({ id });
  if (!model) return notFound();

  return <ModelForm updateData={model} />;
}
