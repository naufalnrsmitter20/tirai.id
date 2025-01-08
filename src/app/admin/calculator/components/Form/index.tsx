"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { Separator } from "@/components/ui/separator";
import { Body3, H1 } from "@/components/ui/text";
import { Discount } from "@prisma/client";
import { useState } from "react";
import { usePrice } from "../../hooks/use-price";
import { Dimensions, Material, Model } from "../../types";
import { DimensionsInput } from "./DimensionsInput";
import { MaterialSelector } from "./MaterialSelector";
import { ModelSelector } from "./ModelSelector";
import { PriceDisplay } from "./PriceDisplay";
import { QuantityInput } from "./QuantityInput";

interface FormProps {
  models: Model[];
  materials: Material[];
  customerDiscount?: Discount | null;
  supplierDiscount?: Discount | null;
}

export const Form: React.FC<FormProps> = ({
  models,
  materials,
  customerDiscount,
  supplierDiscount,
}) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: 0,
    width: 0,
  });
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const price = usePrice(
    dimensions,
    selectedMaterial,
    quantity,
    customerDiscount,
    supplierDiscount,
  );

  const handleMaterialChange = (value: string) => {
    const material = materials.find((m) => m.name === value);
    setSelectedMaterial(material || null);
  };

  const handleDimensionChange = (type: keyof Dimensions, value: number) => {
    setDimensions((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <SectionContainer id="custom-product">
      <div className="pb-8">
        <div className="mb-8 space-y-4">
          <H1 className="text-black">Kalkulasi Harga Produk Kustom</H1>
          <Body3 className="text-neutral-500">
            Buat tirai sesuai dengan kebutuhan dan gaya interior Anda
          </Body3>
          <Separator />
        </div>

        <form className="space-y-8">
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          <MaterialSelector
            materials={materials}
            onMaterialChange={handleMaterialChange}
          />
          <DimensionsInput onDimensionChange={handleDimensionChange} />
          <QuantityInput quantity={quantity} onQuantityChange={setQuantity} />
          <PriceDisplay price={price} customerDiscount={customerDiscount} />
        </form>
      </div>
    </SectionContainer>
  );
};
