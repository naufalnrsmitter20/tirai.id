import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus } from "lucide-react";
import { Prisma } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ShippingAddress = Prisma.ShippingAddressGetPayload<{
  select: {
    id: true;
    recipient_name: true;
    recipient_phone_number: true;
    street: true;
    village: true;
    district: true;
    city: true;
    province: true;
    postal_code: true;
    additional_info: true;
    is_primary: true;
  };
}>;

interface AddressCardProps {
  addresses: ShippingAddress[];
}

export const AddressSection: FC<AddressCardProps> = ({ addresses }) => {
  const [addressType, setAddressType] = useState<"existing" | "new">(
    "existing",
  );
  const [selectedAddress, setSelectedAddress] =
    useState<ShippingAddress | null>(null);

  const handleSelectAddress = (addressId: string) => {
    const address = addresses.find((addr) => addr.id === addressId);
    setSelectedAddress(address || null);
  };

  const AddressFields = ({ hidden = false }: { hidden?: boolean }) => (
    <div className={`space-y-6 ${hidden ? "hidden" : ""}`}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="recipient_name">
            Nama Penerima <span className="text-destructive">*</span>
          </Label>
          <Input
            id="recipient_name"
            name="recipient_name"
            required
            placeholder="Nama lengkap penerima"
            defaultValue={selectedAddress?.recipient_name || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipient_phone_number">
            Nomor Telepon <span className="text-destructive">*</span>
          </Label>
          <Input
            id="recipient_phone_number"
            name="recipient_phone_number"
            required
            placeholder="Nomor telepon penerima"
            defaultValue={selectedAddress?.recipient_phone_number || ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">
          Alamat Lengkap <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="street"
          name="street"
          required
          placeholder="Nama jalan, nomor rumah, RT/RW"
          defaultValue={selectedAddress?.street || ""}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="village">
            Kelurahan <span className="text-destructive">*</span>
          </Label>
          <Input
            id="village"
            name="village"
            required
            placeholder="Nama kelurahan"
            defaultValue={selectedAddress?.village || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">
            Kecamatan <span className="text-destructive">*</span>
          </Label>
          <Input
            id="district"
            name="district"
            required
            placeholder="Nama kecamatan"
            defaultValue={selectedAddress?.district || ""}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">
            Kota <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            name="city"
            required
            placeholder="Nama kota"
            defaultValue={selectedAddress?.city || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">
            Provinsi <span className="text-destructive">*</span>
          </Label>
          <Input
            id="province"
            name="province"
            required
            placeholder="Nama provinsi"
            defaultValue={selectedAddress?.province || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postal_code">
            Kode Pos <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postal_code"
            name="postal_code"
            required
            placeholder="Kode pos"
            defaultValue={selectedAddress?.postal_code || ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional_info">Catatan Tambahan</Label>
        <Textarea
          id="additional_info"
          name="additional_info"
          placeholder="Catatan untuk kurir (opsional)"
          defaultValue={selectedAddress?.additional_info || ""}
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <MapPin className="h-6 w-6" />
        <CardTitle>Alamat Pengiriman</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={addressType}
          name="addressType"
          onValueChange={(value) => {
            setAddressType(value as "existing" | "new");
            if (value === "new") {
              setSelectedAddress(null);
            }
          }}
          className="mb-6"
        >
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing">Gunakan alamat tersimpan</Label>
          </div>
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new">Tambah alamat baru</Label>
          </div>
        </RadioGroup>

        {addressType === "existing" && addresses.length > 0 ? (
          <div className="space-y-4">
            <Select onValueChange={handleSelectAddress}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih alamat" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id}>
                    <div className="space-y-1">
                      <p className="font-medium">{address.recipient_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.village}, {address.district},{" "}
                        {address.city}, {address.province} {address.postal_code}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : addressType === "existing" && addresses.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <p className="text-muted-foreground">Belum ada alamat tersimpan</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setAddressType("new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Alamat Baru
            </Button>
          </div>
        ) : null}

        {/* Hidden form fields for existing address */}
        {addressType === "existing" && selectedAddress && (
          <AddressFields hidden={true} />
        )}

        {/* Visible form fields for new address */}
        {addressType === "new" && <AddressFields />}
      </CardContent>
    </Card>
  );
};
