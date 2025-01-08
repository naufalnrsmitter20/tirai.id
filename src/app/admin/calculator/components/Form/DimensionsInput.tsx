import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { Dimensions } from "../../types";

interface DimensionsInputProps {
  onDimensionChange: (type: keyof Dimensions, value: number) => void;
}

export const DimensionsInput: React.FC<DimensionsInputProps> = ({
  onDimensionChange,
}) => (
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
              onDimensionChange("length", parseInt(e.target.value) || 0)
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
              onDimensionChange("width", parseInt(e.target.value) || 0)
            }
          />
        </div>
      </div>
    </CardContent>
  </Card>
);
