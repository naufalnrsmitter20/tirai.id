import { ReactNode, Suspense } from "react";

export default function ResetLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
