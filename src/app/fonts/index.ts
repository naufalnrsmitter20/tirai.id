import localFont from "next/font/local";

const generalSansFont = localFont({
  src: [
    {
      path: "./GeneralSans-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./GeneralSans-ExtralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "./GeneralSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./GeneralSans-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./GeneralSans-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./GeneralSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./GeneralSans-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./GeneralSans-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./GeneralSans-SemiboldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./GeneralSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./GeneralSans-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

export default generalSansFont;
