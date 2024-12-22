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
  const [panjang, setPanjang] = useState(0);
  const [lebar, setLebar] = useState(0);
  const [price, setPrice] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const calculatePrice = () => {
    const area = panjang * lebar;
    setEstimatedPrice(area * price);
  };
  const handlePanjangChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPanjang(parseInt(event.target.value));
    calculatePrice();
  };
  const handleLebarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLebar(parseInt(event.target.value));
    calculatePrice();
  };
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    data.append("price", estimatedPrice.toString());
    console.log(data.get("material"));
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
          <div className="col-span-1 my-40 min-w-max">
            <div className="mt-20 flex items-center justify-between gap-2 border-b-2 border-gray-400 bg-transparent p-5">
              <div className="flex items-center gap-2">
                <Settings className="h-8 w-12 text-gray-500" />
                <H5 className="text-md text-gray-500">Model</H5>
              </div>
              <p className="text-sm text-gray-500">None</p>
            </div>
            <ul className="m-16 mt-2 flex w-full flex-wrap p-2">
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
                    className="flex h-[8rem] w-full flex-col items-center justify-center gap-2 rounded-md border border-gray-300 bg-gradient-to-bl from-black to-white p-4 text-sm font-medium shadow-sm transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-primary-100 group-hover:text-white"
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

          <div className="col-span-1 my-40 min-w-max">
            <div className="mt-20 flex items-center justify-between gap-2 border-b-2 border-gray-400 bg-transparent p-5">
              <div className="flex items-center gap-2">
                <FabricIcon className="h-8 w-12 text-gray-500" />
                <H5 className="text-md text-gray-500">Bahan</H5>
              </div>
              <p className="text-sm text-gray-500">Cotton</p>
            </div>
            <ul className="mt-2 flex w-full flex-col flex-wrap p-2">
              {bahans.map((bahan) => (
                <li
                  key={bahan.id}
                  className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-evenly pe-3 ps-3">
                    <input
                      id={`bahan-${bahan.id}`}
                      type="radio"
                      value={bahan.name}
                      onChange={(e) => setPrice(bahan.price)}
                      name="material"
                      className="m-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                    />
                    <label
                      htmlFor={`bahan-${bahan.id}`}
                      className="mx-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {bahan.name}
                    </label>
                    <p className="m-2 text-center text-gray-400">
                      {bahan.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 my-40 min-w-max">
            <div className="mt-20 flex items-center justify-between gap-2 border-b-2 border-gray-400 bg-transparent p-5">
              <div className="flex items-center gap-2">
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
              className="m-5 h-[5rem] w-full cursor-pointer p-0 shadow-sm"
            />
          </div>

          <div className="col-span-1 my-40">
            <div className="mt-20 flex items-center justify-between gap-2 border-b-2 border-gray-400 bg-transparent p-5">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4 text-red-400" />
                <Settings className="h-8 w-12 text-gray-500" />
                <H5 className="text-md text-gray-500">Ukuran</H5>
              </div>
              <p className="text-sm text-gray-500">None</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="m-5 flex flex-col">
                <label htmlFor="panjang" className="text-lg font-semibold">
                  Panjang <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="height"
                  id="panjang"
                  onChange={handlePanjangChange}
                  placeholder="Panjang (dalam cm)"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="m-5 flex flex-col">
                <label htmlFor="lebar" className="text-lg font-semibold">
                  Lebar <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="width"
                  id="lebar"
                  onChange={handleLebarChange}
                  placeholder="Lebar (dalam cm)"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-primary-800 text-white" type="submit">
              Kirim Permintaan
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
