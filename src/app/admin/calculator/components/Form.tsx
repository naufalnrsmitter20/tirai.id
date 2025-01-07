"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import FabricIcon from "@/components/svg-tsxIcon/fabricIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Body3, H1 } from "@/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRupiah } from "@/lib/utils";
import { Discount, Prisma } from "@prisma/client";
import { Settings } from "lucide-react";
import Image from "next/image";
import { FC, useCallback, useEffect, useState } from "react";

export type Models = Prisma.ModelGetPayload<{
  select: { id: true; description: true; image: true; name: true };
}>;

export type Bahans = Prisma.MaterialGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    price: true;
    supplier_price: true;
    image: true;
  };
}>;

export const Form: FC<{
  models: Models[];
  bahans: Bahans[];
  customerDiscount?: Discount | null;
  supplierDiscount?: Discount | null;
}> = ({ models, bahans, customerDiscount, supplierDiscount }) => {
  const [dimensions, setDimensions] = useState({ length: 0, width: 0 });
  const [selectedMaterial, setSelectedMaterial] = useState<Bahans | null>(null);
  const [price, setPrice] = useState({
    customer: { original: 0, discounted: 0 },
    supplier: { original: 0, discounted: 0 },
  });
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const calculatePrice = useCallback(
    (
      length: number,
      width: number,
      materialPrice: number,
      discount?: Discount | null,
    ) => {
      const area = (length / 100) * (width / 100);
      const brute = (area < 1 ? 1 : area) * materialPrice;
      return {
        original: brute * quantity,
        discounted:
          (brute - brute * (discount?.discount_in_percent || 0 / 100)) *
          quantity,
      };
    },
    [quantity],
  );

  const handleMaterialChange = (value: string) => {
    const material = bahans.find((b) => b.name === value);
    setSelectedMaterial(material || null);

    if (material) {
      const customerPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        material.price,
        customerDiscount,
      );
      const supplierPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        material.supplier_price,
        supplierDiscount,
      );

      setPrice({
        customer: { ...customerPrice },
        supplier: { ...supplierPrice },
      });
    }
  };

  useEffect(() => {
    if (selectedMaterial) {
      const customerPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        selectedMaterial.price,
        customerDiscount,
      );
      const supplierPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        selectedMaterial.supplier_price,
        supplierDiscount,
      );

      setPrice({
        customer: { ...customerPrice },
        supplier: { ...supplierPrice },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.length, dimensions.width, quantity, selectedMaterial]);

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    if (selectedMaterial) {
      const customerPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        selectedMaterial.price,
        customerDiscount,
      );
      const supplierPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        selectedMaterial.supplier_price,
        supplierDiscount,
      );

      setPrice({
        customer: { ...customerPrice },
        supplier: { ...supplierPrice },
      });
    }
  };

  const handleDimensionChange = (type: "length" | "width", value: number) => {
    const newDimensions = {
      ...dimensions,
      [type]: value,
    };
    setDimensions(newDimensions);

    if (selectedMaterial) {
      const customerPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        selectedMaterial.price,
        customerDiscount,
      );
      const supplierPrice = calculatePrice(
        dimensions.length,
        dimensions.width,
        selectedMaterial.supplier_price,
        supplierDiscount,
      );

      setPrice({
        customer: { ...customerPrice },
        supplier: { ...supplierPrice },
      });
    }
  };

  return (
    <SectionContainer id="custom-product">
      <div className="pb-8">
        <div className="mb-8 space-y-4">
          <H1 className="text-black">Kustomisasi Tirai</H1>
          <Body3 className="text-neutral-500">
            Buat tirai sesuai dengan kebutuhan dan gaya interior Anda
          </Body3>
          <Separator />
        </div>

        <form className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Settings className="h-6 w-6" />
              <CardTitle>Model Tirai</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                name="model"
                onValueChange={handleModelChange}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
              >
                {models.map((model) => (
                  <TooltipProvider key={model.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <RadioGroupItem
                            value={model.name}
                            id={`model-${model.id}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`model-${model.id}`}
                            className={`flex cursor-pointer flex-col items-center space-y-2 rounded-lg border-2 p-4 transition-all hover:bg-muted ${
                              selectedModel === model.name
                                ? "border-primary bg-primary/10 ring-primary ring-2 ring-offset-2"
                                : "border-muted"
                            }`}
                          >
                            {model.image ? (
                              <div className="relative h-32 w-full overflow-hidden rounded-md">
                                <Image
                                  src={model.image}
                                  alt={model.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-32 w-full rounded-md bg-muted" />
                            )}
                            <div className="space-y-1 text-center">
                              <span className="text-sm font-medium">
                                {model.name}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {model.description}
                              </p>
                            </div>
                          </Label>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{model.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </RadioGroup>
              {selectedModel && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    {models.find((m) => m.name === selectedModel)?.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <FabricIcon className="h-6 w-6" />
              <CardTitle>Varian</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                name="material"
                onValueChange={handleMaterialChange}
                className="space-y-2"
              >
                {bahans.map((bahan) => (
                  <Label
                    key={bahan.id}
                    className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-muted"
                  >
                    <div className="relative aspect-square h-32 overflow-hidden rounded-md">
                      <Image
                        src={bahan.image}
                        alt={bahan.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <RadioGroupItem
                      value={bahan.name}
                      id={`bahan-${bahan.id}`}
                    />
                    <Label
                      htmlFor={`bahan-${bahan.id}`}
                      className="flex flex-1 items-center justify-between"
                    >
                      <span className="font-medium">{bahan.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {bahan.description}
                      </span>
                    </Label>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Settings className="h-6 w-6" />
              <CardTitle>Ukuran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="length">
                    Panjang (cm) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="length"
                    name="length"
                    required
                    placeholder="Panjang (dalam cm)"
                    onChange={(e) =>
                      handleDimensionChange(
                        "length",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">
                    Lebar (cm) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="width"
                    name="width"
                    required
                    placeholder="Lebar (dalam cm)"
                    onChange={(e) =>
                      handleDimensionChange(
                        "width",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Settings className="h-6 w-6" />
              <CardTitle>Jumlah Barang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    defaultValue={1}
                    onScroll={(e) => {
                      e.preventDefault();
                    }}
                    placeholder="Jumlah barang yang akan dipesan"
                    onChange={(e) => setQuantity(Number(e.target.value) ?? 1)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-lg font-semibold">
                    Perkiraan Harga Original (Customer):{" "}
                    <span className="text-primary">
                      {formatRupiah(price.customer.original)}
                    </span>
                  </p>
                  <p className="text-lg font-semibold">
                    Perkiraan Harga{" "}
                    {customerDiscount &&
                      `(Diskon ${customerDiscount.discount_in_percent}%)`}{" "}
                    (Customer):{" "}
                    <span className="text-primary">
                      {formatRupiah(price.customer.discounted)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-lg font-semibold">
                    Perkiraan Harga Original (Supplier):{" "}
                    <span className="text-primary">
                      {formatRupiah(price.supplier.original)}
                    </span>
                  </p>
                  <p className="text-lg font-semibold">
                    Perkiraan Harga{" "}
                    {customerDiscount &&
                      `(Diskon ${customerDiscount.discount_in_percent}%)`}{" "}
                    (Supplier):{" "}
                    <span className="text-primary">
                      {formatRupiah(price.supplier.discounted)}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </SectionContainer>
  );
};
