import { PageContainer } from "@/components/layout/PageContainer";
import { AddressForm } from "./components/AddressForm";
import { Details } from "./components/Details";

export default function Checkout() {
  return (
    <PageContainer>
      <div className="flex w-full items-start justify-between">
        <AddressForm />
        <Details />
      </div>
    </PageContainer>
  );
}
