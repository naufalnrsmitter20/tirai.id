import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package2 } from "lucide-react";
import { useState } from "react";

interface QuantityInputProps {
  quantity: number;
  onQuantityChange: (value: number) => void;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  onQuantityChange,
}) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const parsedValue = parseInt(value) || 1;
    onQuantityChange(Math.max(1, parsedValue));
  };

  const handleIncrement = () => {
    const newValue = quantity + 1;
    setInputValue(newValue.toString());
    onQuantityChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(1, quantity - 1);
    setInputValue(newValue.toString());
    onQuantityChange(newValue);
  };

  const handleBlur = () => {
    const parsedValue = parseInt(inputValue) || 1;
    const validValue = Math.max(1, parsedValue);
    setInputValue(validValue.toString());
    onQuantityChange(validValue);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Package2 className="h-6 w-6" />
        <CardTitle>Jumlah Barang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex max-w-[240px] items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            min="1"
            className="text-center"
            onWheel={(e) => e.currentTarget.blur()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncrement}
          >
            +
          </Button>
        </div>
        {parseInt(inputValue) < 1 && (
          <p className="mt-2 text-sm text-destructive">
            Jumlah minimal pemesanan adalah 1
          </p>
        )}
      </CardContent>
    </Card>
  );
};
