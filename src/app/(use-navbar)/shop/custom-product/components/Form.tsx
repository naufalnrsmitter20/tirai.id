"use client";

import { FC, useState } from "react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette } from "lucide-react";
import FabricIcon from "@/components/svg-tsxIcon/fabricIcon";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddressSection, ShippingAddress } from "./Address";
import { Session } from "next-auth";
import { toast } from "sonner";
import { addCustomProductByUser, saveAddress } from "../actions";
import { useRouter } from "next/navigation";
import { Body3, H1 } from "@/components/ui/text";

export type Models = Prisma.ModelGetPayload<{
  select: { id: true; description: true; image: true; model: true };
}>;

export type Bahans = Prisma.MaterialGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    price: true;
    supplier_price: true;
  };
}>;

export const Form: FC<{
  models: Models[];
  bahans: Bahans[];
  addresses: ShippingAddress[];
  user: Session["user"];
}> = ({ models, bahans, addresses, user }) => {
  const [dimensions, setDimensions] = useState({ length: 0, width: 0 });
  const [selectedMaterial, setSelectedMaterial] = useState<Bahans | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const router = useRouter();

  if (!user) return <></>;

  const calculatePrice = (
    length: number,
    width: number,
    materialPrice: number,
  ) => {
    const area = length * width;
    return area * materialPrice;
  };

  const handleMaterialChange = (value: string) => {
    const material = bahans.find((b) => b.name === value);
    setSelectedMaterial(material || null);
    if (material) {
      const price = calculatePrice(
        dimensions.length,
        dimensions.width,
        user?.role === "SUPPLIER" ? material.supplier_price : material.price,
      );
      setEstimatedPrice(price);
    }
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const handleDimensionChange = (type: "length" | "width", value: number) => {
    const newDimensions = {
      ...dimensions,
      [type]: value,
    };
    setDimensions(newDimensions);

    if (selectedMaterial) {
      const price = calculatePrice(
        newDimensions.length,
        newDimensions.width,
        selectedMaterial.price,
      );
      setEstimatedPrice(price);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const toastId = toast.loading("Loading...");
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const userId = user.id;
    formData.append("price", estimatedPrice.toString());
    formData.append("user_id", user.id);

    const addressType = formData.get("addressType") as string;

    if (addressType === "new") {
      const recipient_name = formData.get("recipient_name") as string;
      const recipient_phone_number = formData.get(
        "recipient_phone_number",
      ) as string;
      const street = formData.get("street") as string;
      const village = formData.get("village") as string;
      const district = formData.get("district") as string;
      const city = formData.get("city") as string;
      const province = formData.get("province") as string;
      const postal_code = formData.get("postal_code") as string;
      const additional_info = formData.get("additional_info") as string | null;

      const data: Prisma.ShippingAddressUncheckedCreateInput = {
        city,
        district,
        postal_code,
        province,
        recipient_name,
        recipient_phone_number,
        street,
        user_id: userId,
        village,
        additional_info,
      };

      await saveAddress(data);
    }

    const action = await addCustomProductByUser(formData);

    if (action.error) {
      toast.error(action.error.message, { id: toastId });
    } else {
      toast.success("Sukses. Harap menunggu konfirmasi Admin", { id: toastId });
      router.push("/cart");
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

        <form onSubmit={handleSubmit} className="space-y-8">
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
                            value={model.model}
                            id={`model-${model.id}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`model-${model.id}`}
                            className={`flex cursor-pointer flex-col items-center space-y-2 rounded-lg border-2 p-4 transition-all hover:bg-muted ${
                              selectedModel === model.model
                                ? "border-primary bg-primary/10 ring-primary ring-2 ring-offset-2"
                                : "border-muted"
                            }`}
                          >
                            {model.image ? (
                              <div className="relative h-32 w-full overflow-hidden rounded-md">
                                <Image
                                  src={model.image}
                                  alt={model.model}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-32 w-full rounded-md bg-muted" />
                            )}
                            <div className="space-y-1 text-center">
                              <span className="text-sm font-medium">
                                {model.model}
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
                    {models.find((m) => m.model === selectedModel)?.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <FabricIcon className="h-6 w-6" />
              <CardTitle>Bahan</CardTitle>
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
              <Palette className="h-6 w-6" />
              <CardTitle>Warna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="color"
                  name="color"
                  defaultValue="#ffffff"
                  className="h-16 w-full cursor-pointer"
                />
              </div>
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
                    Panjang <span className="text-destructive">*</span>
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
                    Lebar <span className="text-destructive">*</span>
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
          <AddressSection addresses={addresses} />
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4">
                {estimatedPrice > 0 && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-lg font-semibold">
                      Perkiraan Harga:{" "}
                      <span className="text-primary">
                        Rp {estimatedPrice.toLocaleString("id-ID")}
                      </span>
                    </p>
                  </div>
                )}
                <Button type="submit" size="lg">
                  Kirim Permintaan
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </SectionContainer>
  );
};
