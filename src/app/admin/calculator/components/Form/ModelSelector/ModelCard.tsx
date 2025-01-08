import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { FC } from "react";
import { Model } from "../../../types";

export const ModelCard: FC<{ selectedModel: string | null; model: Model }> = ({
  selectedModel,
  model,
}) => {
  return (
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
                <span className="text-sm font-medium">{model.name}</span>
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
  );
};
