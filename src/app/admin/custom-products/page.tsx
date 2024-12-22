import { PageSelector } from "@/components/widget/PageSelector";
import { H1 } from "@/components/ui/text";
import { findCustomRequestEntries } from "@/utils/database/customRequest.query";
import { CustomRequestTable } from "./_components/CustomRequestTable";
import { CustomRequest } from "@prisma/client";

export default async function CustomRequestPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ page?: string }>;
}>) {
  const { page: queryPage } = await searchParams;
  const page = parseInt(queryPage || "1");
  const response = await findCustomRequestEntries(6, page, {
    include: { user: { select: { email: true } } },
  });
  const requests = response.data as unknown as (CustomRequest & {
    user: { email: string };
  })[];

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Custom Requests</H1>
      <div className="mb-2">
        <CustomRequestTable meta={response.meta} requestData={requests} />
      </div>
      {requests.length > 0 && <PageSelector meta={response.meta} />}
    </div>
  );
}
