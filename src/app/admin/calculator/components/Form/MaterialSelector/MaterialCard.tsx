import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Material } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

export const MaterialCard: FC<{ material: Material }> = ({ material }) => {
  return (
    <Label
      key={material.id}
      className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-muted"
    >
      <div className="relative aspect-square h-32 overflow-hidden rounded-md">
        <Image
          src={material.image}
          alt={material.name}
          fill
          className="object-cover"
        />
      </div>
      <RadioGroupItem value={material.name} id={`bahan-${material.id}`} />
      <Label
        htmlFor={`bahan-${material.id}`}
        className="flex flex-1 items-center justify-between"
      >
        <span className="font-medium">{material.name}</span>
        <span className="text-sm text-muted-foreground">
          {material.description}
        </span>
      </Label>
    </Label>
  );
};
