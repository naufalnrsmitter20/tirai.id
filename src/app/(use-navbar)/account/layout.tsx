import { PageContainer } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer>
      <SectionContainer>
        <div className="mx-auto w-full max-w-xl">{children}</div>
      </SectionContainer>
    </PageContainer>
  );
}
