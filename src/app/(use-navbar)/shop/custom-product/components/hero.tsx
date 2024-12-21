/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { FC, useState } from "react";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { H1, H5 } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import ColorIcon from "@/components/svg-tsxIcon/colorIcon";
import { Settings } from "lucide-react";
import { ChevronDown } from "lucide-react";
import FabricIcon from "@/components/svg-tsxIcon/fabricIcon";
import { Prisma } from "@prisma/client";
import Image from "next/image";

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

export const Hero: FC<{ models: Models[]; bahans: Bahans[] }> = ({
  models,
  bahans,
}) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const calculatePrice = () => {
    const area = height * width;
    const pricePerSquareCm = 10;
    setEstimatedPrice(area * pricePerSquareCm);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    console.log(data);
  };

  return (
    <SectionContainer id="custom-product">
      <div className="my-10">
        <div className="w-[5rem] rounded-full bg-primary-100 px-3 py-2 text-center">
          <p className="text-primary-800">Custom</p>
        </div>
        <H1 className="my-4 text-black">
          Pesan Tirai Custom Sesuai Gaya dan Kebutuhan Anda
        </H1>

        <form onSubmit={handleFormSubmit}>
          <div className="col-span-1 min-w-max my-40">
            <div className="mt-20 flex items-center justify-between gap-2 border-b-2 border-gray-400 bg-transparent p-5">
              <div className="flex gap-2 items-center">
                <Settings className="h-8 w-12 text-gray-500" />
                <H5 className="text-md text-gray-500">Model</H5>
              </div>
              <p className="text-sm text-gray-500">None</p>
            </div>
            <ul className="mt-2 flex w-full flex-wrap p-2 m-16">
              {models.map((model) => (
                <li key={model.id} className="group relative gap-16">
                  <input
                    type="radio"
                    id={`model-${model.id}`}
                    name="model"
                    value={model.model}
                  />
                  <label
                    htmlFor={`model-${model.id}`}
                    className="flex h-[8rem] w-full items-center flex-col justify-center gap-2 rounded-md border border-gray-300 bg-gradient-to-bl from-black to-white p-4 text-sm font-medium shadow-sm transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-primary-100 group-hover:text-white"
                    style={{
                      backgroundImage: model.image
                        ? `url(${model.image})`
                        : "linear-gradient(135deg, #f0f0f0 25%, #ffffff 25%, #ffffff 50%, #f0f0f0 50%, #f0f0f0 75%, #ffffff 75%, #ffffff 100%)",
                      backgroundSize: "20px 20px",
                    }}
                  >
                    {model.image ? (
                      <Image
                        src={model.image}
                        alt={model.model}
                        width={80}
                        height={80}
                        className="h-full w-full rounded-md object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-600">
                        {model.model}
                      </span>
                    )}
                  </label>
                  <H1 className="text-center text-sm text-gray-600">
                    {model.model}
                  </H1>
                  <p className="text-center text-xs text-gray-400">
                    {model.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 min-w-max my-40">
            <div className="mt-20 flex items-center justify-between gap-2 border-b-2 border-gray-400 bg-transparent p-5">
              <div className="flex gap-2 items-center">
                <FabricIcon className="h-8 w-12 text-gray-500" />
                <H5 className="text-md text-gray-500">Bahan</H5>
              </div>
              <p className="text-sm text-gray-500">Cotton</p>
            </div>
            <ul className="mt-2 flex w-full flex-wrap p-2 m-16">
              {bahans.map((bahan) => (
                <li key={bahan.id} className="flex justify-center items-center gap-16">
                  <input
                    type="radio"
                    id={`bahan-${bahan.id}`}
                    name="bahan"
                    value={bahan.name}
                  />
                  <div>
                  <label className="mx-3 flex items-center text-black justify-center gap-2 rounded-md p-4 font-medium focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                    {bahan.name}
                  </label>
                  <p className="text-center text-gray-400">
                    {bahan.description}
                  </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 min-w-max my-40">
            <div className="mt-20 flex items-center justify-between gap-2 border-b-2 border-gray-400 bg-transparent p-5">
              <div className="flex gap-2 items-center">
                <ColorIcon className="h-8 w-12 text-gray-500" />
                <H5 className="text-md text-gray-500">Color</H5>
              </div>
              <p className="text-sm text-gray-500">#ffffff</p>
            </div>
            <input
              type="color"
              name="color"
              value={selectedColor ?? "#ffffff"}
              onChange={handleColorChange}
              className="h-[5rem] cursor-pointer w-full p-0 shadow-sm m-5"
            />
          </div>

          <div className="col-span-1 my-40">
            <div className="mt-20 flex items-center justify-between gap-2 border-b-2 border-gray-400 bg-transparent p-5">
              <div className="flex gap-2 items-center">
                <ChevronDown className="h-4 w-4 text-red-400" />
                <Settings className="h-8 w-12 text-gray-500" />
                <H5 className="text-md text-gray-500">Ukuran</H5>
              </div>
              <p className="text-sm text-gray-500">None</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col m-5">
                <label htmlFor="panjang" className="text-lg font-semibold">
                  Panjang <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="panjang"
                  id="panjang"
                  placeholder="Panjang (dalam cm)"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-col m-5">
                <label htmlFor="lebar" className="text-lg font-semibold">
                  Lebar <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="lebar"
                  id="lebar"
                  placeholder="Lebar (dalam cm)"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-col m-5">
                <label htmlFor="tinggi" className="text-lg font-semibold">
                  Tinggi <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="tinggi"
                  id="tinggi"
                  placeholder="Tinggi (dalam cm)"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={calculatePrice}
              className="bg-primary-800 text-white"
            >
              Bayar
            </Button>
            {estimatedPrice > 0 && (
              <p className="mt-4 text-lg font-semibold text-gray-800">
                Perkiraan Harga: Rp {estimatedPrice.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </form>
      </div>
    </SectionContainer>
  );
};
