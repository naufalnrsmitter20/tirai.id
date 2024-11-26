import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        foreground: "#FFFFFF",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          900: "#133E87",
          800: "#133E87",
          700: "#0D2C60",
          600: "#113B7B",
          500: "#1A5E87",
          400: "#42659F",
          300: "#617EAF",
          200: "#92A6C8",
          100: "#B6C3DA",
          50: "#E7ECF3",
        },
        secondary: {
          700: "#AD8D19",
          600: "#DDB420",
          500: "#F3C623",
          400: "#F5D14F",
          300: "#F7D96C",
          200: "#F9E59A",
          100: "#FBEDBB",
          50: "#FEF9E9",
        },
        neutral: {
          700: "#454242",
          600: "#5F5C5C",
          500: "#787777",
          400: "#929292",
          300: "#ABABAB",
          200: "#C5C5C5",
          100: "#DBDBDB",
          50: "#F8F8F8",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
