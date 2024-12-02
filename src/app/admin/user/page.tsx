import { Button } from "@/components/ui/button";
import { Body1, Body3, Body4, H2, H3 } from "@/components/ui/text";
import { findUsers } from "@/utils/database/user.query";
import { UserCard } from "./components/UserCard";
import { PageSelector } from "@/components/ui/PageSelector";

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
        {users.length > 0 && (
          <div className="grid w-full grid-cols-3 gap-4">
            {users.map((i) => (
              <UserCard data={i} key={i.id} />
            ))}
          </div>
        )}
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
