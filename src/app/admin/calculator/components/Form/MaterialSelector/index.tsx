import FabricIcon from "@/components/svg-tsxIcon/fabricIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Material } from "../../../types";
import { MaterialCard } from "./MaterialCard";

interface MaterialSelectorProps {
  materials: Material[];
  onMaterialChange: (value: string) => void;
}

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  materials,
  onMaterialChange,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center space-x-4">
      <FabricIcon className="h-6 w-6" />
      <CardTitle>Varian</CardTitle>
    </CardHeader>
    <CardContent>
      <RadioGroup
        name="material"
        onValueChange={onMaterialChange}
        className="space-y-2"
      >
        {materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </RadioGroup>
    </CardContent>
  </Card>
);
