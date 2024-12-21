import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join(
      "\n",
    ),
  },
});

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_ID;
export default analyticsDataClient;
