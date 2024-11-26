import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for is not found.",
};

export default function NotFound() {
  return <>404 Not Found</>;
}
