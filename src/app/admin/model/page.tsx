import { H1 } from "@/components/ui/text";
import { ModelTable } from "./components/ModelTable";
import { findModels } from "@/utils/database/model.query";

export default async function CustomProductModel() {
  const models = await findModels();

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Model</H1>
      <div className="mb-2">
        <ModelTable models={models} />
      </div>
    </div>
  );
}
