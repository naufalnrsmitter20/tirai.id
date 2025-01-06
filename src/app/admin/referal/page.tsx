import { H1 } from "@/components/ui/text";
import { PageSelector } from "@/components/widget/PageSelector";
import { ReferalWithUser } from "@/types/entityRelations";
import { findReferals } from "@/utils/database/referal.query";
import { ReferalTable } from "./components/ReferalTable";

export default async function ReferalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: queryPage } = await searchParams;
  const page = parseInt(queryPage || "1");
  const response = await findReferals(12, page, {
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const referals = response.data as ReferalWithUser[];

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Referal</H1>
      <div className="mb-2">
        <ReferalTable referals={referals} meta={response.meta} />
      </div>
      {referals.length > 0 && <PageSelector meta={response.meta} />}
    </div>
  );
}
