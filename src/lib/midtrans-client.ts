import { Snap } from "./midtrans";
import Invoice from "./midtrans/invoices";

if (!process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY) {
  throw new Error("ENV NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is required");
}

if (!process.env.MIDTRANS_SERVER_KEY) {
  throw new Error("ENV MIDTRANS_SERVER_KEY is required");
}

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const isSandbox = MIDTRANS_CLIENT_KEY.startsWith("SB-");

const snapClient = new Snap({
  isProduction: !isSandbox,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

const invoiceClient = new Invoice({
  isProduction: !isSandbox,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

const MIDTRANS_SNAP_URL = `https://app.${
  isSandbox ? "sandbox." : ""
}midtrans.com/snap/snap.js`;

export { MIDTRANS_CLIENT_KEY, MIDTRANS_SNAP_URL, invoiceClient };
export default snapClient;
