import { notFound } from "next/navigation";
import UserForm from "../add/components/UserForm";
import { findUser } from "@/utils/database/user.query";

export default async function UpdateUser({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const user = await findUser({ id });
  if (!user) return notFound();

  return <UserForm updateData={user} />;
}
