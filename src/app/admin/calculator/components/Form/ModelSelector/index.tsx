import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";
import { Model } from "../../../types";
import { ModelCard } from "./ModelCard";

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string | null;
  onModelChange: (value: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelChange,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center space-x-4">
      <Settings className="h-6 w-6" />
      <CardTitle>Model Tirai</CardTitle>
    </CardHeader>
    <CardContent>
      <RadioGroup
        name="model"
        onValueChange={onModelChange}
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            selectedModel={selectedModel}
          />
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
);
