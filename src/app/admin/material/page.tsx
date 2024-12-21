import { H1 } from "@/components/ui/text";
import { findMaterials } from "@/utils/database/material.query";
import { MaterialTable } from "./components/MaterialTable";

export default async function CustomProductMaterials() {
  const materials = await findMaterials();

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Material</H1>
      <div className="mb-2">
        <MaterialTable materials={materials} />
      </div>
    </div>
  );
}
