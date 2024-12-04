import { PageSelector } from "@/components/ui/PageSelector";
import { Body3 } from "@/components/ui/text";
import { findUsers } from "@/utils/database/user.query";
import { UserCard } from "./components/UserCard";
import { UserTable } from "./components/UserTable";

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: queryPage } = await searchParams;
  const page = parseInt(queryPage ?? "1");
  const response = await findUsers({}, 6, page);
  const users = response.data;

  return (
    <div>
      <div>
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
