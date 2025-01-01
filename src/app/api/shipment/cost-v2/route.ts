import { getShippingPrice } from "@/actions/shippingPrice/scraper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const originCity = searchParams.get("originCity");
  const destinationCity = searchParams.get("destinationCity");
  const weightInKg = searchParams.get("weightInKg");

  const getCostsSchema = z.object({
    originCity: z.string().min(1),
    destinationCity: z.string().min(1),
    weightInKg: z.number(),
  });

  if (
    !getCostsSchema.safeParse({
      originCity,
      destinationCity,
      weightInKg: Number(weightInKg),
    }).success
  ) {
    return NextResponse.json(
      { status: 400, message: "Bad request" },
      { status: 400 },
    );
  }

  if (!(originCity && destinationCity && weightInKg)) {
    return NextResponse.json(
      { status: 400, message: "Bad request" },
      { status: 400 },
    );
  }

  try {
    const res = await getShippingPrice(
      originCity,
      destinationCity,
      parseInt(weightInKg),
    );

    const courierCosts = {
      costs: res?.price || [],
      destinationLocation: res?.destinationLocation,
    };

    return NextResponse.json(courierCosts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const revalidate = 7200;
