import { PageSelector } from "@/components/ui/PageSelector";
import { Body3, H1 } from "@/components/ui/text";
import { findUsers } from "@/utils/database/user.query";
import { UserTable } from "./components/UserTable";

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: queryPage } = await searchParams;
  const page = parseInt(queryPage || "1");
  const response = await findUsers(6, page);
  const users = response.data;

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Admin Tirai.id</H1>
      <div className="mb-2">
        {users.length > 0 && <UserTable meta={response.meta} users={users} />}
        {users.length === 0 && (
          <Body3 className="text-neutral-500">
            Tidak ada user yang ditemukan...
          </Body3>
        )}
      </div>
      {users.length > 0 && <PageSelector meta={response.meta} />}
    </div>
  );
}
