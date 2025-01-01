import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";
import { findClosestLocation } from "./locationData";

export interface Service {
  code: string;
  name: string;
  service: string;
  note?: string;
  estimated: string;
  price: number;
}

const courierCodes: { [key: string]: string } = {
  jne: "JNE Express",
  pos: "POS Indonesia",
  jnt: "J&T Express",
  jnt_cargo: "J&T Cargo",
  sicepat: "SiCepat Express",
  tiki: "TIKI",
  anteraja: "AnterAja",
  wahana: "Wahana",
  ninja: "Ninja XPress",
  lion: "Lion Parcel",
  pcp: "PCP Express",
  jet: "JET Express",
  rex: "REX Express",
  first: "First Logistics",
  ide: "ID Express",
  spx: "Shopee Express",
  kgx: "KGXpress",
  sap: "SAP Express",
  jxe: "JX Express",
  rpx: "RPX",
  kurir_tokopedia: "Kurir Rekomendasi",
  lex: "Lazada Express",
  indah_cargo: "Indah Cargo",
  ant_cargo: "ANT Cargo",
};

function getCourierCode(description: string): string {
  const code = Object.keys(courierCodes).find(
    (key) => courierCodes[key].toLowerCase() === description.toLowerCase(),
  );
  return code || "unknown";
}

export async function scrapeShippingData(html: string): Promise<Service[]> {
  const $ = cheerio.load(html);
  const services: Service[] = [];

  $("h3.exp-title").each((_, expTitle) => {
    const expedition = $(expTitle).text().trim();
    const code = getCourierCode(expedition);

    $(expTitle)
      .next("table")
      .find("tbody tr")
      .each((_, row) => {
        let name = $(row).find("td.col-service").text().trim();
        name = name.replace(/<[^>]*>/g, ""); // Remove any leftover HTML tags
        const estimation = $(row).find("td.col-etd").text().trim();
        const costText = $(row).find("td.col-tarif").text().trim();
        const cost = parseInt(costText.replace(/,/g, "")) || 0;

        services.push({
          code,
          name: expedition,
          service: name,
          estimated: estimation,
          price: cost,
        });
      });

    const notesElement = $(expTitle).nextAll("div.desc-tbl").first();
    if (notesElement.length) {
      const notesText = notesElement.text().trim();
      const notesArray = notesText.split("\n").map((note) => note.trim());
      services.forEach((service) => {
        const note = notesArray.find((n) => n.startsWith(service.service));
        if (note) {
          service.note = note.split(":")[1]?.trim();
        }
      });
    }
  });

  return services;
}

function formatCityToUrl(city: string) {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function fetchShippingDetailsHtml(
  originId: string,
  destinationId: string,
  originCity: string,
  destinationCity: string,
  weight: number = 1,
): Promise<string | null> {
  const baseUrl = "https://ongkir.cekresi.com";
  const path = `/${originId}-${destinationId}-${formatCityToUrl(
    originCity,
  )}-${formatCityToUrl(destinationCity)}/?w=${weight}`;

  try {
    const response = await axios.get(`${baseUrl}${path}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
    });
    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error(`Failed to fetch HTML for path: ${path}`, e.message || error);
    return null;
  }
}

export async function getShippingPrice(
  originCity: string,
  destinationCity: string,
  weight: number,
) {
  try {
    const originLocation = await findClosestLocation(originCity);
    const destinationLocation = await findClosestLocation(destinationCity);

    if (originLocation === null || destinationLocation === null) {
      throw new Error(
        `Invalid origin or destination city: ${originCity}, ${destinationCity}`,
      );
    }

    const shippingHtml = await fetchShippingDetailsHtml(
      originLocation.id,
      destinationLocation.id,
      originLocation.kota,
      destinationLocation.kota,
      weight,
    );

    if (!shippingHtml) {
      throw new Error(
        `No shipping data found for ${originCity} to ${destinationCity}`,
      );
    }

    const shippingPrice = await scrapeShippingData(shippingHtml);

    return {
      destinationLocation,
      price: shippingPrice,
    };
  } catch (error) {
    console.error(
      `Failed to calculate shipping price`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
