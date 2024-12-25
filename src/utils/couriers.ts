import { BinderbyteApiResponse } from "@/types/courier";

type GetCarriersProps = {
  originCity: string;
  destinationCity: string;
  weightInKg: number; // Weight in kg
};

export const getCouriers = async ({
  originCity,
  destinationCity,
  weightInKg,
}: GetCarriersProps) => {
  try {
    const COST_CHECK_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/shipment/cost?originCity=${originCity.toLowerCase()}&destinationCity=${destinationCity.toLowerCase()}&weightInKg=${weightInKg}`;

    const res = await fetch(COST_CHECK_URL);
    const courierCosts: BinderbyteApiResponse<{
      summary: {
        courier: string[];
        origin: string;
        destination: string;
        weight: string;
      };
      costs: {
        code: string;
        name: string;
        service: string;
        type: string;
        price: string;
        estimated: string;
      }[];
    }> = await res.json();

    return courierCosts.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getCostByCourierCode = async ({
  courierCode,
  service,
  originCity,
  destinationCity,
  weightInKg,
}: GetCarriersProps & { courierCode: string; service: string }) => {
  const couriers = await getCouriers({
    originCity,
    destinationCity,
    weightInKg,
  });

  if (!couriers) {
    return;
  }

  const chosenCarrier = couriers.costs.find(
    (c) => c.code === courierCode && c.service === service,
  );

  const cost = chosenCarrier ? Number(chosenCarrier.price) : undefined;

  return cost;
};

export const getShipmentStatus = async (courierCode: string, awb: string) => {
  try {
    const SHIPMENT_STATUS_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/shipment/check-receipt?courierCode=${courierCode}&awb=${awb}`;

    const res = await fetch(SHIPMENT_STATUS_URL);
    const shipmentStatus: BinderbyteApiResponse<{
      summary: {
        awb: string;
        courier: string;
        service: string;
        status: string;
        date: string;
        desc: string;
        amount: string;
        weight: string;
      };
      detail: {
        origin: string;
        destination: string;
        shipper: string;
        receiver: string;
      };
      history: {
        date: string;
        desc: string;
        location: string;
      }[];
    }> = await res.json();

    return shipmentStatus;
  } catch (error) {
    console.log(error);
    return;
  }
};
